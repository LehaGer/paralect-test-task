import { CSSObject, MantineTheme } from '@mantine/core';

const styles = (
  { colors }: MantineTheme,
  isActive?: boolean,
): CSSObject => ({
  textTransform: 'capitalize',
  color: isActive ? colors.gray[7] : colors.gray[5],
  backgroundColor: isActive ? colors.gray[3] : colors.gray[0],
  fontSize: '.85em',
  padding: '1.1em',

  '&:hover': {
    color: isActive ? colors.gray[7] : colors.gray[7],
    backgroundColor: isActive ? colors.gray[3] : colors.gray[1],
    textDecoration: 'none',
  },
});

export default styles;
