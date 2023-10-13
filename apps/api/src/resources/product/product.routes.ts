import { routeUtil } from '../../utils';
import list from './actions/list';
import create from './actions/create';
import update from './actions/update';
import remove from './actions/remove';
import stripeCheckout from './actions/stripe-checkout';
import stripeWebhook from './actions/stripe-webhook';
import stripeCheckoutSuccess from './actions/stripe-checkout-success';

const publicRoutes = routeUtil.getRoutes([
  stripeWebhook,
]);

const privateRoutes = routeUtil.getRoutes([
  list,
  create,
  update,
  remove,
  stripeCheckout,
  stripeCheckoutSuccess,
]);

const adminRoutes = routeUtil.getRoutes([
  list,
  create,
  update,
  remove,
  stripeCheckout,
  stripeCheckoutSuccess,
]);

export default {
  publicRoutes,
  privateRoutes,
  adminRoutes,
};
