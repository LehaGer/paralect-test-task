import { createStyles } from '@mantine/core';

export const useStyles = createStyles(() => ({
  shell: {
    display: 'inline-flex',
    alignItems: 'flex-start',
    gap: '2rem',
  },
  shellItem: {
    display: 'flex',
    width: '8.6875rem',
    height: '2.5rem',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.75rem',
    flexShrink: 0,
    borderRadius: '1.25rem',
    background: 'transparent',
    textTransform: 'capitalize',
    color: 'var(--mantine-color-dark-1, #A3A3A3)',

    fontFamily: 'Inter',
    fontSize: '1rem',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '1.5rem',

    '&:hover': {
      background: 'var(--mantine-color-gray-2, #ECECEE)',
    },
  },
  active: {
    background: 'var(--mantine-color-gray-2, #ECECEE)',
    color: 'var(--mantine-color-dark-6, #201F22)',
  },
}));
