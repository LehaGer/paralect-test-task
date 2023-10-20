import { routeUtil } from '../../utils';
import get from './actions/get';
import update from './actions/update';
import getHistory from './actions/get-history';
import empty from './actions/empty';
import addToCart from './actions/add-product';
import addProduct from './actions/add-product';
import removeProduct from './actions/remove-product';

const publicRoutes = routeUtil.getRoutes([]);

const privateRoutes = routeUtil.getRoutes([
  get,
  update,
  getHistory,
  empty,
  addToCart,
  addProduct,
  removeProduct,
]);

const adminRoutes = routeUtil.getRoutes([
  get,
  update,
  getHistory,
  empty,
  addProduct,
  removeProduct,
]);

export default {
  publicRoutes,
  privateRoutes,
  adminRoutes,
};
