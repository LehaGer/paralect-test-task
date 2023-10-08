import { z } from 'zod';

import { AppKoaContext, AppRouter, Next } from 'types';
import { validateMiddleware } from 'middlewares';
import { userService } from 'resources/user';
import { analyticsService } from 'services';
import cartService from '../cart.service';
import { productService } from 'resources/product';

const schema = z.object({
  customerId: z.string(),
  productIds: z.string().array().optional(),
});

async function validator(ctx: AppKoaContext<z.infer<typeof schema>>, next: Next) {
  const { customerId, productIds } = ctx.validatedData;

  const isCustomerExist = await userService.exists({ _id: customerId });

  ctx.assertClientError(isCustomerExist, {
    ownerEmail: 'User with this id is not exists',
  });

  if (productIds) {
    const productsInDb = await productService.find({ _id: { $in: productIds } });
    const productsIdsInDb = productsInDb.results.map(prod => prod._id);

    const notExistingProductsIds = productIds.filter(prodId => !productsIdsInDb.includes(prodId));

    ctx.assertClientError(!notExistingProductsIds.length, {
      ownerEmail: `'Products with id\'s ${notExistingProductsIds.join(', ')} are not exists'`,
    });
  }

  await next();
}

async function handler(ctx: AppKoaContext<z.infer<typeof schema>>) {
  const { customerId, productIds } = ctx.validatedData;

  const cart = await cartService.insertOne({
    customerId,
    productIds,
  });

  analyticsService.track('New cart created', {
    cart,
  });

  ctx.body = await cartService.getPublic(cart);
}

export default (router: AppRouter) => {
  router.post('/', validateMiddleware(schema), validator, handler);
};
