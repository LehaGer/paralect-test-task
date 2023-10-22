import { memo, FC } from 'react';
import { RoutePath } from 'routes';
import {
  Header as LayoutHeader,
  Container,
  Group, Badge,
} from '@mantine/core';
import { Link } from 'components';
import { LogoImage } from 'public/images';

import { accountApi } from 'resources/account';

import { usePathname } from 'next/navigation';
import UserMenu from './components/UserMenu';
import ShadowLoginBanner from './components/ShadowLoginBanner';
import MyCartBanner from './components/MyCartBanner';

import styles from './styles';

const links = [
  { link: RoutePath.Marketplace, label: 'Marketplace' },
  { link: RoutePath.YourProducts, label: 'Your Products' },
];

const Header: FC = () => {
  const { data: account } = accountApi.useGet();
  const pathname = usePathname();

  if (!account) return null;

  const items = links.map((link) => {
    const isActive = pathname === link.link;
    return (
      <Link
        key={link.label}
        href={link.link}
        type="router"
        underline={false}
      >
        <Badge
          sx={(theme) => styles(theme, isActive)}
          size="lg"
        >
          {link.label}
        </Badge>
      </Link>
    );
  });

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
          backgroundColor: theme.colors.gray[0],
        })}
        fluid
      >
        <Link type="router" href={RoutePath.Home} underline={false}>
          <Container sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: theme.colors.gray[7],
            fontSize: '1.5em',
            fontWeight: 'bold',
            gap: '10px',
          })}
          >
            <LogoImage />
            Shopy
          </Container>

        </Link>
        <Group h="100%">
          {items}
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
