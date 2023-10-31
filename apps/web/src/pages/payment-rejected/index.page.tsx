import React from 'react';
import { NextPage } from 'next';
import { Container, Image, Button } from '@mantine/core';
import { useStyles } from './styles';
import { Link } from '../../components';
import { RoutePath } from '../../routes';

const PaymentRejected: NextPage = () => {
  const { classes } = useStyles();
  return (
    <Container className={classes.root}>
      <Image
        className={classes.image}
        src="../images/payment-rejected.png"
        width="3.5rem"
        height="3.5rem"
      />
      <Container className={classes.infoSection}>
        <Container className={classes.infoPrimary}>Payment Failed</Container>
        <Container className={classes.additionalInfo}>
          Sorry, your payment failed.
          Would you like to try again?
        </Container>
      </Container>
      <Link type="router" href={RoutePath.MyCart}>
        <Button className={classes.button}>Back to Cart</Button>
      </Link>
    </Container>
  );
};

export default PaymentRejected;
