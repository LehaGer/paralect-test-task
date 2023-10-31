import { FC, ReactElement } from 'react';

import {
  SimpleGrid,
  Image,
  MediaQuery,
} from '@mantine/core';

import { useStyles } from './styles';

interface UnauthorizedLayoutProps {
  children: ReactElement;
}

const UnauthorizedLayout: FC<UnauthorizedLayoutProps> = ({ children }) => {
  const { classes } = useStyles();
  return (
    <SimpleGrid
      cols={2}
      breakpoints={[
        { maxWidth: 'sm', cols: 1, spacing: 'sm' },
      ]}
      className={classes.body}
    >

      <div className={classes.wrapper}>
        <main className={classes.content}>
          {children}
        </main>
      </div>

      <MediaQuery
        smallerThan="sm"
        styles={{ display: 'none' }}
      >
        <Image
          alt="app info"
          src="../images/intro.png"
          height="95vh"
          fit="contain"
          sx={{
            margin: 'auto 0em',
            overflow: 'hidden',
            width: '90%',
            borderRadius: '2vh',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        />
      </MediaQuery>
    </SimpleGrid>
  );
};

export default UnauthorizedLayout;
