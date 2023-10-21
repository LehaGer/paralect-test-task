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

const links = [
  { link: RoutePath.YourProducts, label: 'Your Products' },
  { link: RoutePath.Marketplace, label: 'Marketplace' },
];

const Header: FC = () => {
  const { data: account } = accountApi.useGet();

  if (!account) return null;

  const items = links.map((link) => (
    <Link
      key={link.label}
      href={link.link}
      type="router"
    >
      {link.label}
    </Link>
  ));

  return (
    <LayoutHeader height="72px">
      {account.isShadow && <ShadowLoginBanner email={account.email} />}
      <Container
        sx={(theme) => ({
          minHeight: '72px',
          padding: '0 32px',
          display: 'flex',
          flex: '1 1 auto',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: theme.white,
          borderBottom: `1px solid ${theme.colors.gray[4]}`,
        })}
        fluid
      >
        <Link type="router" href={RoutePath.Home}>
          <LogoImage />
        </Link>
        <Group h="100%">
          {items}
        </Group>
        <Group h="100%">
          <MyCartBanner />
          <UserMenu />
        </Group>
      </Container>
    </LayoutHeader>
  );
};

export default memo(Header);
