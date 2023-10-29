import { createStyles } from '@mantine/core';

export const useStyles = createStyles(() => ({
  root: {
    display: 'inline-flex',
    'flex-direction': 'column',
    'align-items': 'center',
    gap: '1.25rem',
    width: '18.8125rem',
    height: '23.375rem',
    padding: 0,
    margin: 0,
  },
  image: {
    imageWrapper: {
      width: '12.875rem',
      height: '12.875rem',
    },
  },
  primaryText: {
    color: 'var(--Black-600, #201F22)',
    'font-size': '1.25rem',
    'font-style': 'normal',
    'font-weight': '700',
    'line-height': '140%',
    'text-align': 'center',
    padding: 0,
    margin: 0,
  },
  additionalInfo: {
    color: 'var(--Black-400, #767676)',
    'text-align': 'center',
    'font-size': '0.875rem',
    'font-style': 'normal',
    'font-weight': '400',
    'line-height': '1.25rem',
    padding: 0,
    margin: 0,
  },
  actionButton: {},
}));
