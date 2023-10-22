import React, { FC } from 'react';
import { RoutePath } from 'routes';
import { Link } from 'components';
import { IconShoppingCart } from '@tabler/icons-react';
import { Indicator } from '@mantine/core';
import { cartApi } from 'resources/cart';

const MyCartBanner: FC = () => {
  const { data: cartData } = cartApi.useGet();

  const cartItemsCount = cartData?.productIds.length;

  return (
    <Link type="router" href={RoutePath.MyCart}>
      <Indicator
        inline
        label={cartItemsCount}
        size={15}
        offset={2}
        disabled={!cartItemsCount}
        sx={() => ({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        })}
      >
        <IconShoppingCart />
      </Indicator>
    </Link>
  );
};

export default MyCartBanner;
