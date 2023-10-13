import { useMutation, useQuery } from 'react-query';

import queryClient from 'query-client';
import { apiService } from 'services';

import Stripe from 'stripe';
import { Cart } from './cart.types';
import { Product } from '../product/product.types';

interface CartListResponse {
  count: number;
  items: Cart[];
  totalPages: number;
}
interface CartHistoryListResponse {
  count: number;
  items: {
    cart: Cart,
    stripeCheckoutSessionWithItems: Stripe.Checkout.Session & {
      line_items: Stripe.ApiList<Stripe.LineItem>
    },
    products: Product[],
  }[];
  totalPages: number;
}

export function useCreateCart<T>() {
  const createProduct = (data: T) => apiService.post('/carts', data);

  return useMutation<Cart, unknown, T>(createProduct);
}

export function useList<T>(params: T) {
  const list = () => apiService.get('/carts', params);

  return useQuery<CartListResponse>(['carts', params], list);
}

export function useHistoryList<T>(params: T) {
  const list = () => apiService.get('/carts/history', params);

  return useQuery<CartHistoryListResponse>(['carts-history', params], list);
}

export function useUpdate<T>() {
  const update = (data: T) => apiService.patch('/carts', data);

  return useMutation<Cart, unknown, T>(update, {
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(
        ['carts'],
        (oldYourCartsList: CartListResponse | undefined): CartListResponse => {
          oldYourCartsList?.items.map((cart) => (cart._id === updatedCart._id
            ? updatedCart
            : cart));
          return oldYourCartsList as CartListResponse;
        },
      );
    },
  });
}

export function useRemove<T>() {
  let removedCartId: T;
  const remove = (data: T) => {
    removedCartId = data;
    return apiService.delete('/carts', data);
  };

  return useMutation<undefined, unknown, T>(remove, {
    onSuccess: () => {
      queryClient.setQueryData(
        ['carts'],
        (oldYourCartsList: CartListResponse | undefined): CartListResponse => {
          oldYourCartsList?.items.filter((cart) => (cart._id !== removedCartId));
          return oldYourCartsList as CartListResponse;
        },
      );
    },
  });
}
