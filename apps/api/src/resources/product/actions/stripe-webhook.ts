import { AppKoaContext, AppRouter, Next } from 'types';
import stripeService from 'services/stripe/stripe.service';
import * as console from 'console';
import config from 'config';
import Stripe from 'stripe';
import { analyticsService } from '../../../services';

interface ValidatedData {
  event: Stripe.Event;
}

async function handleCheckoutSessionCompleted(session: Stripe.Event) {
  analyticsService.track('checkout.session.completed event came', {
    session,
  });
}
async function handleCheckoutSessionAsyncPaymentSucceeded(session: Stripe.Event) {
  analyticsService.track('checkout.session.async_payment_succeeded event came', {
    session,
  });
}
async function handleCheckoutSessionAsyncPaymentFailed(session: Stripe.Event) {
  analyticsService.track('checkout.session.async_payment_failed event came', {
    session,
  });
}
async function handleCheckoutSessionExpired(session: Stripe.Event) {
  analyticsService.track('checkout.session.expired event came', {
    session,
  });
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
    case 'checkout.session.expired':
      await handleCheckoutSessionExpired(event.data.object as Stripe.Event);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  ctx.status = 200;
}

export default (router: AppRouter) => {
  router.post('/webhook', validator, handler);
};
