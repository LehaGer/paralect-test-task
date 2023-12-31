import { createStyles, MantineTheme } from '@mantine/core';

export const useStyles = createStyles((theme: MantineTheme) => ({
  componentRoot: {
    display: 'flex',
    width: '19.6875rem',
    padding: '1.25rem',
    // 'align-items': 'flex-start',
    // gap: '0.625rem',
    'border-radius': '0.75rem',
    border: '1px solid var(--mantine-color-gray-2, #ECECEE)',
    background: theme.white,
    'flex-direction': 'column',
    'align-items': 'flex-start',
    gap: '2rem',
    flex: '1 0 0',
  },
  header: {
    display: 'flex',
    'justify-content': 'space-between',
    'align-items': 'center',
    'align-self': 'stretch',
  },
  componentNameSection: {
    // fontSize: '1.2em',
    // fontWeight: 'bold',
    // color: theme.colors.gray[7],
    // textAlign: 'left',
    margin: 0,
    padding: 0,

    color: 'var(--mantine-color-dark-6, #201F22)',
    'font-family': 'Inter',
    'font-size': '1.25rem',
    'font-style': 'normal',
    'font-weight': '700',
    'line-height': 'normal',
  },
  resetAllBtn: {
    // width: '7em',
    // marginLeft: 'auto',

    borderRadius: '2.5rem',
    // margin: 0,
    padding: 0,
    backgroundColor: 'transparent !important',

    display: 'flex',
    'align-items': 'center',
    gap: '0.25rem',
    color: 'var(--mantine-color-dark-1, #A3A3A3)',
    'font-family': 'Inter',
    'font-size': '0.875rem',
    'font-style': 'normal',
    'font-weight': '500',
    'line-height': '1.25rem',

    rightIcon: {
      margin: 0,
      '& *': {
        margin: 0,
      },
    },
  },
  resetAllBtnCross: {
    width: '1rem',
    height: '1rem',
  },
  filterType: {
    display: 'flex',
    'flex-direction': 'column',
    'align-items': 'flex-start',
    gap: '0.75rem',
    'align-self': 'stretch',
  },
  filterTypeName: {
    color: 'var(--mantine-color-dark-5, #201F22)',
    'font-family': 'Inter',
    'font-size': '1rem',
    'font-style': 'normal',
    'font-weight': '700',
    'line-height': 'normal',

    // fontSize: '1em',
    // fontWeight: 'bold',
    // color: theme.colors.gray[7],
    // textAlign: 'left',
    margin: 0,
    padding: 0,
  },
  filterInputSection: {
    display: 'flex',
    'align-items': 'flex-start',
    gap: '0.75rem',
    'align-self': 'stretch',
  },
  filterInput: {
    input: {
      display: 'flex',
      padding: '0.5rem 0.75rem',
      'align-items': 'center',
      gap: '0.625rem',
      flex: '1 0 0',
      'border-radius': '0.5rem',
      border: '1px solid var(--mantine-color-gray-3, #ECECEE)',
      background: theme.white,
      'min-height': '2.25rem',
      height: '2.25rem',
      'font-size': '0.875rem',
      'line-height': '1.25rem',
      'font-weight': '500',
      width: '8.21875rem',
    },
  },
  filterInputIcon: {
    margin: 0,
    width: 'max-content',
    paddingLeft: '.75rem',
    paddingRight: '.25rem',
    'font-style': 'normal',
    'font-size': '0.875rem',
    'font-weight': '500',
    'line-height': '1.25rem',
  },
  priceInput: {
    width: '100px',
  },
}));
