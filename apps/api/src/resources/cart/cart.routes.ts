import { routeUtil } from '../../utils';
import get from './actions/get';
import update from './actions/update';
import getHistory from './actions/get-history';
import empty from './actions/empty';

const publicRoutes = routeUtil.getRoutes([]);

const privateRoutes = routeUtil.getRoutes([
  get,
  update,
  getHistory,
  empty,
]);

const adminRoutes = routeUtil.getRoutes([
  get,
  update,
  getHistory,
]);

export default {
  publicRoutes,
  privateRoutes,
  adminRoutes,
};
