import db from 'db';
import { DATABASE_DOCUMENTS } from 'app.constants';

import schema from './cart.schema';
import { Cart } from './cart.types';

const service = db.createService<Cart>(DATABASE_DOCUMENTS.CARTS, {
  schemaValidator: (obj) => schema.parseAsync(obj),
});

const updateLastRequest = (_id: string) => {
  return service.atomic.updateOne(
    { _id },
    {
      $set: {
        lastRequest: new Date(),
      },
    },
  );
};

const getPublic = async (cart: Cart | null) => {
  return cart;
};

export default Object.assign(service, {
  updateLastRequest,
  getPublic,
});
