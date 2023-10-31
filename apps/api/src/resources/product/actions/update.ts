import { z } from 'zod';

import { AppKoaContext, AppRouter, Next } from 'types';
import { validateMiddleware } from 'middlewares';
import { productService } from 'resources/product';
import { analyticsService } from 'services';
import { omitBy, isUndefined } from 'lodash';

const schema = z.object({
  name: z
    .string()
    .max(36, 'Name can not contain more then 36 symbols.')
    .optional(),
  price: z.number().min(0, 'Price can not be less then 0').optional(),
  imageUrl: z.string().url('provided image is not a url').optional(),
});

type ValidatedData = z.infer<typeof schema>;
type Request = {
  params: {
    id: string;
  }
};

async function validator(ctx: AppKoaContext<ValidatedData, Request>, next: Next) {
  const { id } = ctx.request.params;
  const { user } = ctx.state;

  const product = await productService.findOne({ _id: id });

  ctx.assertClientError(!!product, {
    product: 'Product with provided id is not exists',
  }, 404);

  ctx.assertClientError(product.ownerId === user._id, {
    permission: 'You are not owner of provided product',
  }, 403);

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData, Request>) {
  const { id } = ctx.request.params;
  const { name, price, imageUrl } = ctx.validatedData;

  const product = await productService.updateOne(
    { _id: id },
    () => omitBy({ name, price, imageUrl }, isUndefined),
  );

  analyticsService.track('Product successfully updated', {
    product,
  });

  ctx.body = product;
}

export default (router: AppRouter) => {
  router.patch('/:id', validateMiddleware(schema), validator, handler);
};
