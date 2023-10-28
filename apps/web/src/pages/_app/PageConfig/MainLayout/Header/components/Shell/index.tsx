import React from 'react';
import { Badge, Container } from '@mantine/core';
import { usePathname } from 'next/navigation';
import { useStyles } from './styles';
import { RoutePath } from '../../../../../../../routes';
import { Link } from '../../../../../../../components';

const links = [
  { link: RoutePath.Marketplace, label: 'Marketplace' },
  { link: RoutePath.YourProducts, label: 'Your Products' },
];

const Shell = () => {
  const pathname = usePathname();

  const { classes } = useStyles();

  return (
    <Container className={classes.shell}>
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
              className={`${classes.shellItem} ${isActive ? classes.active : ''}`}
            >
              {link.label}
            </Badge>
          </Link>
        );
      })}
    </Container>
  );
};

export default Shell;
