import { z } from 'zod';

import { AppKoaContext, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';
import stripeService from '../../../services/stripe/stripe.service';
import Stripe from 'stripe';

const schema = z.object({
  page: z.string().transform(Number).default('1'),
  perPage: z.string().transform(Number).default('10'),
  sort: z.object({
    createdAt: z.enum(['asc', 'desc']).optional(),
  }).default({ createdAt: 'desc' }),
  filter: z.object({
    startingAfter: z.string().optional(),
    endingBefore: z.string().optional(),
    createdAt: z.object({
      from: z.date().optional(),
      to: z.date().optional(),
    }).optional(),
    status: z.enum(['complete', 'expired', 'open']).optional(),
    paymentStatus: z.enum(['no_payment_required', 'paid', 'unpaid']).optional(),
  }).optional(),
});

type ValidatedData = z.infer<typeof schema>;

const responseSchema = z.object({
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
});

type ResponseType = z.infer<typeof responseSchema>;

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.state;
  const { perPage, page, filter, sort } = ctx.validatedData;

  const isSatisfiesCreatedAtCondition = (sessionCreationTime: number) => {
    const sessionCreationTimeDate = new Date(sessionCreationTime);

    let iSatisfiesFromCondition: boolean;
    let iSatisfiesToCondition: boolean;

    if (!filter?.createdAt?.from) {
      iSatisfiesFromCondition = true;
    } else {
      const filterCreationFromDate = filter?.createdAt?.from as Date;
      iSatisfiesFromCondition = filterCreationFromDate <= sessionCreationTimeDate;
    }

    if (!filter?.createdAt?.to) {
      iSatisfiesToCondition = true;
    } else {
      const filterCreationToDate = filter?.createdAt?.to as Date;
      iSatisfiesToCondition = filterCreationToDate <= sessionCreationTimeDate;
    }

    return iSatisfiesFromCondition && iSatisfiesToCondition;
  };
  const isSatisfiesStatusCondition = (sessionStatus: Stripe.Checkout.Session.Status | null) => {
    if (!filter?.status) return true;
    return filter?.status === sessionStatus;
  };
  const isSatisfiesPaymentStatusCondition = (sessionPaymentStatus: Stripe.Checkout.Session.PaymentStatus) => {
    if (!filter?.paymentStatus) return true;
    return filter?.paymentStatus === sessionPaymentStatus;
  };

  const stripeCheckoutSessions: Stripe.Checkout.Session[] = [];

  await stripeService.checkout.sessions.list({
    customer: user.stripe.customerId,
    expand: [ 'data.line_items' ],
    limit: 10,
    starting_after: filter?.startingAfter,
    ending_before: filter?.endingBefore,
  }).autoPagingEach(session => {
    if (!isSatisfiesCreatedAtCondition(session.created)) return;
    if (!isSatisfiesStatusCondition(session.status)) return;
    if (!isSatisfiesPaymentStatusCondition(session.payment_status)) return;
    stripeCheckoutSessions.push(session);
  });

  if (sort?.createdAt === 'asc') stripeCheckoutSessions.reverse();

  const stripeCheckoutSessionsPaginated = stripeCheckoutSessions.slice((page - 1) * perPage, page * perPage);

  const stripeUniqProductIds = stripeCheckoutSessionsPaginated
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

  const resultingInfo: ResponseType[] = stripeCheckoutSessionsPaginated.map(session => ({
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
  }));

  ctx.body = {
    count: resultingInfo.length,
    items: resultingInfo,
    totalPages: Math.round(resultingInfo.length / perPage + .5),
  };
}

export default (router: AppRouter) => {
  router.get('/history', validateMiddleware(schema), handler);
};
