import React, { FC } from 'react';
import {
  Button,
  Card,
  Center,
  Container,
  Flex,
  Image, TextInput,
} from '@mantine/core';

import {
  IconAdjustments,
  IconShoppingBag,
  IconShoppingCartPlus,
  IconTrash,
} from '@tabler/icons-react';
import { useStyles } from './styles';
import config from '../../config';

interface IProductCard {
  _id: string;
  imageUrl?: string;
  name?: string;
  price?: number;
  isOwn?: boolean;
  customerId?: string;
}

const ProductCard: FC<IProductCard> = ({
  _id,
  imageUrl,
  name,
  price,
  isOwn = false,
  customerId,
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
          {isOwn ? (
            <>
              <Button className={classes.button} variant="subtle" size="xs">
                <IconAdjustments />
              </Button>
              <Button className={classes.button} variant="subtle" size="xs">
                <IconTrash />
              </Button>
            </>
          ) : (
            <>
              <Button className={classes.button} variant="subtle" size="xs">
                <IconShoppingCartPlus />
              </Button>
              <form action={`${config.API_URL}/products/checkout/`} method="POST">
                <section>
                  <TextInput display="none" name="id" value={_id} />
                  <TextInput display="none" name="customerId" value={customerId} />
                  <Button className={classes.button} variant="subtle" size="xs" type="submit" role="link">
                    <IconShoppingBag />
                  </Button>
                </section>
              </form>
            </>
          )}
        </Flex>
      </Card.Section>
    </Card>
  );
};

export default ProductCard;
