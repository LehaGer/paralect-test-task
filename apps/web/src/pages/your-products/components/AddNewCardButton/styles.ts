import { createStyles, MantineTheme } from '@mantine/core';

export const useStyles = createStyles((theme: MantineTheme) => ({
  root: {
    display: 'flex',
    width: '20.03125rem',
    height: '18.8rem',
    'padding-bottom': '0px',
    'flex-direction': 'column',
    'justify-content': 'center',
    'align-items': 'center',
    gap: '1rem',
    'border-radius': '0.75rem',
    border: '1.126px solid var(--mantine-color-gray-1, #ECECEE)',
    background: theme.white,
    margin: 0,
    padding: 0,
    '&:hover': {
      background: theme.white,
    },
  },
  content: {
    display: 'flex',
    'flex-direction': 'column',
    'justify-content': 'center',
    'align-items': 'center',
    gap: '0.75rem',
    margin: 0,
    padding: 0,
  },
  button: {
    display: 'flex',
    width: '2.5rem',
    height: '2.5rem',
    padding: '0.46875rem 0.46875rem 0.53125rem 0.53125rem',
    'justify-content': 'center',
    'align-items': 'center',
    'border-radius': '2rem',
    background: 'var(--mantine-color-blue-6, #2B77EB)',
    color: theme.white,
  },
  info: {
    color: 'var(--mantine-color-blue-6, #2B77EB)',
    // 'font-family': 'Poppins',
    'font-size': '1.25rem',
    'font-style': 'normal',
    'font-weight': '400',
    'line-height': '1.3125rem',
    margin: 0,
    padding: 0,
  },
}));
