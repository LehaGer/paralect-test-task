import { memo, FC } from 'react';
import {
  Header as LayoutHeader,
  Container,
} from '@mantine/core';

import { accountApi } from 'resources/account';

import ShadowLoginBanner from './components/ShadowLoginBanner';

import { useStyles } from './styles';
import Shell from './components/Shell';
import RightSection from './components/RightSection';
import Logo from './components/Logo';

const Header: FC = () => {
  const { data: account } = accountApi.useGet();

  const { classes } = useStyles();

  if (!account) return null;

  return (
    <LayoutHeader height="72px">
      {account.isShadow && <ShadowLoginBanner email={account.email} />}
      <Container className={classes.linksWrapper} fluid>
        <Logo />
        <Shell />
        <RightSection />
      </Container>
    </LayoutHeader>
  );
};

export default memo(Header);
