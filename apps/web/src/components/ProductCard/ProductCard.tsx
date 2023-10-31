import React, { FC } from 'react';
import {
  Button,
  Card,
  Center,
  Container,
  Flex,
  Image,
  Group, ActionIcon,
} from '@mantine/core';

import { useStyles } from './styles';

interface IProductCard {
  imageUrl?: string;
  name?: string;
  price?: number;
  isOwn?: boolean;
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
        {isOwn && (
          <ActionIcon className={classes.deleteButton} onClick={removeCard}>
            <Image src="../images/trash-can.svg" width="1.5rem" height="1.5rem" />
          </ActionIcon>
        )}
        {!isOwn && (
          <Group grow spacing="xs" className={classes.buttonSection}>
            {isInCart ? (
              <Button
                className={classes.button}
                sx={{ backgroundColor: '#72A5F4' }}
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
      </Card.Section>
    </Card>
  );
};

export default ProductCard;
