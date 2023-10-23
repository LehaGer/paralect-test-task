import React, { FC } from 'react';
import { Center, Container, Grid, Paper } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { isNil } from 'lodash';
import { cartTypes } from 'resources/cart';
import ProductCard from 'components/ProductCard/ProductCard';
import { useStyles } from './styles';

type IHistoryElementProps = cartTypes.HistoryItemResponse;

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

  const { classes } = useStyles();

  return (
    <Paper
      shadow="xs"
      p="md"
      key={id}
      w="max-content"
    >
      <Grid
        grow
        className={classes.infoSection}
      >
        {fieldDataSet
          .filter((el) => !isNil(el.value))
          .map((field) => (
            <Grid.Col span={6} className={classes.infoSectionItem}>
              <Container className={classes.infoSectionItemName}>
                {`${field.fieldName}: `}
              </Container>
              <Container className={classes.infoSectionItemValue}>
                {`${field.value}`}
              </Container>
            </Grid.Col>
          ))}
      </Grid>
      <Carousel
        slideSize="0%"
        slideGap="md"
        withIndicators
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
        className={classes.productsList}
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
      <Center className={classes.notExistsMsg}>
        There no products in the cart
      </Center>
      )}
    </Paper>
  );
};

export default HistoryElement;
