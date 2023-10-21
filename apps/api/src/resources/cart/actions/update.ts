import { z } from 'zod';

import { AppKoaContext, AppRouter, Next } from 'types';
import { validateMiddleware } from 'middlewares';
import { productService } from 'resources/product';
import { analyticsService } from 'services';
import { cartService } from 'resources/cart';

const schema = z.object({
  productIds: z.string().array().optional(),
});

type ValidatedData = z.infer<typeof schema>;

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { user } = ctx.state;
  const { productIds } = ctx.validatedData;

  const isCartExists = await cartService.exists({ customerId: user._id });

  ctx.assertClientError(isCartExists, {
    cart: 'Cart with provided customer id is not exists',
  }, 404);

  if (productIds) {
    const productsInDb = await productService.find({ _id: { $in: productIds } });
    const productsIdsInDb = productsInDb.results.map(prod => prod._id);

    const notExistingProductsIds = productIds.filter(prodId => !productsIdsInDb.includes(prodId));

    ctx.assertClientError(!notExistingProductsIds.length, {
      product: `'Products with id\'s ${notExistingProductsIds.join(', ')} are not exists'`,
    }, 400);
  }

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.state;
  const { productIds } = ctx.validatedData;

  const cart = await cartService.updateOne(
    { customerId: user._id },
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
