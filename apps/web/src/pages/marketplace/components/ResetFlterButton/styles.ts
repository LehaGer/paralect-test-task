import { createStyles, MantineTheme } from '@mantine/core';

export const useStyles = createStyles((theme: MantineTheme) => ({
  root: {
    display: 'flex',
    height: '2.25rem',
    padding: '0.625rem 1.25rem',
    'justify-content': 'center',
    'align-items': 'center',
    gap: '0.5rem',
    'border-radius': '1.9375rem',
    border: '1px solid var(--mantine-color-gray-3, #ECECEE)',
    background: theme.white,
    'font-size': '0.875rem',
    'font-style': 'normal',
    'font-weight': '500',
    'line-height': 'normal',
    color: 'var(--mantine-color-dark-6, #201F22)',

    '&:hover:not([data-disabled])': theme.fn.hover({
      backgroundColor: theme.white,
    }),
  },
}));
