import { z } from 'zod';

import { AppKoaContext, AppRouter, Next } from 'types';
import { validateMiddleware } from 'middlewares';
import { userService } from 'resources/user';
import cartService from '../cart.service';

const schema = z.object({
  page: z.string().transform(Number).default('1'),
  perPage: z.string().transform(Number).default('10'),
  sort: z
    .object({
      createdOn: z.enum(['asc', 'desc']).optional(),
    })
    .default({ createdOn: 'desc' }),
  filter: z
    .object({
      id: z.string().optional(),
      customerId: z.string().optional(),
      purchaseTime: z
        .object({
          from: z.date().optional(),
          to: z.date().optional(),
        })
        .optional(),
    })
    .optional(),
});

type ValidatedData = z.infer<typeof schema>;

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { filter } = ctx.validatedData;

  if (filter?.id) {

    const cart = cartService.exists({ _id: filter.id });

    ctx.assertClientError(!!cart, {
      ownerEmail: `Cart with id ${filter?.id} is not exists`,
    });

  }

  if (filter?.customerId) {
    const customer = userService.exists({ _id: filter.customerId });

    ctx.assertClientError(!!customer, {
      ownerEmail: `User with id ${filter?.customerId} is not exists`,
    });
  }

  if (filter?.purchaseTime) {

    if (!!filter.purchaseTime.from && !!filter.purchaseTime.to) {
      const isCorrectPriceRange = filter.purchaseTime.to >= filter.purchaseTime.from;

      ctx.assertClientError(isCorrectPriceRange, {
        ownerEmail: 'Purchase time "from" must be <= "to" time',
      });
    }

  }

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { page, perPage, filter, sort } = ctx.validatedData;

  const carts = await cartService.find(
    {
      $and: [
        filter?.id ? {
          _id: filter?.id,
        } : {},
        filter?.customerId ? {
          customerId: filter?.customerId,
        } : {},
        /* filter?.purchaseTime ? {
          purchaseTime: {
            $gte: (filter?.purchaseTime.from ?? ''),
            $lte: (filter?.purchaseTime.to ?? Infinity),
          },
        } : {}, */
      ],
    },
    { page, perPage },
    { sort },
  );

  ctx.body = {
    items: carts.results,
    totalPages: carts.pagesCount,
    count: carts.count,
  };
}

export default (router: AppRouter) => {
  router.get('/', validateMiddleware(schema), validator, handler);
};
