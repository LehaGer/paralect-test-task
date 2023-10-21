import { z } from 'zod';

import { AppKoaContext, AppRouter, Next } from 'types';
import { validateMiddleware } from 'middlewares';
import { Product, productService } from 'resources/product';
import stripeService from '../../../services/stripe/stripe.service';
import config from '../../../config';
import { Cart, cartService } from '../../cart';
import { uniqBy } from 'lodash';

const schema = z.object({});

interface ValidatedData extends z.infer<typeof schema> {
  product?: Product;
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

    const product = await productService.findOne({ _id: productId });

    ctx.assertClientError(!!product, {
      product: 'Product with provided id is not exists',
    }, 404);

    ctx.validatedData.product = product;

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
  const { product, cart } = ctx.validatedData;

  const cartProducts = await productService
    .find({ _id: { $in: cart.productIds } })
    .then(res => res.results);
  const products = uniqBy(product ? cartProducts.concat(product) : cartProducts, '_id');

  const stripeSession = await stripeService.checkout.sessions.create({
    customer: user.stripe.customerId,
    line_items: products.map(prod => ({
      price: prod.stripe.priceId,
      quantity: 1,
    })),
    mode: 'payment',
    success_url: `${config.API_URL}/products/checkout-success`,
    cancel_url: `${config.WEB_URL}/marketplace?success=false`,
  });

  ctx.response.redirect(stripeSession.url ?? `${config.WEB_URL}/marketplace?success=false`);
}

export default (router: AppRouter) => {
  router.post('/checkout/:productId*', validateMiddleware(schema), validator, handler);
};
