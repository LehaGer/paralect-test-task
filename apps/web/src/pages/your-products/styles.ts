import { createStyles, MantineTheme } from '@mantine/core';

export const useStyles = createStyles((theme: MantineTheme) => ({
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
