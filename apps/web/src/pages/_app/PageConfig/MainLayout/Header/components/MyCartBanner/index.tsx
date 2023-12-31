import React, { FC } from 'react';
import { Indicator } from '@mantine/core';
import { cartApi } from 'resources/cart';
import { CartImage } from 'public/images';
import { usePathname } from 'next/navigation';
import { useStyles } from './styles';
import { RoutePath } from '../../../../../../../routes';

const MyCartBanner: FC = () => {
  const pathname = usePathname();
  const isActive = pathname.includes(RoutePath.Cart);
  const { data: cartData } = cartApi.useGet();

  const cartItemsCount = cartData?.productIds.length;

  const { classes } = useStyles();

  return (
    <Indicator
      inline
      label={cartItemsCount}
      size="1.29031rem"
      offset={2}
      disabled={!cartItemsCount}
      className={classes.indicator}
    >
      <CartImage className={`${classes.image} ${isActive ? classes.active : ''}`} />
    </Indicator>
  );
};

export default MyCartBanner;
