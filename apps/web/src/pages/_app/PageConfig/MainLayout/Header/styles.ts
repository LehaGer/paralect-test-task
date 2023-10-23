import { CSSObject, MantineTheme, createStyles } from '@mantine/core';

export const styles = (
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

export const useStyles = createStyles((theme: MantineTheme) => ({
  linksWrapper: {
    minHeight: '72px',
    padding: '0 32px',
    display: 'flex',
    flex: '1 1 auto',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.gray[0],
  },
  mainLogoWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: theme.colors.gray[7],
    fontSize: '1.5em',
    fontWeight: 'bold',
    gap: '10px',
  },
}));

export default { styles, useStyles };
