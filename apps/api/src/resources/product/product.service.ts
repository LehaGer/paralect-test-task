import db from 'db';
import { DATABASE_DOCUMENTS } from 'app.constants';

import schema from './product.schema';
import { Product } from './product.types';

const service = db.createService<Product>(DATABASE_DOCUMENTS.PRODUCTS, {
  schemaValidator: (obj) => schema.parseAsync(obj),
});

const updateLastRequest = (_id: string) => service.atomic.updateOne(
  { _id },
  {
    $set: {
      lastRequest: new Date(),
    },
  },
);

export default Object.assign(service, {
  updateLastRequest,
});
