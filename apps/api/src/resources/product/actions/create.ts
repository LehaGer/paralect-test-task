import { z } from 'zod';

import { AppKoaContext, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';
import { productService } from 'resources/product';
import { analyticsService } from 'services';
import stripeService from '../../../services/stripe/stripe.service';
import * as https from 'https';

const schema = z.object({
  name: z.string().max(36, 'Name can not contain more then 36 symbols.'),
  price: z.number().min(0, 'Price can not be less then 0'),
  imageUrl: z.string().url('provided image is not a url'),
});

type ValidatedData = z.infer<typeof schema>;

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.state;
  const { name, price, imageUrl } = ctx.validatedData;

  const fileBuffer = await new Promise<Buffer>((resolve, reject) => {
    https.get(imageUrl, async (response) => {
      const buff: Uint8Array[] = [];

      response.on('data', (chunk: Uint8Array) => buff.push(chunk));
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

  ctx.status = 201;
  ctx.body = product;
}

export default (router: AppRouter) => {
  router.post('/', validateMiddleware(schema), handler);
};
