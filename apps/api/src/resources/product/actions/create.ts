import { z } from 'zod';

import { AppKoaContext, AppRouter, Next } from 'types';
import { validateMiddleware } from 'middlewares';
import { productService } from 'resources/product';
import { User, userService } from 'resources/user';
import { analyticsService } from 'services';
import stripeService from '../../../services/stripe/stripe.service';
import * as https from 'https';

const schema = z.object({
  name: z.string().max(36, 'Name can not contain more then 36 symbols.'),
  price: z.number().min(0, 'Price can not be less then 0'),
  imageUrl: z.string().url('provided image is not a url'),
  ownerEmail: z.string().email(),
});

interface ValidatedData extends z.infer<typeof schema> {
  user: User;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { ownerEmail } = ctx.validatedData;

  const user = await userService.findOne({ email: ownerEmail });

  ctx.assertClientError(!!user, {
    ownerEmail: 'User with this email is not exists',
  });

  ctx.validatedData.user = user;

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const {
    name, price, imageUrl, user,
  } = ctx.validatedData;

  const fileBuffer = await new Promise<Buffer>((resolve, reject) => {
    https.get(imageUrl, async (response) => {
      const buff: any[] = [];

      response.on('data', chunk => buff.push(chunk));
      response.on('end', () => resolve(Buffer.concat(buff)));
      response.on('error', err => reject(`error converting stream - ${err}`));

    } );
  });

  const stripeFile = await stripeService.files.create({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
    purpose: 'product_image',
    file: {
      data: fileBuffer,
      name: imageUrl,
      type: 'image/jpeg',
    },
  });

  const stripeFileLink = await stripeService.fileLinks.create({
    file: stripeFile.id,
  });

  const stripeProduct = await stripeService.products.create({
    name,
    images: [stripeFileLink.url ?? ''],
  });

  const stripePrice = await stripeService.prices.create({
    product: stripeProduct.id,
    unit_amount: price * 100,
    currency: 'usd',
  });

  const product = await productService.insertOne({
    name,
    price,
    imageUrl,
    ownerId: user?._id,
    stripe: {
      productId: stripeProduct.id,
      priceId: stripePrice.id,
    },
  });

  analyticsService.track('New product created', {
    product,
  });

  ctx.body = product;
}

export default (router: AppRouter) => {
  router.post('/', validateMiddleware(schema), validator, handler);
};
