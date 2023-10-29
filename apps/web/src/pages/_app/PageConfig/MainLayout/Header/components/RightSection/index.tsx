import React from 'react';
import { ActionIcon, Container } from '@mantine/core';
import { LogoutImage } from 'public/images';
import { useStyles } from './styles';
import MyCartBanner from '../MyCartBanner';
import { RoutePath } from '../../../../../../../routes';
import { Link } from '../../../../../../../components';
import { accountApi } from '../../../../../../../resources/account';

const RightSection = () => {
  const { mutate: signOut } = accountApi.useSignOut();

  const { classes } = useStyles();

  return (
    <Container className={classes.wrapper}>
      <ActionIcon component={Link} href={RoutePath.Cart} type="router">
        <MyCartBanner />
      </ActionIcon>
      <ActionIcon onClick={() => signOut()} className={classes.iconWrapper}>
        <LogoutImage className={classes.icon} />
      </ActionIcon>
    </Container>
  );
};

export default RightSection;
