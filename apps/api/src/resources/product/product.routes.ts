import { routeUtil } from '../../utils';
import stripeCheckout from './actions/stripe-checkout';
import list from './actions/list';
import create from './actions/create';
import update from './actions/update';
import remove from './actions/remove';

const publicRoutes = routeUtil.getRoutes([]);

const privateRoutes = routeUtil.getRoutes([
  list,
  create,
  update,
  remove,
  stripeCheckout,
]);

const adminRoutes = routeUtil.getRoutes([
  list,
  create,
  update,
  remove,
  stripeCheckout,
]);

export default {
  publicRoutes,
  privateRoutes,
  adminRoutes,
};
