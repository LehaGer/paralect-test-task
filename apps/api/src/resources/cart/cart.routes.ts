import { routeUtil } from '../../utils';
import create from './actions/create';
import list from './actions/list';
import update from './actions/update';
import remove from './actions/remove';
import getHistory from './actions/get-history';

const publicRoutes = routeUtil.getRoutes([
]);

const privateRoutes = routeUtil.getRoutes([
  create,
  list,
  update,
  remove,
  getHistory,
]);

const adminRoutes = routeUtil.getRoutes([
  create,
  list,
  update,
  remove,
  getHistory,
]);

export default {
  publicRoutes,
  privateRoutes,
  adminRoutes,
};
