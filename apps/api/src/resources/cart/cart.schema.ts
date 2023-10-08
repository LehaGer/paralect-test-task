import { z } from 'zod';

const schema = z.object({
  _id: z.string(),

  customerId: z.string(),
  productIds: z.string().array().default([]),
  stripe: z.object({
    sessionId: z.string().optional(),
    paymentIntentionId: z.string().optional(),
    isPaymentIntentSucceeded: z.boolean().optional(),
  }).optional(),

  createdOn: z.date().optional(),
  updatedOn: z.date().optional(),
  lastRequest: z.date().optional(),
  deletedOn: z.date().optional().nullable(),
}).strict();

export default schema;
