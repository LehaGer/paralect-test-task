import { z } from 'zod';

import { AppKoaContext, AppRouter, Next } from 'types';
import { validateMiddleware } from 'middlewares';
import { productService } from 'resources/product';
import { userService } from 'resources/user';
import { Cart, cartService } from '../../cart';

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
    ownerEmail: z.string().email().optional(),
    cartIds: z.string().array().optional().nullable(),
  }).nullable().default(null),
});

interface ValidatedData extends z.infer<typeof schema> {
  carts?: Cart[]
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {

  const { filter } = ctx.validatedData;

  if ( filter !== null && filter?.ownerEmail ) {
    const isUserExists = await userService.exists({ email: filter.ownerEmail });

    ctx.assertClientError(isUserExists, {
      ownerEmail: 'User with this email is not exists',
    });

  }
  if ( filter !== null && filter?.price ) {

    if (!!filter.price.to && !!filter.price.from) {
      const isCorrectPriceRange = filter.price.to - filter.price.from >= 0;

      ctx.assertClientError(isCorrectPriceRange, {
        ownerEmail: 'Price "from" must be <= "to" price',
      });
    }

  }

  if (filter?.cartIds !== null && filter?.cartIds !== undefined && filter?.cartIds.length !== 0) {

    const cartsResp = await cartService.find({ _id: { $in: filter?.cartIds }  });
    const carts = cartsResp.results;
    const cartsIdsInDb = carts.map(cart => cart._id);

    const notExistingCartIds = filter?.cartIds.filter(cartId => !cartsIdsInDb.includes(cartId));

    ctx.assertClientError(!notExistingCartIds.length, {
      ownerEmail: `'Carts with id\'s ${notExistingCartIds.join(', ')} are not exists'`,
    });

    ctx.validatedData.carts = carts;

  }

  await next();

}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const {
    perPage, page, sort, filter, carts,
  } = ctx.validatedData;

  const nameFilter = filter?.name?.split('\\').join('\\\\').split('.').join('\\.');
  const nameRegExp = nameFilter ? new RegExp(nameFilter, 'gi') : null;

  const owner = filter?.ownerEmail ? await userService.findOne({
    email: filter?.ownerEmail,
  }) : null;

  const productIds = carts
    ?.map(cart => cart.productIds).flat(1)
    .filter((value, index, array) => array.indexOf(value) === index);

  const products = await productService.find(
    {
      $and: [
        filter?.id ? {
          _id: filter?.id,
        } : {},
        filter?.cartIds !== null && filter?.cartIds !== undefined ? {
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
