import { memo, FC } from 'react';
import { RoutePath } from 'routes';
import {
  Header as LayoutHeader,
  Container,
  Group,
} from '@mantine/core';
import { Link } from 'components';
import { LogoImage } from 'public/images';

import { accountApi } from 'resources/account';

import UserMenu from './components/UserMenu';
import ShadowLoginBanner from './components/ShadowLoginBanner';
import MyCartBanner from './components/MyCartBanner';

import { useStyles } from './styles';
import Shell from './components/Shell';

const Header: FC = () => {
  const { data: account } = accountApi.useGet();

  const { classes } = useStyles();

  if (!account) return null;

  return (
    <LayoutHeader height="72px">
      {account.isShadow && <ShadowLoginBanner email={account.email} />}
      <Container
        className={classes.linksWrapper}
        fluid
      >
        <Link type="router" href={RoutePath.Marketplace} underline={false}>
          <Container className={classes.mainLogoWrapper}>
            <LogoImage />
            Shopy
          </Container>
        </Link>
        <Group h="100%">
          <Shell />
        </Group>
        <Group h="100%" spacing="xl">
          <MyCartBanner />
          <UserMenu />
        </Group>
      </Container>
    </LayoutHeader>
  );
};

export default memo(Header);
