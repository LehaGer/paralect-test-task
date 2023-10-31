import { createStyles, MantineTheme } from '@mantine/core';

export const useStyles = createStyles((theme: MantineTheme) => ({
  image: {},
  price: {
    color: 'var(--mantine-color-dark-6, #201F22)',
    'text-align': 'right',
    'font-size': '1rem',
    'font-style': 'normal',
    'font-weight': '400',
    'line-height': '1.25rem',
  },
  removeButton: {
    color: 'var(--mantine-color-dark-2, #767676)',
    'font-size': '1rem',
    'font-style': 'normal',
    'font-weight': '400',
    'line-height': '1.25rem',
    backgroundColor: 'transparent',
    '&:hover:not([data-disabled]):not(:active)': theme.fn.hover({
      backgroundColor: 'transparent',
      color: theme.colors.dark[4],
    }),
    '&:active:not([data-disabled])': {
      backgroundColor: 'transparent',
      color: theme.colors.dark[4],
    },
  },
}));
