import config from 'config';
// eslint-disable-next-line import/no-extraneous-dependencies
import Stripe from 'stripe';

// const stripe = require('stripe')(config.STRIPE_SECRET_KEY);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const stripe = new Stripe(config.STRIPE_SECRET_KEY);

export default stripe;
