import { createStyles } from '@mantine/core';

export const useStyles = createStyles(() => ({
  image: {},
  price: {
    color: 'var(--mantine-color-dark-6, #201F22)',
    'text-align': 'right',
    'font-size': '1rem',
    'font-style': 'normal',
    'font-weight': '400',
    'line-height': '1.25rem',
  },
  date: {
    justifyContent: 'flex-end',
    padding: 0,
    margin: 0,
  },
}));
