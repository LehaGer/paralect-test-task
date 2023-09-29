import { createStyles, getStylesRef, MantineTheme } from '@mantine/core';

export const useStyles = createStyles(({ colors, spacing }: MantineTheme) => ({
  card: {
    ref: getStylesRef('card'),
    backgroundColor: colors.body,
    pointerEvents: 'initial',
    width: '20em',
    height: '30em',
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
    height: '15em',

  },
  section: {
    ref: getStylesRef('section'),
    padding: spacing.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: 'inherit',
    // 'border-bottom': rem(1px) solid light-dark(colors.gray[3]), colors.gray[4]),
  },
  name: {
    color: colors.gray[6],
    fontSize: '1.5em',
    fontWeight: 'bold',
  },
  priceSection: {
    // width: 'max-content',
    // margin: 'auto',
  },
  price: {
    color: colors.gray[6],
    fontSize: '1.5em',
    // fontWeight: 'bold',
  },
  buttonSection: {

  },
  button: {
    fontSize: '1em',
  },
  addToCartButton: {},
  buyButton: {},
  changeButton: {},
  deleteButton: {},
}));
