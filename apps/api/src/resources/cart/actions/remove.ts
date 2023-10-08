import { z } from 'zod';

import { AppKoaContext, AppRouter, Next } from 'types';
import { validateMiddleware } from 'middlewares';
import { analyticsService } from 'services';
import { cartService } from 'resources/cart';

const schema = z.object({
  id: z.string(),
});

async function validator(ctx: AppKoaContext<z.infer<typeof schema>>, next: Next) {
  const { id } = ctx.validatedData;

  const isCartExists = await cartService.exists({ _id: id });

  ctx.assertClientError(isCartExists, {
    id: 'Product with this id is not exists',
  });

  await next();
}

async function handler(ctx: AppKoaContext<z.infer<typeof schema>>) {
  const { id } = ctx.validatedData;

  const cart = await cartService.deleteOne({ _id: id });

  analyticsService.track('Product successfully removed', {
    cart,
  });

  ctx.status = 204;
}

export default (router: AppRouter) => {
  router.delete('/', validateMiddleware(schema), validator, handler);
};
