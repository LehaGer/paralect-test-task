import { z } from 'zod';

import { AppKoaContext, AppRouter, Next } from 'types';
import { validateMiddleware } from 'middlewares';
import { productService } from 'resources/product';
import { analyticsService } from 'services';
import { cartService } from 'resources/cart';

const schema = z.object({
  id: z.string(),
  productIds: z.string().array().optional(),
});

type ValidatedData = z.infer<typeof schema>;

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { id, productIds } = ctx.validatedData;

  const isCartExists = await cartService.exists({ _id: id });

  ctx.assertClientError(isCartExists, {
    id: 'Cart with this id is not exists',
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

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { id, productIds } = ctx.validatedData;

  const cart = await cartService.updateOne(
    { _id: id },
    () => ({
      productIds,
    }),
  );

  analyticsService.track('Cart successfully updated', {
    cart,
  });

  ctx.body = cart;
}

export default (router: AppRouter) => {
  router.patch('/', validateMiddleware(schema), validator, handler);
};
