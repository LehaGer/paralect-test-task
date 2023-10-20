import { z } from 'zod';

import { AppKoaContext, AppRouter, Next } from '../../../types';
import { validateMiddleware } from '../../../middlewares';
import { Product, productService } from '../../product';
import { User, userService } from '../../user';
import { Cart, cartService } from '../index';
import { analyticsService } from '../../../services';

const schema = z.object({
  productId: z.string(),
  customerId: z.string(),
});

interface ValidatedData extends z.infer<typeof schema> {
  customer: User;
  cart: Cart;
  product: Product;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { productId, customerId } = ctx.validatedData;

  const customer = await userService.findOne({ _id: customerId });

  ctx.assertClientError(!!customer, {
    ownerEmail: 'User with this id is not exists',
  });

  const cart = await cartService.findOne({ customerId });

  ctx.assertClientError(!!cart, {
    ownerEmail: 'Cart with this customer id is not exists',
  });

  ctx.assertClientError(!cart.productIds.includes(productId), {
    ownerEmail: 'Cart already contains the product',
  });

  ctx.validatedData.cart = cart;

  const product = await productService.findOne({ _id: productId });

  ctx.assertClientError(!!product, {
    ownerEmail: 'User with this id is not exists',
  });

  ctx.validatedData.product = product;

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { customer, product } = ctx.validatedData;

  const cart = await cartService.updateOne(
    { customerId: customer._id },
    ({ productIds: prevProductIds }) => ({
      productIds: [...prevProductIds, product._id],
    }),
  );

  analyticsService.track('New product added to cart', {
    cart,
  });

  ctx.body = cart;
}

export default (router: AppRouter) => {
  router.patch('/add-product', validateMiddleware(schema), validator, handler);
};
