import { z } from 'zod';

import { AppKoaContext, AppRouter, Next } from '../../../types';
import { validateMiddleware } from '../../../middlewares';
import { productService } from '../../product';
import { cartService } from '../index';
import { analyticsService } from '../../../services';

const schema = z.object({
  productId: z.string(),
});

type ValidatedData = z.infer<typeof schema>;

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { user } = ctx.state;
  const { productId } = ctx.validatedData;

  const isCartExists = await cartService.findOne({ customerId: user._id });

  ctx.assertClientError(isCartExists, {
    ownerEmail: 'Cart with this customer id is not exists',
  });

  const isProductExists = await productService.exists({ _id: productId });

  ctx.assertClientError(isProductExists, {
    ownerEmail: 'User with this id is not exists',
  });

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.state;
  const { productId } = ctx.validatedData;

  const cart = await cartService.updateOne(
    { customerId: user._id },
    ({ productIds: prevProductIds }) => ({
      productIds: prevProductIds.filter(prevProductId => prevProductId !== productId),
    }),
  );

  analyticsService.track('Product removed from cart', {
    cart,
  });

  ctx.body = cart;
}

export default (router: AppRouter) => {
  router.patch('/remove-product', validateMiddleware(schema), validator, handler);
};
