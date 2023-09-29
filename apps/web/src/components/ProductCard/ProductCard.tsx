import React, { FC } from 'react';
import {
  Button,
  Card,
  Center,
  Container,
  Flex,
  Image,
} from '@mantine/core';

import {
  IconAdjustments,
  IconShoppingBag,
  IconShoppingCartPlus,
  IconTrash,
} from '@tabler/icons-react';
import { useStyles } from './styles';

interface IProductCard {
  imageUrl?: string;
  name?: string;
  price?: number;
  isOwn?: boolean;
}

const ProductCard: FC<IProductCard> = ({
  imageUrl = 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  name = 'Product Name',
  price = 300,
  isOwn = false,
}) => {
  const { classes } = useStyles();
  return (
    <Card withBorder radius="md" className={classes.card}>
      <Card.Section className={classes.imageSection}>
        <Image src={imageUrl} alt="card of my product" />
      </Card.Section>
      <Card.Section className={`${classes.section} ${classes.name}`}>
        <Center>{name}</Center>
      </Card.Section>
      <Card.Section className={`${classes.section} ${classes.priceSection}`}>
        <Center>
          <Flex justify="center" align="center" direction="row" wrap="nowrap">
            <Container className={classes.price}>{`${price} USD`}</Container>
          </Flex>
        </Center>
      </Card.Section>
      <Card.Section className={`${classes.section} ${classes.buttonSection}`}>
        <Flex justify="center" align="center" direction="row" wrap="nowrap">
          <Button className={classes.button} variant="subtle" size="xs">
            <IconShoppingCartPlus />
          </Button>
          <Button className={classes.button} variant="subtle" size="xs">
            <IconShoppingBag />
          </Button>
          {isOwn ? (
            <Button className={classes.button} variant="subtle" size="xs">
              <IconAdjustments />
            </Button>
          ) : null}
          {isOwn ? (
            <Button className={classes.button} variant="subtle" size="xs">
              <IconTrash />
            </Button>
          ) : null}
        </Flex>
      </Card.Section>
    </Card>
  );
};

export default ProductCard;
