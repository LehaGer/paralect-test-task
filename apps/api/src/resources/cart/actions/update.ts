import { z } from 'zod';

import { AppKoaContext, AppRouter, Next } from 'types';
import { validateMiddleware } from 'middlewares';
import { productService } from 'resources/product';
import { userService } from 'resources/user';
import { analyticsService } from 'services';
import { cartService } from 'resources/cart';

const schema = z.object({
  id: z.string(),
  customerId: z.string().optional(),
  productIds: z.string().array().optional(),
  isCurrent: z.boolean().optional(),
  paymentStatus: z.enum([
    'canceled',
    'failed',
    'pending',
    'reversed',
    'succeeded',
  ]).optional(),
  stripe: z.object({
    sessionId: z.string().optional(),
    paymentIntentionId: z.string().optional(),
  }).optional(),
});

async function validator(ctx: AppKoaContext<z.infer<typeof schema>>, next: Next) {
  const { id, customerId, productIds } = ctx.validatedData;

  const isCartExists = await cartService.exists({ _id: id });

  ctx.assertClientError(isCartExists, {
    id: 'Product with this id is not exists',
  });

  if (customerId) {
    const isUserExists = await userService.exists({ _id: customerId });

    ctx.assertClientError(isUserExists, {
      ownerEmail: 'User with this email is not exists',
    });
  }

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
  const { id, productIds, customerId, isCurrent, paymentStatus, stripe } = ctx.validatedData;

  const cart = await cartService.updateOne({ _id: id }, cartPrev => ({
    ...cartPrev,
    customerId: customerId ?? cartPrev.customerId ?? undefined,
    productIds: productIds ?? cartPrev.productIds ?? undefined,
    isCurrent: isCurrent ?? cartPrev.isCurrent ?? undefined,
    paymentStatus: paymentStatus ?? cartPrev.paymentStatus ?? undefined,
    stripe: {
      ...cartPrev.stripe,
      sessionId: stripe?.sessionId ?? cartPrev.stripe?.sessionId ?? undefined,
      paymentIntentionId: stripe?.paymentIntentionId ?? cartPrev.stripe?.paymentIntentionId ?? undefined,
    },
  }));

  analyticsService.track('Cart successfully updated', {
    cart,
  });

  ctx.body = cart;
}

export default (router: AppRouter) => {
  router.patch('/', validateMiddleware(schema), validator, handler);
};
