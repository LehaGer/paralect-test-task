import { createStyles, MantineTheme } from '@mantine/core';

export const useStyles = createStyles((theme: MantineTheme) => ({
  pageName: {
    margin: '1em',
    fontSize: '2em',
    color: 'gray',
    fontWeight: 'bold',
  },
  notExistsMsg: {
    margin: '1em',
    fontSize: '1.5em',
    color: theme.colors.gray[4],
    fontWeight: 'bold',
  },
  paginationSection: {
    marginTop: '2em',
    marginBottom: '2em',
  },
  tableContainer: {
    maxWidth: 'calc(100% - 24.5575rem)',
    width: '100%',
    margin: '0 auto 0 0',
    padding: '0',
  },
}));
