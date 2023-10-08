import { z } from 'zod';

import { AppKoaContext, AppRouter, Next } from 'types';
import { validateMiddleware } from 'middlewares';
import { Product, productService } from 'resources/product';
import stripeService from '../../../services/stripe/stripe.service';
import * as console from 'console';
import config from '../../../config';
import { User, userService } from 'resources/user';

const schema = z.object({
  id: z.string(),
  customerId: z.string(),
});

interface ValidatedData extends z.infer<typeof schema> {
  product: Product;
  customer: User;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { id, customerId } = ctx.validatedData;

  const product = await productService.findOne({ _id: id });

  ctx.assertClientError(!!product, {
    ownerEmail: 'Product with this id is not exists',
  });

  const customer = await userService.findOne({ _id: customerId });

  ctx.assertClientError(!!customer, {
    ownerEmail: 'User with this id is not exists',
  });

  ctx.validatedData.product = product;
  ctx.validatedData.customer = customer;

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { product, customer } = ctx.validatedData;

  const stripeSession = await stripeService.checkout.sessions.create({
    customer: customer.stripe.customerId,
    line_items: [
      {
        price: product.stripe.priceId,
        quantity: 1,
      },
      {
        price: 'price_1NxxyTF7lgekW04H1ENJEz4A',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${config.WEB_URL}/marketplace?success=true`,
    cancel_url: `${config.WEB_URL}/marketplace?canceled=true`,
  });

  ctx.response.redirect(stripeSession.url ?? '');
  console.log({ ctx });
}

export default (router: AppRouter) => {
  router.post('/checkout', validateMiddleware(schema), validator, handler);
};
