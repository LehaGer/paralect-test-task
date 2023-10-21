import { z } from 'zod';

import { AppKoaContext, AppRouter, Next } from 'types';
import { validateMiddleware } from 'middlewares';
import config from '../../../config';
import { cartService } from '../../cart';

const schema = z.object({});

type ValidatedData = z.infer<typeof schema>;

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { user } = ctx.state;

  const isCartExists = await cartService.exists({ customerId: user._id });

  ctx.assertClientError(isCartExists, {
    cart: 'Cart with provided customer id is not exists',
  }, 400);

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.state;

  await cartService.updateOne(
    { customerId: user._id },
    () => ({ productIds: [] }),
  );

  ctx.response.redirect(`${config.WEB_URL}/marketplace?success=true`);
}

export default (router: AppRouter) => {
  router.get('/checkout-success', validateMiddleware(schema), validator, handler);
};
