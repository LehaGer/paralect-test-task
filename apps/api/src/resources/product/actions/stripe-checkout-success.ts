import { z } from 'zod';

import { AppKoaContext, AppRouter, Next } from 'types';
import { validateMiddleware } from 'middlewares';
import config from '../../../config';
import { Cart, cartService } from '../../cart';

const schema = z.object({
  cartId: z.string(),
});

interface ValidatedData extends z.infer<typeof schema> {
  cart: Cart,
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { cartId } = ctx.validatedData;

  const cart = await cartService.findOne({ _id: cartId });

  ctx.assertClientError(!!cart, {
    ownerEmail: 'Cart with this id is not exists',
  });

  ctx.validatedData.cart = cart;

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { cart } = ctx.validatedData;

  await cartService.updateOne({ _id: cart._id }, cartPrev => {
    return ({
      ...cartPrev,
      stripe: {
        ...cartPrev.stripe,
        paymentIntentionId: cartPrev.stripe?.paymentIntentionId ?? undefined,
        sessionId: cartPrev.stripe?.sessionId,
      },
      isCurrent: false,
      paymentStatus: 'pending',
    });
  });

  ctx.response.redirect(`${config.WEB_URL}/marketplace/`);
}

export default (router: AppRouter) => {
  router.get('/checkout-success', validateMiddleware(schema), validator, handler);
};
