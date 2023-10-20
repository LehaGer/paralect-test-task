import { AppKoaContext, AppRouter, Next } from 'types';
import { analyticsService } from 'services';
import { cartService } from 'resources/cart';

async function validator(ctx: AppKoaContext, next: Next) {
  const { user } = ctx.state;

  const isCartExists = await cartService.exists({ customerId: user._id });

  ctx.assertClientError(isCartExists, {
    id: 'Cart with this customer id is not exists',
  });

  await next();
}

async function handler(ctx: AppKoaContext) {
  const { user } = ctx.state;

  const cart = await cartService.updateOne(
    { customerId: user._id },
    () => ({ productIds: [] }),
  );

  analyticsService.track('Cart successfully cleared', {
    cart,
  });

  ctx.body = cart;
}

export default (router: AppRouter) => {
  router.patch('/empty', validator, handler);
};
