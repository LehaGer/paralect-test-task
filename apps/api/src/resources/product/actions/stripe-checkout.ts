import { z } from 'zod';

import { AppKoaContext, AppRouter, Next } from 'types';
import { validateMiddleware } from 'middlewares';
import { Product, productService } from 'resources/product';
import stripeService from '../../../services/stripe/stripe.service';
import config from '../../../config';
import { User, userService } from 'resources/user';
import { Cart, cartService } from '../../cart';

const schema = z.object({
  id: z.string().optional(),
  customerId: z.string(),
});

interface ValidatedData extends z.infer<typeof schema> {
  product?: Product;
  customer: User;
  cart: Cart;
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

  const cart = await cartService.findOne({ customerId });

  ctx.assertClientError(!!cart, {
    ownerEmail: 'Cart with this customer id is not exists',
  });

  ctx.validatedData.cart = cart;

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { product, customer, cart } = ctx.validatedData;

  const cartProductsResp = await productService.find({ _id: { $in: cart.productIds } });
  const cartProducts = cartProductsResp.results;
  const products = product ? cartProducts.concat(product) : cartProducts;

  const stripeSession = await stripeService.checkout.sessions.create({
    customer: customer.stripe.customerId,
    line_items: products.map(prod => ({
      price: prod.stripe.priceId,
      quantity: 1,
    })),
    mode: 'payment',
    success_url: `${config.API_URL}/products/checkout-success?cartId=${cart._id}`,
    cancel_url: `${config.WEB_URL}/marketplace?success=false`,
  });

  ctx.response.redirect(stripeSession.url ?? `${config.WEB_URL}/marketplace?success=false`);
}

export default (router: AppRouter) => {
  router.post('/checkout', validateMiddleware(schema), validator, handler);
};
