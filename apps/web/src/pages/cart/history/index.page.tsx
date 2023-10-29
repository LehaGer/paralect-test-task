import { NextPage } from 'next';
import { Center, Container, Flex, Loader, Stack } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { cartApi } from '../../../resources/cart';
import { IHistoryListParams } from '../../../resources/cart/cart.types';
import { useStyles } from './styles';
import Cart from '../index.page';
import HistoryTable from './components/HistoryTable';

const History: NextPage = () => {
  const [params] = useState<IHistoryListParams>({
    perPage: 9,
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
    <Cart>
      <Stack spacing="lg">
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
          {!isHistoryLoading && !!historyList?.length && (
            <Container className={classes.tableContainer}>
              <HistoryTable stripeSessionList={historyList ?? []} />
            </Container>
          )}
        </Flex>
      </Stack>
    </Cart>
  );
};

export default History;
