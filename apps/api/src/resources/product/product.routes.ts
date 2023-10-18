import { routeUtil } from '../../utils';
import list from './actions/list';
import create from './actions/create';
import update from './actions/update';
import remove from './actions/remove';
import stripeCheckout from './actions/stripe-checkout';
import stripeWebhook from './actions/stripe-webhook';
import stripeCheckoutSuccess from './actions/stripe-checkout-success';
import uploadImage from './actions/upload-image';
import removeImage from './actions/remove-image';

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
  uploadImage,
  removeImage,
]);

const adminRoutes = routeUtil.getRoutes([
  list,
  create,
  update,
  remove,
  stripeCheckout,
  stripeCheckoutSuccess,
  uploadImage,
  removeImage,
]);

export default {
  publicRoutes,
  privateRoutes,
  adminRoutes,
};
