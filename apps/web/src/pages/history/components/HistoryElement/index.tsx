import React, { FC } from 'react';
import { Center, Container, Grid, Paper } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { isNil } from 'lodash';
import { HistoryItemResponse } from '../../../../resources/cart/cart.types';
import ProductCard from '../../../../components/ProductCard/ProductCard';

type IHistoryElementProps = HistoryItemResponse;

const HistoryElement: FC<IHistoryElementProps> = ({
  id,
  products,
  totalCost,
  status,
  paymentStatus,
  paymentIntentTime,
}) => {
  const formattedData = new Date(paymentIntentTime).toISOString().substr(0, 16).replace('T', ' ');

  const fieldDataSet: { fieldName: string, value: any }[] = [
    {
      fieldName: 'stripe session created at',
      value: formattedData,
    },
    {
      fieldName: 'total cost',
      value: `$${totalCost}`,
    },
    {
      fieldName: 'status',
      value: status,
    },
    {
      fieldName: 'payment status',
      value: paymentStatus,
    },
  ];

  return (
    <Paper
      shadow="xs"
      p="md"
      key={id}
      w="max-content"
    >
      <Grid
        grow
        sx={{
          margin: '1em',
          marginBottom: '3em',
          width: '25em',
        }}
      >
        {fieldDataSet
          .filter((el) => !isNil(el.value))
          .map((field) => (
            <Grid.Col span={6} sx={{ width: 'max-content' }}>
              <Container
                sx={(theme) => ({
                  fontSize: '.8em',
                  color: theme.colors.gray[5],
                })}
              >
                {`${field.fieldName}: `}
              </Container>
              <Container
                sx={(theme) => ({
                  fontSize: '1.5em',
                  fontWeight: 'bold',
                  color: theme.colors.gray[7],
                  textAlign: 'left',
                })}
              >
                {`${field.value}`}
              </Container>
            </Grid.Col>
          ))}
      </Grid>
      <Carousel
        slideSize="0%"
        slideGap="md"
        withIndicators
        // draggable={false}
        mx="auto"
        containScroll="trimSnaps"
        w="400px"
        styles={{
          control: {
            '&[data-inactive]': {
              opacity: 0,
              cursor: 'default',
            },
          },
        }}
        sx={{
          margin: '1em',
        }}
      >
        {products
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
      {!products.length && (
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
    </Paper>
  );
};

export default HistoryElement;
