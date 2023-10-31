import React from 'react';
import { LogoImage } from 'public/images';
import { Container } from '@mantine/core';
import { useStyles } from './styles';
import { RoutePath } from '../../../../../../../routes';
import { Link } from '../../../../../../../components';

const Logo = () => {
  const { classes } = useStyles();

  return (
    <Link type="router" href={RoutePath.Marketplace} underline={false}>
      <Container className={classes.wrapper}>
        <LogoImage className={classes.image} />
        <Container className={classes.name}>
          Shopy
        </Container>
      </Container>
    </Link>
  );
};

export default Logo;
