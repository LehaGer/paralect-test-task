export interface StripeIdsInfo {
  productId: string;
  priceId: string;
}
export interface Product {
  _id: string;
  createdOn?: Date;
  updatedOn?: Date;
  lastRequest?: Date;
  deletedOn?: Date | null;
  name: string;
  price: number;
  imageUrl: string;
  ownerId: string;
  ownerEmail: string;
  stripe: StripeIdsInfo;
}

export interface ProductsListParams {
  page?: number;
  perPage?: number;
  sort?: {
    createdOn?: 'asc' | 'desc';
    price?: 'asc' | 'desc';
    name?: 'asc' | 'desc';
  };
  filter?: {
    id?: string;
    name?: string;
    price?: {
      from?: number;
      to?: number;
    };
    ownerId?: string;
    isInCard?: boolean;
  };
}
