import { z } from 'zod';

import { AppKoaContext, AppRouter, Next } from 'types';
import { validateMiddleware } from 'middlewares';
import { Product, productService } from 'resources/product';
import { userService } from 'resources/user';
import { analyticsService } from 'services';

const schema = z.object({
  id: z.string(),
  name: z
    .string()
    .max(36, 'Name can not contain more then 36 symbols.')
    .optional(),
  price: z.number().min(0, 'Price can not be less then 0').optional(),
  imageUrl: z.string().url('provided image is not a url').optional(),
  ownerEmail: z.string().email().optional(),
});

interface ValidatedData extends z.infer<typeof schema> {
  product: Product;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { id, ownerEmail } = ctx.validatedData;

  const isProductExists = await productService.exists({ _id: id });

  ctx.assertClientError(isProductExists, {
    id: 'Product with this id is not exists',
  });

  if (ownerEmail) {
    const isUserExists = await userService.exists({ email: ownerEmail });

    ctx.assertClientError(isUserExists, {
      ownerEmail: 'User with this email is not exists',
    });
  }

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { id, name, price, imageUrl, ownerEmail } = ctx.validatedData;

  const user = ownerEmail
    ? await userService.findOne({ email: ownerEmail })
    : undefined;

  const filteredEnteringData = Object.fromEntries(Object.entries({ name, price, imageUrl, ownerId: user?._id }).
    filter((entry) => {
      if (entry[1] !== null && entry[1] !== undefined) return entry;
    }));

  const product = await productService.updateOne(
    { _id: id },
    (productPrev) => ({
      ...productPrev,
      ...filteredEnteringData,
    }),
  );

  analyticsService.track('Product successfully updated', {
    product,
  });

  ctx.body = product;
}

export default (router: AppRouter) => {
  router.patch('/', validateMiddleware(schema), validator, handler);
};
