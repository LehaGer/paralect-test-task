import { FC, ReactElement } from 'react';
import { AppShell } from '@mantine/core';

import Header from './Header';

interface MainLayoutProps {
  children: ReactElement;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => (
  <AppShell
    header={<Header />}
    // footer={<Footer />}
    styles={(theme) => ({
      root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: theme.colors.gray[0],
      },
      main: {
        padding: '32px',
        paddingTop: '5.5rem',
        '& > *': {
          marginTop: 0,
        },
      },
    })}
  >
    {children}
  </AppShell>
);

export default MainLayout;
