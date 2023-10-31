import { createStyles } from '@mantine/core';

export const useStyles = createStyles(() => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',
    gap: '.67rem',

    padding: 0,
  },
  image: {
    width: '2.28863rem',
    height: '2.50844rem',
    'flex-shrink': 0,
  },
  name: {
    color: 'var(--mantine-color-dark-6, #201F22)',
    'font-feature-settings': '\'clig\' off, \'liga\' off',
    'font-size': '1.81156rem',
    'font-style': 'normal',
    'font-weight': 700,
    'line-height': '1.90694rem',
    padding: 0,
  },
}));
