import { z } from 'zod';

import { AppKoaContext, AppRouter, Next } from 'types';
import { validateMiddleware } from 'middlewares';
import { productService } from 'resources/product';
import stripeService from 'services/stripe/stripe.service';
import config from 'config';
import { Cart, cartService } from 'resources/cart';
import { uniq } from 'lodash';

const schema = z.object({});

interface ValidatedData extends z.infer<typeof schema> {
  cart: Cart;
}
type Request = {
  params: {
    productId?: string;
  }
};


async function validator(ctx: AppKoaContext<ValidatedData, Request>, next: Next) {
  const { productId } = ctx.request.params;
  const { user } = ctx.state;

  if (productId) {

    const isProductExists = await productService.exists({ _id: productId });

    ctx.assertClientError(isProductExists, {
      product: 'Product with provided id is not exists',
    }, 404);

  }

  const cart = await cartService.findOne({ customerId: user._id });

  ctx.assertClientError(!!cart, {
    cart: 'Cart with provided customer id is not exists',
  }, 400);

  ctx.validatedData.cart = cart;

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData, Request>) {
  const { user } = ctx.state;
  const { cart } = ctx.validatedData;
  const { productId } = ctx.request.params;

  let productIds: string[] = cart.productIds;

  if (productId) await cartService.updateOne(
    { _id: cart._id },
    ({ productIds: prevProdIds }) => {
      productIds = uniq(prevProdIds.concat([productId]));
      return ({ productIds: productIds });
    },
  );

  const products = await productService
    .find({ _id: { $in: productIds } })
    .then(res => res.results);

  const stripeSession = await stripeService.checkout.sessions.create({
    customer: user.stripe.customerId,
    line_items: products.map(prod => ({
      price: prod.stripe.priceId,
      quantity: 1,
    })),
    mode: 'payment',
    success_url: `${config.API_URL}/products/checkout-success`,
    cancel_url: `${config.WEB_URL}/payment-rejected`,
  });

  ctx.response.redirect(stripeSession.url ?? `${config.WEB_URL}/payment-rejected`);
}

export default (router: AppRouter) => {
  router.post('/checkout/:productId*', validateMiddleware(schema), validator, handler);
};
