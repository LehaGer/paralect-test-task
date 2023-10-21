import { useMutation, useQuery } from 'react-query';

import queryClient from 'query-client';
import { apiService } from 'services';

import { Product } from './product.types';
import { Cart } from '../cart/cart.types';

export interface ProductListResponse {
  count: number;
  items: Product[];
  totalPages: number;
}

export function useCreateProduct<T>() {
  const createProduct = (data: T) => apiService.post('/products', data);

  return useMutation<Product, unknown, T>(createProduct, {
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useList<T>(params: T) {
  const list = () => apiService.get('/products', params);

  return useQuery<ProductListResponse>(['products', params], list);
}

export function useUpdate<T>() {
  const update = (data: T) => apiService.patch('/products', data);

  return useMutation<Product, unknown, T>(update, {
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useRemove<T>() {
  let removingProductId: T;
  const remove = (data: T) => {
    removingProductId = data;
    return apiService.delete('/products', { id: data });
  };

  return useMutation<undefined, unknown, T>(remove, {
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.setQueryData<Cart>(
        ['cart'],
        (prevCartState) => ({
          ...prevCartState,
          productIds: prevCartState?.productIds.filter(
            (prevCartProdId) => prevCartProdId !== removingProductId,
          ),
        }) as Cart,
      );
    },
  });
}

export function useUploadImage<T>() {
  const uploadImage = (data: T) => apiService.post('/products/image', data);

  return useMutation<string, unknown, T>(uploadImage);
}

export function useRemoveImage<T>() {
  const remove = (data: T) => apiService.delete('/products/image', data);

  return useMutation<undefined, unknown, T>(remove);
}
