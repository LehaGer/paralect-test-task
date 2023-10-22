import { createStyles, getStylesRef, MantineTheme } from '@mantine/core';

export const useStyles = createStyles(({ colors, spacing }: MantineTheme) => ({
  card: {
    ref: getStylesRef('card'),
    backgroundColor: colors.body,
    pointerEvents: 'initial',
    width: '20em',
    height: '26em',
    display: 'grid',
    gridTemplateRows: 'min-content 1fr min-content',
    overflow: 'hidden',
    '&:hover': {
      backgroundColor: colors.gray[0],
    },
  },
  imageSection: {
    ref: getStylesRef('imageSection'),
    padding: '0',
    borderBottom: `rem(1px) solid light-dark(${colors.gray[3]}), ${colors.gray[4]})`,
    height: '13em',
    overflow: 'hidden',
    pointerEvents: 'none',
    userSelect: 'none',
    '& img': {
      objectFit: 'cover',
      height: '13em',
    },
    '$ button': {
      height: '1.5em',
      fontSize: '0.8em',
    },
  },
  section: {
    ref: getStylesRef('section'),
    padding: spacing.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    width: 'inherit',
  },
  name: {
    color: colors.gray[7],
    fontSize: '1.6em',
    fontWeight: 'bold',
    textAlign: 'left',
    paddingBottom: '0',
    paddingLeft: 26,
  },
  priceSection: {
    paddingTop: '.2em',
  },
  priceTitle: {
    color: colors.gray[5],
    fontSize: '.8em',
    margin: 0,
    paddingLeft: 10,
  },
  price: {
    color: colors.gray[7],
    fontSize: '1.7em',
    fontWeight: 'bold',
    margin: 0,
    paddingRight: 10,
  },
  buttonSection: {
    '& button': {
      width: '100%',
    },
  },
  button: {
    // fontSize: '1em',
  },
  addToCartButton: {},
  buyButton: {},
  changeButton: {},
  deleteButton: {},
}));
