import { NextPage } from 'next';
import { Button, Center, Flex, Loader, Space, Stack, TextInput } from '@mantine/core';
import React from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import { productApi } from '../../resources/product';
import { accountApi } from '../../resources/account';
import { cartApi } from '../../resources/cart';
import { ProductsListParams } from '../../types';
import config from '../../config';
import { UpdateCartParams } from '../../resources/cart/cart.types';

const MyCart: NextPage = () => {
  const { data: account } = accountApi.useGet();

  const { data: cart, refetch: refetchCart } = cartApi.useGet();

  const {
    data: productListResp,
    isLoading: isProductListLoading,
    refetch: refetchProducts,
  } = productApi.useList<ProductsListParams>({
    filter: {
      cartIds: [cart?._id ?? ''],
    },
  });

  const { mutate: updateCart } = cartApi.useUpdate<UpdateCartParams>();

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
            customerId={account?._id}
            isCartItem
            removeFromCart={() => {
              updateCart({
                id: cart?._id ?? '',
                productIds: cart?.productIds.filter((id) => id !== product._id),
              }, {
                onSuccess: async () => {
                  await refetchCart();
                  await refetchProducts();
                },
              });
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
            <section>
              <TextInput display="none" name="customerId" value={account?._id} />
              <Button type="submit" role="link">
                Buy now
              </Button>
            </section>
          </form>
        </Center>
      )}
      <Space h="xl" />
    </Stack>
  );
};

export default MyCart;
