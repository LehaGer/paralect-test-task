import { createStyles, getStylesRef, MantineTheme } from '@mantine/core';

export const useStyles = createStyles(({ colors }: MantineTheme) => ({
  pageRoot: {
    ref: getStylesRef('pageRoot'),
    width: '100%',
    maxWidth: '100%',
  },
  responseSummary: {
    ref: getStylesRef('responseSummary'),
    margin: 0,
    paddingLeft: 5,
    fontWeight: 'bold',
  },
  productsNotExistsMsg: {
    ref: getStylesRef('productsNotExistsMsg'),
    margin: '1em',
    fontSize: '1.5em',
    color: colors.gray[4],
    fontWeight: 'bold',
  },
}));
