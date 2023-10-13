import { z } from 'zod';

import { AppKoaContext, AppRouter, Next } from 'types';
import { validateMiddleware } from 'middlewares';
import { Product, productService } from 'resources/product';
import stripeService from '../../../services/stripe/stripe.service';
import * as console from 'console';
import config from '../../../config';
import { User, userService } from 'resources/user';
import { cartService } from '../../cart';

const schema = z.object({
  id: z.string().optional(),
  customerId: z.string(),
});

interface ValidatedData extends z.infer<typeof schema> {
  product?: Product;
  customer: User;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { id, customerId } = ctx.validatedData;

  if (id) {

    const product = await productService.findOne({ _id: id });

    ctx.assertClientError(!!product, {
      ownerEmail: 'Product with this id is not exists',
    });

    ctx.validatedData.product = product;

  }

  const customer = await userService.findOne({ _id: customerId });

  ctx.assertClientError(!!customer, {
    ownerEmail: 'User with this id is not exists',
  });

  ctx.validatedData.customer = customer;

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { product, customer } = ctx.validatedData;

  const currentCart =
    await cartService.findOne({ isCurrent: true, customerId: customer._id })
    ?? await cartService.insertOne( { customerId: customer._id } );
  const currentCartProductIds = currentCart?.productIds ?? [];
  const currentCartProductsResp = await productService.find({ _id: { $in: currentCartProductIds } });
  const currentCartProducts = currentCartProductsResp.results;
  const products = product ? currentCartProducts.concat(product) : currentCartProducts;

  const stripeSession = await stripeService.checkout.sessions.create({
    customer: customer.stripe.customerId,
    line_items: products.map(prod => ({
      price: prod.stripe.priceId,
      quantity: 1,
    })),
    mode: 'payment',
    success_url: `${config.API_URL}/products/checkout-success?cartId=${currentCart._id}`,
    cancel_url: `${config.WEB_URL}/marketplace?success=true`,
  });

  await cartService.updateOne({ _id: currentCart._id }, cartPrev => {
    console.log(cartPrev); return ({
      ...cartPrev,
      stripe: {
        ...cartPrev?.stripe,
        paymentIntentionId: cartPrev?.stripe?.paymentIntentionId ?? undefined,
        sessionId: stripeSession.id,
      },
      isCurrent: true,
      paymentStatus: undefined,
    });
  });

  ctx.response.redirect(stripeSession.url ?? '');
  console.log({ ctx });
}

export default (router: AppRouter) => {
  router.post('/checkout', validateMiddleware(schema), validator, handler);
};
