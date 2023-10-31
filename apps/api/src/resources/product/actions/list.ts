import { z } from 'zod';

import { AppKoaContext, AppRouter, Next } from 'types';
import { validateMiddleware } from 'middlewares';
import { productService } from 'resources/product';
import { userService } from 'resources/user';
import { cartService } from '../../cart';
import { isNil } from 'lodash';

const schema = z.object({
  page: z.string().transform(Number).default('1'),
  perPage: z.string().transform(Number).default('10'),
  sort: z.object({
    createdOn: z.enum(['asc', 'desc']).optional(),
    price: z.enum(['asc', 'desc']).optional(),
    name: z.enum(['asc', 'desc']).optional(),
  }).default({ createdOn: 'desc' }),
  filter: z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    price: z.object({
      from: z.coerce.number().min(0, 'Price can not be less then 0').optional(),
      to: z.coerce.number().min(0, 'Price can not be less then 0').optional(),
    }).optional(),
    ownerId: z.string().optional(),
    isInCard: z.coerce.boolean().optional(),
  }).optional(),
});

type ValidatedData = z.infer<typeof schema>;

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { filter } = ctx.validatedData;

  if (filter?.price) {
    if ( !isNil(filter.price.to) && !isNil(filter.price.from) ) {
      const isCorrectPriceRange = filter.price.to - filter.price.from >= 0;

      ctx.assertClientError(isCorrectPriceRange, {
        price: 'Price "from" must be <= "to" price',
      }, 400);
    }
  }

  if (filter?.ownerId) {
    const isOwnerExists = await userService.findOne({ _id: filter.ownerId });

    ctx.assertClientError(isOwnerExists, {
      user: 'Owner with provided id is not exists',
    }, 400);

  }

  await next();

}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.state;
  const {  perPage, page, sort, filter } = ctx.validatedData;

  const nameFilter = filter?.name?.split('\\').join('\\\\').split('.').join('\\.');
  const nameRegExp = nameFilter ? new RegExp(nameFilter, 'gi') : null;

  const productIds = filter?.isInCard
    ? await cartService
      .findOne({ customerId: user._id })
      .then(res => res?.productIds ?? [])
    : [];

  const products = await productService.find(
    {
      $and: [
        filter?.id ? {
          _id: filter?.id,
        } : {},
        filter?.isInCard ? {
          _id: { $in: productIds },
        } : {},
        filter?.name && nameRegExp ? {
          name: { $regex: nameRegExp },
        } : {},
        filter?.price ? {
          price: {
            $gte: (filter?.price.from ?? 0),
            $lte: (filter?.price.to ?? Infinity),
          },
        } : {},
        filter?.ownerId ? {
          ownerId: filter?.ownerId,
        } : {},
      ],
    },
    { page, perPage },
    { sort },
  );

  ctx.body = {
    items: products.results,
    totalPages: products.pagesCount,
    count: products.count,
  };
}

export default (router: AppRouter) => {
  router.get('/', validateMiddleware(schema), validator, handler);
};
