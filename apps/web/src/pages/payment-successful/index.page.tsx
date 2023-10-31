import React from 'react';
import { NextPage } from 'next';
import { Container, Image, Button } from '@mantine/core';
import { useStyles } from './styles';
import { Link } from '../../components';
import { RoutePath } from '../../routes';

const PaymentSuccessful: NextPage = () => {
  const { classes } = useStyles();
  return (
    <Container className={classes.root}>
      <Image
        className={classes.image}
        src="../images/payment-success.png"
        width="3.5rem"
        height="3.5rem"
      />
      <Container className={classes.infoSection}>
        <Container className={classes.infoPrimary}>Payment Successfull</Container>
        <Container className={classes.additionalInfo}>
          Hooray, you have completed your payment!
        </Container>
      </Container>
      <Link type="router" href={RoutePath.MyCart}>
        <Button className={classes.button}>Back to Cart</Button>
      </Link>
    </Container>
  );
};

export default PaymentSuccessful;
