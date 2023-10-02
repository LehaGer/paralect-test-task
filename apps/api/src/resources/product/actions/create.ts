import { z } from 'zod';

import { AppKoaContext, AppRouter, Next } from 'types';
import { validateMiddleware } from 'middlewares';
import { Product, productService } from 'resources/product';
import { userService } from 'resources/user';
import { analyticsService } from 'services';

const schema = z.object({
  name: z.string().max(36, 'Name can not contain more then 36 symbols.'),
  price: z.number().min(0, 'Price can not be less then 0'),
  imageUrl: z.string().url('provided image is not a url'),
  ownerEmail: z.string().email(),
});

interface ValidatedData extends z.infer<typeof schema> {
  product: Product;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { ownerEmail } = ctx.validatedData;

  const isUserExists = await userService.exists({ email: ownerEmail });

  ctx.assertClientError(isUserExists, {
    ownerEmail: 'User with this email is not exists',
  });

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const {
    name, price, imageUrl, ownerEmail,
  } = ctx.validatedData;

  const user = await userService.findOne({ email: ownerEmail });

  const product = await productService.insertOne({
    name, price, imageUrl, ownerId: user?._id,
  });

  analyticsService.track('New product created', {
    product,
  });

  ctx.body = await productService.getPublic(product);
}

export default (router: AppRouter) => {
  router.post('/', validateMiddleware(schema), validator, handler);
};
