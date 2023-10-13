import { z } from 'zod';

import { AppKoaContext, AppRouter, Next } from 'types';
import { validateMiddleware } from 'middlewares';
import { Product, productService } from 'resources/product';
import { User, userService } from 'resources/user';
import { Cart, cartService } from 'resources/cart';
import { analyticsService } from 'services';

const schema = z.object({
  productId: z.string(),
  customerId: z.string(),
});

interface ValidatedData extends z.infer<typeof schema> {
  customer: User;
  product: Product;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { productId, customerId } = ctx.validatedData;

  const customer = await userService.findOne({ _id: customerId });

  ctx.assertClientError(!!customer, {
    ownerEmail: 'User with this id is not exists',
  });

  ctx.validatedData.customer = customer;

  const product = await productService.findOne({ _id: productId });

  ctx.assertClientError(!!product, {
    ownerEmail: 'User with this id is not exists',
  });

  ctx.validatedData.product = product;

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { customer, product } = ctx.validatedData;

  await cartService.updateOne({
    $and: [{ customerId: customer._id }, { isCurrent: true }],
  }, (cartPrev) => ({
    ...cartPrev,
    customerId: customer._id,
    productIds: [
      ...cartPrev.productIds,
      product._id,
    ],
  }));

  analyticsService.track('New product added to cart', {
    product,
  });

  ctx.body = await productService.getPublic(product); //todo
}

export default (router: AppRouter) => {
  router.post('/add-to-cart', validateMiddleware(schema), validator, handler);
};
