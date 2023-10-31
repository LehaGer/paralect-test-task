import { createStyles } from '@mantine/core';

export const useStyles = createStyles(() => ({
  root: {
    'min-width': '100%',
    padding: 0,
  },
  buttonsSection: {
    display: 'flex',
    'align-items': 'flex-start',
    gap: '2rem',
    maxWidth: '100%',
    padding: 0,
    marginBottom: '1.25rem',
  },
  button: {
    color: 'var(--mantine-color-gray-5, #A3A3A3)',
    'font-size': '1.25rem',
    'font-style': 'normal',
    'font-weight': '600',
    'line-height': 'normal',
    backgroundColor: 'transparent',
    textTransform: 'none',
    height: '1.5rem',
    padding: 0,
    borderRadius: 0,
  },
  active: {
    color: 'var(--mantine-color-dark-6, #201F22)',
  },
}));
