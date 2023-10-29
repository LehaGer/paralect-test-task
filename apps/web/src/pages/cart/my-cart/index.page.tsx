import { NextPage } from 'next';
import {
  Button,
  Center,
  Grid,
  Loader,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { productApi, productTypes } from '../../../resources/product';
import { useStyles } from './styles';
import Cart from '../index.page';
import NoItemsMessage from '../../../components/NoItemsMessage';
import { RoutePath } from '../../../routes';
import { Link } from '../../../components';
import Summary from './components/Summary';
import MyCartTable from './components/MyCartTable';

const MyCart: NextPage = () => {
  const [params] = useState<productTypes.ProductsListParams>(
    { filter: { isInCard: true } },
  );

  const {
    data: productListResp,
    isLoading: isProductListLoading,
  } = productApi.useList<productTypes.ProductsListParams>(params);

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
    <Cart>
      <Grid>
        <Grid.Col span="auto">
          {isProductListLoading && (
            <Center>
              <Loader color="blue" />
            </Center>
          )}
          <MyCartTable items={productListResp?.items ?? []} />
          {!isProductListLoading && !productListResp?.items.length && (
            <Center className={classes.notExistsMsg}>
              <NoItemsMessage
                detailedMessage={'You haven\'t made any purchases yet. Go to the marketplace and make purchases.'}
                actionButton={(
                  <Link
                    type="router"
                    href={RoutePath.SignIn}
                  >
                    <Button>Go to Marketplace</Button>
                  </Link>
                )}
              />
            </Center>
          )}
        </Grid.Col>
        <Grid.Col
          span="content"
          sx={{
            marginLeft: '4.88rem',
          }}
        >
          {!isProductListLoading && productListResp?.items.length && (
          <Summary
            totalValue={
              productListResp?.items.reduce((acc, { price }) => acc + price, 0)
            }
          />
          )}
        </Grid.Col>
      </Grid>
    </Cart>
  );
};

export default MyCart;
