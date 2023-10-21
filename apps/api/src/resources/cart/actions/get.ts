import { z } from 'zod';

import { AppKoaContext, AppRouter, Next } from 'types';
import cartService from '../cart.service';
import { Cart } from '../cart.types';
import { validateMiddleware } from '../../../middlewares';

const schema = z.object({});

interface ValidatedData extends z.infer<typeof schema> {
  cart: Cart;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { user } = ctx.state;

  const cart = await cartService.findOne({ customerId: user._id });

  ctx.assertClientError(!!cart, {
    cart: 'Cart with provided customer id is not exists',
  }, 404);

  ctx.validatedData.cart = cart;

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { cart } = ctx.validatedData;

  ctx.body = cart;
}

export default (router: AppRouter) => {
  router.get('/', validateMiddleware(schema), validator, handler);
};
