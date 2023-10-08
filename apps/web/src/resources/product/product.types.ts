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
