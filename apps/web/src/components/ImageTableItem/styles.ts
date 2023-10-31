import { createStyles } from '@mantine/core';

export const useStyles = createStyles(() => ({
  root: {
    display: 'flex',
    'align-items': 'center',
    gap: '1.5625rem',
    'align-self': 'stretch',
    padding: 0,
    margin: 0,
  },
  image: {
    '& img': {
      'border-radius': '0.5rem',
    },
    padding: 0,
    margin: 0,
  },
  name: {
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': '1',
    overflow: 'hidden',
    color: 'var(--mantine-color-dark-6, #201F22)',
    'text-overflow': 'ellipsis',
    'font-size': '1rem',
    'font-style': 'normal',
    'font-weight': '700',
    'line-height': 'normal',
    padding: 0,
    margin: 0,
  },
}));
