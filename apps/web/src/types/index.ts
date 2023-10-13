export type QueryParam = string | string[] | undefined;

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
    ownerEmail?: string;
    cartIds?: string[] | null;
  };
}
