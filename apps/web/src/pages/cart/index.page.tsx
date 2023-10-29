import React, { ReactElement } from 'react';
import { NextPage } from 'next';
import { Badge, Container } from '@mantine/core';
import { usePathname } from 'next/navigation';
import { useStyles } from './styles';
import { RoutePath } from '../../routes';
import { Link } from '../../components';

interface ICartProps {
  children: ReactElement;
}

const links = [
  { link: RoutePath.MyCart, label: 'My cart' },
  { link: RoutePath.History, label: 'History' },
];

const Cart: NextPage<ICartProps> = ({ children }) => {
  const pathname = usePathname();
  const { classes } = useStyles();
  return (
    <Container className={classes.root}>
      <Container className={classes.buttonsSection}>
        {links.map((link) => {
          const isActive = pathname === link.link;
          return (
            <Link
              key={link.label}
              href={link.link}
              type="router"
              underline={false}
            >
              <Badge
                className={`${classes.button} ${isActive ? classes.active : ''}`}
              >
                {link.label}
              </Badge>
            </Link>
          );
        })}
      </Container>
      {children}
    </Container>
  );
};

export default Cart;
