import { z } from 'zod';

import { AppKoaContext, AppRouter, Next } from 'types';
import { validateMiddleware } from 'middlewares';
import { User, userService } from 'resources/user';
import cartService from '../cart.service';
import stripeService from '../../../services/stripe/stripe.service';
import { productService } from '../../product';

const schema = z.object({
  page: z.string().transform(Number).default('1'),
  perPage: z.string().transform(Number).default('10'),
  sort: z.object({
    createdOn: z.enum(['asc', 'desc']).optional(),
    purchasedAt: z.enum(['asc', 'desc']).optional(),
  }).default({ createdOn: 'desc' }),
  filter: z.object({
    // id: z.string().optional(),
    customerId: z.string().optional(),
    // purchasedAt: z.object({
    //   from: z.date().optional(),
    //   to: z.date().optional(),
    // }).optional(),
    // paymentStatus: z.enum([
    //   'canceled',
    //   'failed',
    //   'pending',
    //   'reversed',
    //   'succeeded',
    // ]).optional(),
  }).optional(),
});

interface ValidatedData extends z.infer<typeof schema> {
  customer: User
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { filter } = ctx.validatedData;

  /* if (filter?.id) {

    const cart = await cartService.exists({ _id: filter.id });

    ctx.assertClientError(cart, {
      ownerEmail: `Cart with id ${filter?.id} is not exists`,
    });

  } */

  if (filter?.customerId) {
    const customer = await userService.findOne({ _id: filter.customerId });

    ctx.assertClientError(!!customer, {
      ownerEmail: `User with id ${filter?.customerId} is not exists`,
    });

    ctx.validatedData.customer = customer;
  }

  /* if (filter?.purchasedAt) {

    if (!!filter.purchasedAt.from && !!filter.purchasedAt.to) {
      const isCorrectPriceRange = filter.purchasedAt.to >= filter.purchasedAt.from;

      ctx.assertClientError(isCorrectPriceRange, {
        ownerEmail: 'Purchase time "from" must be <= "to" time',
      });
    }

  } */

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { perPage, customer } = ctx.validatedData;

  const stripeCheckoutSessions = await stripeService.checkout.sessions.list({
    customer: customer.stripe.customerId,
    expand: [ 'data.line_items' ],
    limit: perPage,
    // starting_after: '',
    // ending_before: '',
  });

  const cartsWithStripeSessionInfo = await Promise.all(stripeCheckoutSessions.data.map(async sessionInfo => {

    const cart = await cartService.findOne({ 'stripe.sessionId': sessionInfo.id });

    const stripeProductsIds = sessionInfo.line_items?.data
      .map(item => item.price?.product)
      .filter(val => !!val) as string[] ?? [];
    const productsFromStripeSession = await Promise
      .all(stripeProductsIds
        .map(stripeProductId =>
          productService.findOne({ 'stripe.productId': stripeProductId })));

    const productsFromDbResp = await productService.find({
      _id: { $in: cart?.productIds ?? [] },
    });
    const productsFromDb = productsFromDbResp.results;

    const products = productsFromStripeSession
      .concat(productsFromDb)
      .filter(val => !!val?._id)
      .filter((value, index, array) => {
        const firstItemIndex = array.findIndex(arrayItem => arrayItem?._id === value?._id);
        return firstItemIndex === index;
      });

    return {
      cart,
      stripeCheckoutSessionWithItems: sessionInfo,
      products,
    };

  }));

  /* const carts = await cartService.find(
    {
      $and: [
        filter?.id ? {
          _id: filter?.id,
        } : {},
        filter?.customerId ? {
          customerId: filter?.customerId,
        } : {},
        { isCurrent: false },
        /!* filter?.purchasedAt ? {
          purchasedAt: {
            $gte: (filter?.purchasedAt.from ?? ''),
            $lte: (filter?.purchasedAt.to ?? Infinity),
          },
        } : {}, *!/
      ],
    },
    { page, perPage },
    { sort },
  ); */

  ctx.body = {
    items: cartsWithStripeSessionInfo,
    totalPages: cartsWithStripeSessionInfo.length, // todo:
    count: cartsWithStripeSessionInfo.length,
  };
}

export default (router: AppRouter) => {
  router.get('/history', validateMiddleware(schema), validator, handler);
};
