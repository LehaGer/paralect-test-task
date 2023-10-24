import { NextPage } from 'next';
import { Center, Flex, Loader, Stack } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { cartApi } from 'resources/cart';
import { IHistoryListParams } from 'resources/cart/cart.types';
import { notifications } from '@mantine/notifications';
import HistoryElement from './components/HistoryElement';
import { useStyles } from './styles';
import HistoryPagination from './components/HistoryPagination';

const History: NextPage = () => {
  const [params, setParams] = useState<IHistoryListParams>({
    perPage: 10,
  });

  const {
    data: historyListResp,
    isLoading: isHistoryLoading,
  } = cartApi.useGetHistoryList<IHistoryListParams>(params);

  const historyList = historyListResp?.items;

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    if (query.get('success')) {
      notifications.show({
        title: 'Success!',
        message: 'Products successfully purchased',
        color: 'green',
      });
    }
  }, []);

  const { classes } = useStyles();

  return (
    <Stack spacing="lg">
      <Center className={classes.pageName}>
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
          <Center className={classes.notExistsMsg}>
            There no carts in history yet
          </Center>
        )}
        {historyList?.map((item) => (
          <HistoryElement {...item} />
        ))}
      </Flex>
      <Center className={classes.paginationSection}>
        <HistoryPagination setParams={setParams} historyListResp={historyListResp} />
      </Center>
    </Stack>
  );
};

export default History;
