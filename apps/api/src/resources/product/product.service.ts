import _ from 'lodash';

import db from 'db';
import { DATABASE_DOCUMENTS } from 'app.constants';

import schema from './product.schema';
import { Product } from './product.types';
import { userService } from '../user';

const service = db.createService<Product>(DATABASE_DOCUMENTS.PRODUCTS, {
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

const privateFields: string[] = [
  'ownerId',
];

const getPublic = async (product: Product | null) => {
  const owner = await userService.findOne({ _id: product?.ownerId });
  return Object.assign(_.omit(product, privateFields), {
    ownerEmail: owner?.email,
  });
};

export default Object.assign(service, {
  updateLastRequest,
  getPublic,
});
