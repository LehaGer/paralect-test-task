import { z } from 'zod';

import { AppKoaContext, AppRouter, Next } from 'types';
import { validateMiddleware } from 'middlewares';
import { productService } from 'resources/product';
import { userService } from 'resources/user';

const schema = z.object({
  page: z.string().transform(Number).default('1'),
  perPage: z.string().transform(Number).default('10'),
  sort: z.object({
    createdOn: z.enum(['asc', 'desc']).optional(),
    price: z.enum(['asc', 'desc']).optional(),
    name: z.enum(['asc', 'desc']).optional(),
  }).default({ createdOn: 'desc' }),
  filter: z.object({
    name: z.string().optional(),
    price: z.object({
      from: z.coerce.number().min(0, 'Price can not be less then 0'),
      to: z.coerce.number().min(0, 'Price can not be less then 0'),
    }).optional(),
    ownerEmail: z.string().email().optional(),
  }).nullable().default(null),
});

type ValidatedData = z.infer<typeof schema>;

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {

  const { filter } = ctx.validatedData;

  if ( filter !== null && filter?.ownerEmail ) {
    const isUserExists = await userService.exists({ email: filter.ownerEmail });

    ctx.assertClientError(isUserExists, {
      ownerEmail: 'User with this email is not exists',
    });

  }
  if ( filter !== null && filter?.price ) {

    const isCorrectPriceRange = filter.price.to - filter.price.from >= 0;

    ctx.assertClientError(isCorrectPriceRange, {
      ownerEmail: 'Price "from" must be <= "to" price',
    });

  }

  await next();

}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const {
    perPage, page, sort, filter,
  } = ctx.validatedData;

  const nameFilter = filter?.name?.split('\\').join('\\\\').split('.').join('\\.');
  const nameRegExp = nameFilter ? new RegExp(nameFilter, 'gi') : null;

  const owner = filter?.ownerEmail ? await userService.findOne({
    email: filter?.ownerEmail,
  }) : null;

  const products = await productService.find(
    {
      $and: [
        filter?.name && nameRegExp ? {
          name: { $regex: nameRegExp },
        } : {},
        filter?.price ? {
          price: {
            $gte: filter.price.from,
            $lte: filter.price.to,
          },
        } : {},
        filter?.ownerEmail && owner ? {
          ownerId: owner._id,
        } : {},
      ],
    },
    { page, perPage },
    { sort },
  );

  ctx.body = {
    items: await Promise.all(products.results.map(result => productService.getPublic(result))),
    totalPages: products.pagesCount,
    count: products.count,
  };
}

export default (router: AppRouter) => {
  router.get('/', validateMiddleware(schema), validator, handler);
};
