import React, { FC } from 'react';
import {
  Button,
  Card,
  Center,
  Container,
  Flex,
  Image,
  Group,
} from '@mantine/core';

import { useStyles } from './styles';
import config from '../../config';

interface IProductCard {
  _id: string;
  imageUrl?: string;
  name?: string;
  price?: number;
  isOwn?: boolean;
  isCartItem?: boolean;
  isHistoryItem?: boolean;
  addToCart?: () => void;
  removeFromCart?: () => void;
  removeCard?: () => void;
  isInCart?: boolean;
}

const ProductCard: FC<IProductCard> = ({
  _id,
  imageUrl,
  name,
  price,
  isOwn = false,
  isCartItem = false,
  isHistoryItem = false,
  addToCart = () => {},
  removeCard = () => {},
  removeFromCart = () => {},
  isInCart = false,
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
        <Flex justify="center" align="center" direction="row" wrap="nowrap" sx={{ width: '100%', justifyContent: 'space-between' }}>
          <Container className={classes.priceTitle}>Price</Container>
          <Container className={classes.price}>{`$${price}`}</Container>
        </Flex>
      </Card.Section>
      <Card.Section className={`${classes.section} ${classes.buttonSection}`}>
        {isHistoryItem && null}
        {isCartItem && (
        <Button className={classes.button} variant="light" color="gray" size="sm" onClick={removeFromCart}>
          Remove from cart
        </Button>
        )}
        {isOwn && (
        <Button className={classes.button} variant="light" color="red" size="sm" onClick={removeCard}>
          Delete
        </Button>
        )}
        {!isHistoryItem && !isCartItem && !isOwn && (
          <form action={`${config.API_URL}/products/checkout/${_id}`} method="POST" style={{ width: '100%' }}>
            <Group grow spacing="xs">
              {isInCart ? (
                <Button className={classes.button} variant="outline" size="sm" onClick={removeFromCart}>
                  Uncart
                </Button>
              ) : (
                <Button className={classes.button} variant="outline" size="sm" onClick={addToCart}>
                  Add to cart
                </Button>
              )}
              <Button className={classes.button} size="sm" type="submit" role="link">
                Buy now
              </Button>
            </Group>
          </form>
        )}
      </Card.Section>
    </Card>
  );
};

export default ProductCard;
