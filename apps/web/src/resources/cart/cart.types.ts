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
  canceled = 'canceled',
  failed = 'failed',
  pending = 'pending',
  reversed = 'reversed',
  succeeded = 'succeeded',
}

export interface CartsListParams {
  page?: number;
  perPage?: number;
  sort?: {
    createdOn?: 'asc' | 'desc';
  };
  filter?: {
    id?: string;
    customerId?: string;
    purchasedAt?: {
      from?: number;
      to?: number;
    };
    isCurrent?: boolean;
    paymentStatus?: PaymentStatus;
  };
}

export interface CartsHistoryListParams {
  page?: number;
  perPage?: number;
  sort?: {
    createdOn?: 'asc' | 'desc';
  };
  filter?: {
    id?: string;
    customerId?: string;
    purchasedAt?: {
      from?: number;
      to?: number;
    };
    paymentStatus?: PaymentStatus;
  };
}

export interface UpdateCartParams {
  id: string,
  customerId?: string,
  productIds?: string[],
  isCurrent?: boolean,
  paymentStatus?: PaymentStatus,
  stripe?: {
    sessionId?: string;
    paymentIntentionId?: string;
  },
}

const CreateCartSchema = z.object({
  customerId: z.string(),
  productIds: z.string().array().optional(),
});

export type CreateCartParams = z.infer<typeof CreateCartSchema>;
