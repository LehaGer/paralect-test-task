import { useMutation, useQuery } from 'react-query';

import queryClient from 'query-client';
import { apiService } from 'services';

import { Product } from './product.types';

export interface ProductListResponse {
  count: number;
  items: Product[];
  totalPages: number;
}

export function useCreateProduct<T>() {
  const createProduct = (data: T) => apiService.post('/products', data);

  return useMutation<Product, unknown, T>(createProduct);
}

export function useList<T>(params: T) {
  const list = () => apiService.get('/products', params);

  return useQuery<ProductListResponse>(['your-products', params], list);
}

export function useUpdate<T>() {
  const update = (data: T) => apiService.patch('/products', data);

  return useMutation<Product, unknown, T>(update, {
    onSuccess: (updatedProduct) => {
      queryClient.setQueryData(
        ['your-products'],
        (oldYourProductsList: ProductListResponse | undefined): ProductListResponse => {
          oldYourProductsList?.items.map((product) => (product._id === updatedProduct._id
            ? updatedProduct
            : product));
          return oldYourProductsList as ProductListResponse;
        },
      );
    },
  });
}

export function useRemove<T>() {
  let removedProductId: T;
  const remove = (data: T) => {
    removedProductId = data;
    return apiService.delete('/products', data);
  };

  return useMutation<undefined, unknown, T>(remove, {
    onSuccess: () => {
      queryClient.setQueryData(
        ['your-products'],
        (oldYourProductsList: ProductListResponse | undefined): ProductListResponse => {
          const productsList = oldYourProductsList ? { ...oldYourProductsList } : {
            count: 0,
            items: [],
            totalPages: 0,
          };
          if (oldYourProductsList?.items) {
            productsList.items = oldYourProductsList?.items.filter(
              (product) => (product._id !== removedProductId),
            );
          }
          return productsList;
        },
      );
    },
  });
}

export function useUploadImage<T>() {
  const uploadImage = (data: T) => apiService.post('/products/image', data);

  return useMutation<string, unknown, T>(uploadImage, {
    onSuccess: (data) => {
      queryClient.setQueryData(['images'], (
        oldImagesList: string[] | undefined,
      ) => [...oldImagesList ?? [], data]);
    },
  });
}

export function useRemoveImage<T>() {
  let removedImageUrl: T;
  const remove = (data: T) => {
    removedImageUrl = data;
    return apiService.delete('/products/image', data);
  };

  return useMutation<undefined, unknown, T>(remove, {
    onSuccess: () => {
      queryClient.setQueryData(
        ['images'],
        (oldImagesList: string[] | undefined) => oldImagesList?.filter(
          (imageUrl) => imageUrl === removedImageUrl,
        ) ?? [],
      );
    },
  });
}
