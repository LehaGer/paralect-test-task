import { useMutation, useQuery } from 'react-query';

import queryClient from 'query-client';
import { apiService } from 'services';

import { Cart, HistoryListItemResponse } from './cart.types';

interface IHistoryListResponse {
  count: number;
  items: HistoryListItemResponse[];
  totalPages: number;
}

export function useGet() {
  const get = () => apiService.get('/carts');

  return useQuery<Cart>(['carts'], get);
}

export function useGetHistoryList<T>(params: T) {
  const list = () => apiService.get('/carts/history', params);

  return useQuery<IHistoryListResponse>(['carts-history', params], list);
}

export function useUpdate<T>() {
  const update = (data: T) => apiService.patch('/carts', data);

  return useMutation<Cart, unknown, T>(update, {
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(
        ['carts'],
        () => updatedCart,
      );
    },
  });
}

export function useAddProduct<T>() {
  const update = (data: T) => apiService.patch('/add-product', data);

  return useMutation<Cart, unknown, T>(update, {
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(
        ['carts'],
        () => updatedCart,
      );
    },
  });
}

export function useRemoveProduct<T>() {
  const update = (data: T) => apiService.patch('/remove-product', data);

  return useMutation<Cart, unknown, T>(update, {
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(
        ['carts'],
        () => updatedCart,
      );
    },
  });
}

export function useEmpty<T>() {
  const empty = () => apiService.patch('/carts/empty');

  return useMutation<undefined, unknown, T>(empty, {
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(
        ['carts'],
        () => updatedCart,
      );
    },
  });
}
