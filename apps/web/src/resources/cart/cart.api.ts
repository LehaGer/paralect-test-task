import { useMutation, useQuery } from 'react-query';

import queryClient from 'query-client';
import { apiService } from 'services';

import { Cart, HistoryListResponse } from './cart.types';

export function useGet() {
  const get = () => apiService.get('/cart');

  return useQuery<Cart>(['cart'], get);
}

export function useAddProduct<T>() {
  const update = (data: T) => apiService.patch('/cart/add-product', data);

  return useMutation<Cart, unknown, T>(update, {
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(
        ['cart'],
        () => updatedCart,
      );
    },
  });
}

export function useRemoveProduct<T>() {
  const update = (data: T) => apiService.patch('/cart/remove-product', data);

  return useMutation<Cart, unknown, T>(update, {
    onSuccess: async (updatedCart) => {
      queryClient.setQueryData(
        ['cart'],
        () => updatedCart,
      );
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useEmpty<T>() {
  const empty = () => apiService.patch('/cart/empty');

  return useMutation<undefined, unknown, T>(empty, {
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(
        ['cart'],
        () => updatedCart,
      );
    },
  });
}

export function useGetHistoryList<T>(params: T) {
  const list = () => apiService.get('/cart/history', params);

  return useQuery<HistoryListResponse>(['history', params], list);
}
