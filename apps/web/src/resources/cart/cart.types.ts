import { z } from 'zod';

export interface Cart {
  _id: string;
  createdOn?: Date;
  updatedOn?: Date;
  lastRequest?: Date;
  deletedOn?: Date | null;
  customerId: string;
  productIds: string[];
}

export enum PaymentStatus {
  no_payment_required = 'no_payment_required',
  paid = 'paid',
  unpaid = 'unpaid',
}

export enum SessionStatus {
  complete = 'complete',
  expired = 'expired',
  open = 'open',
}

export interface IHistoryListParams {
  perPage?: number;
  filter?: {
    startingAfter?: string;
    endingBefore?: string;
  };
}

const historyItemResponseSchema = z.object({
  id: z.string(),
  status: z.enum(['complete', 'expired', 'open']).nullable(),
  paymentStatus: z.enum(['no_payment_required', 'paid', 'unpaid']),
  totalCost: z.number().min(0).nullable(),
  paymentIntentTime: z.date(),
  products: z.object({
    id: z.string(),
    price: z.number().min(0),
    name: z.string(),
    imageUrl: z.string().url().nullable(),
  }).array(),
});

export type HistoryItemResponse = z.infer<typeof historyItemResponseSchema>;

const historyListResponseSchema = z.object({
  items: historyItemResponseSchema.array(),
  hasMore: z.boolean(),
});

export type HistoryListResponse = z.infer<typeof historyListResponseSchema>;

export interface UpdateCartParams {
  id: string,
  productIds?: string[],
}

export interface AddProductParams {
  productId: string;
}

export interface RemoveProductParams {
  productId: string;
}

const CreateCartSchema = z.object({
  customerId: z.string(),
  productIds: z.string().array().optional(),
});

export type CreateCartParams = z.infer<typeof CreateCartSchema>;
