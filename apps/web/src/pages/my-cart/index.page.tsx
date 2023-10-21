import { NextPage } from 'next';
import { Button, Center, Flex, Loader, Space, Stack } from '@mantine/core';
import React from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import { productApi } from '../../resources/product';
import { cartApi } from '../../resources/cart';
import { ProductsListParams } from '../../types';
import config from '../../config';
import { RemoveProductParams } from '../../resources/cart/cart.types';

const MyCart: NextPage = () => {
  const {
    data: productListResp,
    isLoading: isProductListLoading,
  } = productApi.useList<ProductsListParams>({ filter: { isInCard: true } });

  const { mutate: removeFromCart } = cartApi.useRemoveProduct<RemoveProductParams>();

  return (
    <Stack spacing="lg">
      <Center
        style={{
          margin: '1em',
          fontSize: '2em',
          color: 'gray',
          fontWeight: 'bold',
        }}
      >
        My Cart
      </Center>
      <Flex
        gap="md"
        justify="center"
        align="center"
        direction="row"
        wrap="wrap"
      >
        {isProductListLoading && (
          <Center>
            <Loader color="blue" />
          </Center>
        )}
        {productListResp?.items.map((product) => (
          <ProductCard
            key={product._id}
            _id={product._id}
            price={product.price}
            name={product.name}
            imageUrl={product.imageUrl}
            isCartItem
            removeFromCart={() => {
              removeFromCart({ productId: product._id });
            }}
          />
        ))}
        {!isProductListLoading && !productListResp?.items.length && (
          <Center
            style={{
              margin: '1em',
              fontSize: '1.5em',
              color: '#b9b9b9',
              fontWeight: 'bold',
            }}
          >
            There no products in marketplace yet
          </Center>
        )}
      </Flex>
      {!!productListResp?.items.length && (
        <Center>
          <form action={`${config.API_URL}/products/checkout/`} method="POST">
            <Button type="submit" role="link">
              Buy now
            </Button>
          </form>
        </Center>
      )}
      <Space h="xl" />
    </Stack>
  );
};

export default MyCart;
