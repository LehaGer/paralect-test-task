import { z } from 'zod';

export interface Cart {
  _id: string;
  createdOn?: Date;
  updatedOn?: Date;
  lastRequest?: Date;
  deletedOn?: Date | null;
  customerId: string;
  productIds: string[];
  stripe?: {
    sessionId?: string,
    paymentIntentionId?: string,
  },
  isCurrent?: boolean,
  paymentStatus?: 'canceled' | 'failed' | 'pending' | 'reversed' | 'succeeded',
  purchasedAt?: Date,
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
  page?: number;
  perPage?: number;
  sort?: {
    createdAt?: 'asc' | 'desc';
  };
  filter?: {
    startingAfter?: string;
    endingBefore?: string;
    createdAt?: {
      from?: number;
      to?: number;
    };
    status?: SessionStatus;
    paymentStatus?: PaymentStatus;
  };
}

const historyListItemResponseSchema = z.object({
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

export type HistoryListItemResponse = z.infer<typeof historyListItemResponseSchema>;

export interface UpdateCartParams {
  id: string,
  productIds?: string[],
}

const CreateCartSchema = z.object({
  customerId: z.string(),
  productIds: z.string().array().optional(),
});

export type CreateCartParams = z.infer<typeof CreateCartSchema>;
