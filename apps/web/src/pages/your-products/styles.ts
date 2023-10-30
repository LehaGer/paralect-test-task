import { createStyles, MantineTheme } from '@mantine/core';

export const useStyles = createStyles((theme: MantineTheme) => ({
  pageName: {
    width: '9.0625rem',
    color: 'var(--mantine-color-dark-6, #201F22)',
    'font-size': '1.25rem',
    'font-style': 'normal',
    'font-weight': '600',
    'line-height': 'normal',
    margin: '0 0 1.25rem 0',
    padding: 0,
  },
  paginationSection: {
    marginTop: '2em',
  },
  addNewProductBtn: {
    marginTop: '2em',
    marginBottom: '2em',
  },
  notExistsMsg: {
    margin: '1em',
    fontSize: '1.5em',
    color: theme.colors.gray[4],
    fontWeight: 'bold',
  },
}));
