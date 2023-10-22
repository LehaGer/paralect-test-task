import { NextPage } from 'next';
import { Center, Flex, Loader, Space, Stack } from '@mantine/core';
import React, { useState } from 'react';
import { cartApi } from 'resources/cart';
import { IHistoryListParams } from 'resources/cart/cart.types';
import HistoryElement from './components/HistoryElement';

const History: NextPage = () => {
  const [params] = useState<IHistoryListParams>({
    perPage: 10,
  });

  const {
    data: historyListResp,
    isLoading: isHistoryLoading,
    // refetch: refetchCart,
  } = cartApi.useGetHistoryList<IHistoryListParams>(params);

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
      <Flex
        gap="xl"
        justify="center"
        align="center"
        direction="row"
        wrap="wrap"
      >
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
          <HistoryElement {...item} />
        ))}
      </Flex>
      <Space h="xl" />
    </Stack>
  );
};

export default History;
