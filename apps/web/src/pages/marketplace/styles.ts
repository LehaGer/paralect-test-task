import { createStyles, getStylesRef, MantineTheme } from '@mantine/core';

export const useStyles = createStyles(({ colors }: MantineTheme) => ({
  pageRoot: {
    ref: getStylesRef('pageRoot'),
    width: '100%',
    maxWidth: '100%',
  },
  mainInfoWrapper: {
    gap: '1.25rem',
    flexShrink: 0,
  },
  searchInput: {
    input: {
      display: 'flex',
      // width: '62.5625rem',
      height: '3rem',
      padding: '0rem 0.75rem',
      'align-items': 'center',
      gap: '0.625rem',
      'flex-shrink': '0',
      'font-size': '0.875rem',
      'font-style': 'normal',
      'font-weight': '400',
      'line-height': '1.3125rem',
    },
    icon: {
      display: 'flex',
      width: '62.5625rem',
      height: '3rem',
      padding: '0rem 0.75rem',
      'align-items': 'center',
      gap: '0.625rem',
      'flex-shrink': '0',
    },

  },
  searchParamsSection: {
    gap: '0.75rem',
  },
  sortBySection: {
    'font-size': '0.875rem',
    'font-style': 'normal',
    'font-weight': '500',
    'line-height': '1.3125rem',
    color: 'var(--mantine-color-dark-6, #201F22)',
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
  paginationSection: {
    marginTop: '1.94rem',
    marginBottom: '2rem',
  },
}));
