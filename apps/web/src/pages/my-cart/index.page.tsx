import { NextPage } from 'next';
import { Button, Center, Flex, Loader, Space, Stack } from '@mantine/core';
import React, { useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import ProductCard from 'components/ProductCard/ProductCard';
import { productApi, productTypes } from 'resources/product';
import { cartApi, cartTypes } from 'resources/cart';
import config from 'config';
import { useStyles } from './styles';

const MyCart: NextPage = () => {
  const {
    data: productListResp,
    isLoading: isProductListLoading,
  } = productApi.useList<productTypes.ProductsListParams>({ filter: { isInCard: true } });

  const { mutate: removeFromCart } = cartApi.useRemoveProduct<cartTypes.RemoveProductParams>();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    if (query.get('canceled')) {
      notifications.show({
        title: 'Something went wrong...',
        message: 'Products purchasing was rejected',
        color: 'red',
      });
    }
  }, []);

  const { classes } = useStyles();

  return (
    <Stack spacing="lg">
      <Center className={classes.pageName}>
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
          <Center className={classes.notExistsMsg}>
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
