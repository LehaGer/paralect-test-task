import { createStyles } from '@mantine/core';

export const useStyles = createStyles(() => ({
  wrapper: {
    display: 'flex',
    width: '23.5rem',
    'flex-direction': 'column',
    'align-items': 'flex-start',
    gap: '2rem',
  },
  title: {
    color: 'var(--mantine-color-dark-6, #201F22)',
    'font-family': 'Inter',
    'font-size': '1.625rem',
    'font-style': 'normal',
    'font-weight': 600,
    'line-height': '2.25rem',
  },
  additionalOptions: {
    fontSize: '16px',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: '0.75rem',
  },
}));
