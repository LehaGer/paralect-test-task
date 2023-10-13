import { NextPage } from 'next';
import { Center, Flex, Loader, Space, Stack, Container, SimpleGrid } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import React from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import { accountApi } from '../../resources/account';
import { cartApi } from '../../resources/cart';
import {
  CartsHistoryListParams,
} from '../../resources/cart/cart.types';

const History: NextPage = () => {
  const { data: account } = accountApi.useGet();

  const {
    data: historyListResp,
    isLoading: isHistoryLoading,
    // refetch: refetchCart,
  } = cartApi.useHistoryList<CartsHistoryListParams>({
    filter: {
      customerId: account?._id,
    },
  });

  const historyList = historyListResp?.items;

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
        History
      </Center>
      <Stack spacing="xl">
        {isHistoryLoading && (
          <Center>
            <Loader color="blue" />
          </Center>
        )}
        {!isHistoryLoading && !historyList?.length && (
          <Center
            style={{
              margin: '1em',
              fontSize: '1.5em',
              color: '#b9b9b9',
              fontWeight: 'bold',
            }}
          >
            There no carts in history yet
          </Center>
        )}
        {historyList?.map((listItem) => (
          <Flex
            gap="md"
            justify="flex-start"
            align="center"
            direction="row"
            wrap="nowrap"
          >
            <SimpleGrid
              cols={2}
              spacing="xs"
              style={{
                textAlign: 'left',
                alignItems: 'center',
              }}
            >
              {Object.entries({
                // cartId: listItem.cart?._id,
                'purchased at': listItem.cart?.purchasedAt,
                'stripe session created at': new Date(
                  listItem.stripeCheckoutSessionWithItems.created * 1000,
                )
                  .toISOString()
                  .substr(0, 16)
                  .split('T')
                  .join(' '),
                'total cost': `${
                  listItem.stripeCheckoutSessionWithItems.amount_total
                    ? listItem.stripeCheckoutSessionWithItems.amount_total / 100
                    : null
                } USD`,
                'payment status':
                  listItem.stripeCheckoutSessionWithItems.payment_status,
              })
                .filter((el) => !!el[1])
                .map((field) => (
                  <>
                    <Container style={{ fontSize: '1.1em', color: 'gray' }}>{`${field[0]}: `}</Container>
                    <Container style={{ fontSize: '1.5em', color: 'gray', textAlign: 'left' }}>{`${field[1]}`}</Container>
                  </>
                ))}
            </SimpleGrid>
            <Carousel
              slideSize="0%"
              slideGap="md"
              withIndicators
              // draggable={false}
              mx="auto"
              containScroll="trimSnaps"
              style={{ flex: 1, width: 0 }}
              styles={{
                control: {
                  '&[data-inactive]': {
                    opacity: 0,
                    cursor: 'default',
                  },
                },
              }}
            >
              {listItem.products.map((product) => {
                const stripeItemPrice = listItem
                  .stripeCheckoutSessionWithItems
                  .line_items
                  .data
                  .find(
                    (val) => val.price?.product === product?.stripe.productId,
                  )?.amount_total;
                const price = stripeItemPrice ? stripeItemPrice / 100 : product?.price;
                return (
                  <Carousel.Slide>
                    <ProductCard
                      key={product?._id}
                      _id={product?._id}
                      price={price}
                      name={product?.name}
                      imageUrl={product?.imageUrl}
                      customerId={account?._id}
                      isHistoryItem
                    />
                  </Carousel.Slide>
                );
              })}
              {listItem.stripeCheckoutSessionWithItems.line_items.data
                .filter(
                  (x) => !listItem.products
                    .filter((y) => !!(y ?? false))
                    .map((y) => y.stripe.productId)
                    .includes((x.price?.product as string | undefined) ?? ''),
                )
                .map((product) => (
                  <Carousel.Slide>
                    <ProductCard
                      key={product?.id}
                      _id={product?.id}
                      price={product ? product.amount_total / 100 : undefined}
                      name={product?.description}
                      imageUrl=""
                      customerId={account?._id}
                      isHistoryItem
                    />
                  </Carousel.Slide>
                ))}
            </Carousel>
            {!isHistoryLoading
              && !listItem.products.length
              && !listItem.stripeCheckoutSessionWithItems.line_items.data.filter(
                (x) => !listItem.products
                  .filter((y) => !!(y ?? false))
                  .map((y) => y.stripe.productId)
                  .includes((x.price?.product as string | undefined) ?? ''),
              ).length && (
                <Center
                  style={{
                    margin: '1em',
                    fontSize: '1.5em',
                    color: '#b9b9b9',
                    fontWeight: 'bold',
                  }}
                >
                  There no products in the cart
                </Center>
            )}
          </Flex>
        ))}
      </Stack>
      <Space h="xl" />
    </Stack>
  );
};

export default History;
