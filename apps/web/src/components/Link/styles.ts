import { CSSObject, MantineTheme } from '@mantine/core';

const styles = (
  { colors }: MantineTheme,
  disabled?: boolean,
): CSSObject => ({
  color: disabled ? colors.gray[2] : colors.gray[6],
  display: 'flex',
  gap: '5px',
  pointerEvents: disabled ? 'none' : 'initial',

  '&:hover': {
    color: disabled ? colors.gray[2] : colors.gray[7],
    textDecoration: 'none',
  },
});

export default styles;
