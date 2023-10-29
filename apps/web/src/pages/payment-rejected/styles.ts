import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    width: '30rem',
    padding: '1.25rem',
    'flex-direction': 'column',
    'align-items': 'center',
    gap: '2rem',
    'border-radius': '1.25rem',
    background: theme.white,
    marginTop: '4rem',
  },
  image: {
    width: '3.5rem',
    height: '3.5rem',
    'flex-shrink': 0,
    margin: 0,
    padding: 0,
  },
  infoSection: {
    display: 'flex',
    'flex-direction': 'column',
    'align-items': 'center',
    gap: '1rem',
    margin: 0,
    padding: 0,
  },
  infoPrimary: {
    color: 'var(--mantine-color-dark-6, #201F22)',
    'text-align': 'center',
    'font-size': '1.5rem',
    'font-style': 'normal',
    'font-weight': '600',
    'line-height': 'normal',
    margin: 0,
    padding: 0,
  },
  additionalInfo: {
    color: 'var(--mantine-color-dark-4, #767676)',
    'text-align': 'center',
    'font-size': '1rem',
    'font-style': 'normal',
    'font-weight': '400',
    'line-height': '1.5rem',
    margin: 0,
    padding: 0,
  },
  button: {
    width: '11.625rem',
  },
}));
