import React, { FC } from 'react';
import { Button, Container } from '@mantine/core';
import { useStyles } from './styles';
import config from '../../../../../config';

interface ISummaryProps {
  totalValue: number;
}

const Summary: FC<ISummaryProps> = ({ totalValue }) => {
  const { classes } = useStyles();
  return (
    <Container className={classes.root}>
      <Container className={classes.title}>Summary</Container>
      <Container className={classes.separatingLine} />
      <Container className={classes.priceSection}>
        <Container className={classes.priceTitle}>price</Container>
        <Container className={classes.priceValue}>{`$${totalValue ?? '0'}`}</Container>
      </Container>
      <form action={`${config.API_URL}/products/checkout/`} method="POST" className={classes.form}>
        <Button type="submit" role="link" className={classes.button}>
          Proceed to Ckeckout
        </Button>
      </form>
    </Container>
  );
};

export default Summary;
