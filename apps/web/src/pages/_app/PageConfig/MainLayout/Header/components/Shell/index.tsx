import React from 'react';
import { Badge, Container } from '@mantine/core';
import { usePathname } from 'next/navigation';
import { useStyles } from './styles';
import { RoutePath } from '../../../../../../../routes';
import { Link } from '../../../../../../../components';

const links = [
  { paths: [RoutePath.Marketplace], label: 'Marketplace' },
  { paths: [RoutePath.YourProducts, RoutePath.YourProductsCreate], label: 'Your Products' },
];

const Shell = () => {
  const pathname = usePathname();

  const { classes } = useStyles();

  return (
    <Container className={classes.shell}>
      {links.map((link) => {
        const isActive = link.paths.includes(pathname as RoutePath);
        return (
          <Link
            key={link.label}
            href={link.paths[0]}
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
