import { createStyles } from '@mantine/core';

export const useStyles = createStyles(() => ({
  pageName: {
    margin: '1em',
    fontSize: '2em',
    color: 'gray',
    fontWeight: 'bold',
  },
  notExistsMsg: {},
  tableContainer: {
    maxWidth: 'calc(100% - 4.87rem)',
    width: '100%',
    margin: '0 auto 0 0',
    padding: '0',
  },
}));
