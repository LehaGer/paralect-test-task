import { createStyles, MantineTheme } from '@mantine/core';

export const useStyles = createStyles((theme: MantineTheme) => ({
  infoSection: {
    margin: '1em',
    marginBottom: '3em',
    width: '25em',
  },
  infoSectionItem: {
    width: 'max-content',
  },
  infoSectionItemName: {
    fontSize: '.8em',
    color: theme.colors.gray[5],
  },
  infoSectionItemValue: {
    fontSize: '1.5em',
    fontWeight: 'bold',
    color: theme.colors.gray[7],
    textAlign: 'left',
  },
  productsList: {
    margin: '1em',
  },
  notExistsMsg: {
    margin: '1em',
    fontSize: '1.5em',
    color: theme.colors.gray[4],
    fontWeight: 'bold',
  },
}));
