import { z } from 'zod';

import { AppKoaContext, AppRouter, Next } from 'types';
import { validateMiddleware } from 'middlewares';
import { Product, productService } from 'resources/product';
import { analyticsService } from 'services';

const schema = z.object({
  id: z.string(),
});

interface ValidatedData extends z.infer<typeof schema> {
  product: Product;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { id } = ctx.validatedData;

  const isProductExists = await productService.exists({ _id: id });

  ctx.assertClientError(isProductExists, {
    id: 'Product with this id is not exists',
  });

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { id } = ctx.validatedData;

  const product = await productService.deleteOne({ _id: id });

  analyticsService.track('Product successfully removed', {
    product,
  });

  ctx.status = 204;
}

export default (router: AppRouter) => {
  router.delete('/', validateMiddleware(schema), validator, handler);
};
