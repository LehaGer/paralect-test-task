import { z } from 'zod';

import { AppKoaContext, AppRouter, Next } from '../../../types';
import { validateMiddleware } from '../../../middlewares';
import { Product, productService } from '../../product';
import { Cart, cartService } from '../index';
import { analyticsService } from '../../../services';

const schema = z.object({
  productId: z.string(),
});

interface ValidatedData extends z.infer<typeof schema> {
  cart: Cart;
  product: Product;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { user } = ctx.state;
  const { productId } = ctx.validatedData;

  const cart = await cartService.findOne({ customerId: user._id });

  ctx.assertClientError(!!cart, {
    cart: 'Cart with provided customer id is not exists',
  }, 404);

  ctx.assertClientError(!cart.productIds.includes(productId), {
    cart: 'Cart already contains the product',
  }, 409);

  ctx.validatedData.cart = cart;

  const product = await productService.findOne({ _id: productId });

  ctx.assertClientError(!!product, {
    product: 'Product with provided id is not exists',
  }, 400);

  ctx.validatedData.product = product;

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.state;
  const { product } = ctx.validatedData;

  const cart = await cartService.updateOne(
    { customerId: user._id },
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
