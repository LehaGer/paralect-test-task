import { z } from 'zod';

const schema = z.object({
  _id: z.string(),

  name: z.string(),
  price: z.number(),
  imageUrl: z.string().nullable(),
  ownerId: z.string(),
  stripe: z.object({
    productId: z.string(),
    priceId: z.string(),
  }),

  createdOn: z.date().optional(),
  updatedOn: z.date().optional(),
  lastRequest: z.date().optional(),
  deletedOn: z.date().optional().nullable(),
}).strict();

export default schema;
