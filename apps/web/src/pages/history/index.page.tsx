import { NextPage } from 'next';
import { Center, Flex, Loader, Space, Stack, Container, SimpleGrid } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import React from 'react';
import ProductCard from 'components/ProductCard/ProductCard';
import { cartApi } from 'resources/cart';
import { IHistoryListParams } from 'resources/cart/cart.types';

const History: NextPage = () => {
  const {
    data: historyListResp,
    isLoading: isHistoryLoading,
    // refetch: refetchCart,
  } = cartApi.useGetHistoryList<IHistoryListParams>({
    page: 1,
    perPage: 10,
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
        {historyList?.map((item) => (
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
                'stripe session created at': new Date(item.paymentIntentTime).toISOString().substr(0, 16).replace('T', ' '),
                'total cost': `${item.totalCost} USD`,
                status: item.status,
                'payment status': item.paymentStatus,
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
              {item.products
                .map((product) => (
                  <Carousel.Slide>
                    <ProductCard
                      key={product.id}
                      _id={product.id}
                      price={product.price}
                      name={product.name}
                      imageUrl={product.imageUrl ?? ''}
                      isHistoryItem
                    />
                  </Carousel.Slide>
                ))}
            </Carousel>
            {!isHistoryLoading
                && !item.products.length
                && (
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
