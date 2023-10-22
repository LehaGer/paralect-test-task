import { z } from 'zod';

import { AppKoaContext, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';
import stripeService from '../../../services/stripe/stripe.service';

const schema = z.object({
  perPage: z.string().transform(Number).default('10'),
  filter: z.object({
    startingAfter: z.string().optional(),
    endingBefore: z.string().optional(),
  }).optional(),
});

type ValidatedData = z.infer<typeof schema>;

const responseSchema = z.object({
  items: z.object({
    id: z.string(),
    status: z.enum(['complete', 'expired', 'open']).nullable(),
    paymentStatus: z.enum(['no_payment_required', 'paid', 'unpaid']),
    totalCost: z.number().min(0).nullable(),
    paymentIntentTime: z.date(),
    products: z.object({
      id: z.string(),
      price: z.number().min(0),
      name: z.string(),
      imageUrl: z.string().url().nullable(),
    }).array(),
  }).array(),
  hasMore: z.boolean(),
});

type ResponseType = z.infer<typeof responseSchema>;

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.state;
  const { perPage, filter } = ctx.validatedData;

  const stripeCheckoutSessionsResp = await stripeService.checkout.sessions.list({
    customer: user.stripe.customerId,
    expand: [ 'data.line_items' ],
    limit: perPage,
    starting_after: filter?.startingAfter,
    ending_before: filter?.endingBefore,
  });

  const stripeUniqProductIds = stripeCheckoutSessionsResp.data
    .reduce(
      (previousProductIds, session) => {
        const productIds = session.line_items?.data
          .map(item => item.price?.product)
          .filter(productId => !!productId) as string[]
          ?? [];
        const uniqProductIds = productIds.filter(productId => !previousProductIds.includes(productId));
        return [...previousProductIds, ...uniqProductIds];
      },
      Array<string>(),
    );

  const stripeUniqProducts = await Promise.all(stripeUniqProductIds.map(stripeProductId => {
    return stripeService.products.retrieve(stripeProductId);
  }));

  const resultingInfo: ResponseType = {
    items: stripeCheckoutSessionsResp.data.map(session => ({
      id: session.id,
      status: session.status,
      paymentStatus: session.payment_status,
      totalCost: session.amount_total ? session.amount_total / 100 : null,
      paymentIntentTime: new Date(session.created * 1000),
      products: session.line_items?.data.map((item) => {
        const stripeProduct = stripeUniqProducts.find(product => product.id === item.price?.product);
        return {
          id: item.price?.product as string,
          price: item.amount_total / 100,
          name: stripeProduct?.name ?? '',
          imageUrl: stripeProduct?.images[0] ?? null,
        };
      }) ?? [],
    })),
    hasMore: stripeCheckoutSessionsResp.has_more,
  };

  ctx.body = resultingInfo;
}

export default (router: AppRouter) => {
  router.get('/history', validateMiddleware(schema), handler);
};
