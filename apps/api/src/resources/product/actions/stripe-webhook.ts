import { z } from 'zod';

import { AppKoaContext, AppRouter, Next } from 'types';
import { validateMiddleware } from 'middlewares';
import stripeService from 'services/stripe/stripe.service';
import * as console from 'console';
import config from 'config';
import Stripe from 'stripe';
import { cartService } from '../../cart';

const schema = z.object({});

interface ValidatedData {
  event: Stripe.Event;
}

async function handleCheckoutSessionCompleted(session: Stripe.Event) {
  await cartService.updateOne({ 'stripe.sessionId': session.id }, cartPrev => ({
    ...cartPrev,
    stripe: {
      ...cartPrev?.stripe,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      paymentIntentionId: session.payment_intent,
    },
    isCurrent: false,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    purchasedAt: session.payment_status === 'paid' ? (new Date()).toISOString() : undefined,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    paymentStatus: session.payment_status === 'paid' ? 'succeeded' : 'failed',
  }));
}
async function handleCheckoutSessionAsyncPaymentSucceeded(session: Stripe.Event) {
  await cartService.updateOne({ 'stripe.sessionId': session.id }, cartPrev => ({
    ...cartPrev,
    purchasedAt: (new Date()).toISOString(),
    paymentStatus: 'succeeded',
  }));
}
async function handleCheckoutSessionAsyncPaymentFailed(session: Stripe.Event) {
  await cartService.updateOne({ 'stripe.sessionId': session.id }, cartPrev => ({
    ...cartPrev,
    paymentStatus: 'failed',
  }));
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const sig = ctx.request.headers['stripe-signature'] ?? '';

  try {
    ctx.validatedData.event = stripeService.webhooks.constructEvent(
      ctx.request.rawBody,
      sig,
      config.STRIPE_ENDPOINT_SECRET,
    );
  } catch (err) {
    ctx.assertClientError(!err, {
      ownerEmail: `Webhook Error: ${(err instanceof Error) ? err.message : err}`,
    });
  }

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { event } = ctx.validatedData;

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object as Stripe.Event);
      break;
    case 'checkout.session.async_payment_succeeded':
      await handleCheckoutSessionAsyncPaymentSucceeded(event.data.object as Stripe.Event);
      break;
    case 'checkout.session.async_payment_failed':
      await handleCheckoutSessionAsyncPaymentFailed(event.data.object as Stripe.Event);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  ctx.status = 200;
}

export default (router: AppRouter) => {
  router.post('/webhook', validateMiddleware(schema), validator, handler);
};
