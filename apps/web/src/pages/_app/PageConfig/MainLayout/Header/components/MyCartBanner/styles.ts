import { createStyles } from '@mantine/core';

export const useStyles = createStyles(() => ({
  indicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    width: '2.16813rem',
    height: '2.01869rem',
    'flex-shrink': 0,
  },
  active: {
    '& > *': {
      fill: 'var(--mantine-color-blue-6)',
    },
  },
}));
