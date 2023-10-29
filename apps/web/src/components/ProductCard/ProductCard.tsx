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

interface IProductCard {
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
    <Card className={`${classes.section} ${classes.card}`}>
      <Card.Section className={classes.imageSection}>
        <Image src={imageUrl} alt="card of my product" />
      </Card.Section>
      <Card.Section className={`${classes.section} ${classes.infoAndActionSection}`}>
        <Container className={classes.infoSection}>
          <Center className={classes.name}>{name}</Center>
          <Flex className={classes.priceSection}>
            <Container className={classes.priceTitle}>Price</Container>
            <Container className={classes.price}>{`$${price}`}</Container>
          </Flex>
        </Container>
        <Container className={classes.buttonSection}>
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
            <Group grow spacing="xs">
              {isInCart ? (
                <Button
                  className={classes.button}
                  sx={() => ({
                    backgroundColor: '#72A5F4',
                  })}
                  onClick={removeFromCart}
                >
                  In Cart
                </Button>
              ) : (
                <Button className={classes.button} onClick={addToCart}>
                  Add to Cart
                </Button>
              )}
            </Group>
          )}
        </Container>
      </Card.Section>
    </Card>
  );
};

export default ProductCard;
