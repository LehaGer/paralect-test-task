import { createStyles, MantineTheme } from '@mantine/core';

export const useStyles = createStyles((theme: MantineTheme) => ({
  componentRoot: {
    backgroundColor: theme.white,
    borderRadius: '1em',
    padding: '2em',
    border: `1px solid ${theme.colors.gray[2]}`,
  },
  componentNameSection: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    color: theme.colors.gray[7],
    textAlign: 'left',
    margin: 0,
    padding: 0,
  },
  resetAllBtn: {
    width: '7em',
    marginLeft: 'auto',
  },
  filterTypeName: {
    fontSize: '1em',
    fontWeight: 'bold',
    color: theme.colors.gray[7],
    textAlign: 'left',
    margin: 0,
    padding: 0,
  },
  priceInput: {
    width: '100px',
  },
}));
