import { MantineTheme, MantineThemeOverride } from '@mantine/core';

function getButtonRootStyles(theme: MantineTheme, propsColor?: string, contextVariant?: string) {
  let colorsParams: Record<string, any> = {};
  const commonParams: Record<string, any> = {
    display: 'inline-flex',
    height: '2.5rem',
    padding: '0.25rem 1.25rem',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.625rem',
    flexShrink: '0',
    borderRadius: '0.5rem',
  };

  if (!propsColor) {
    if (contextVariant === 'filled') {
      colorsParams = {
        backgroundColor: theme.colors.blue[6],
        color: theme.white,
        '&:hover:not([data-disabled]):not(:active)': theme.fn.hover({
          backgroundColor: theme.colors.blue[5],
          color: theme.white,
        }),
        '&:active:not([data-disabled])': {
          backgroundColor: theme.colors.blue[7],
          color: theme.white,
        },
      };
    } else if (contextVariant === 'outline') {
      colorsParams = {
        backgroundColor: 'transparent',
        borderColor: theme.colors.gray[2],
        color: theme.colors.gray[4],
        '&:hover:not([data-disabled]):not(:active)': theme.fn.hover({
          backgroundColor: 'transparent',
          borderColor: theme.colors.blue[5],
          color: theme.colors.blue[6],
        }),
        '&:active:not([data-disabled])': {
          backgroundColor: 'transparent',
          borderColor: theme.colors.blue[5],
          color: theme.colors.blue[7],
        },
      };
    }
  }

  return {
    ...commonParams,
    ...colorsParams,
  };
}

const shipTheme: MantineThemeOverride = {
  fontFamily: 'Roboto, sans-serif',
  fontFamilyMonospace: 'monospace',
  headings: {
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 600,
  },
  lineHeight: 1.45,
  primaryColor: 'blue',
  primaryShade: 6,
  other: {
    transition: {
      speed: {
        fast: '200ms',
        smooth: '300ms',
        slow: '400ms',
        slowest: '1000ms',
      },
      easing: {
        linear: 'linear',
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out',
        easeInBack: 'cubic-bezier(0.82,-0.2, 0.32, 1.84)',
        easeOutBack: 'cubic-bezier(0.5,-1.18, 0.51, 1.11)',
        easeInOutBack: 'cubic-bezier(.64,-0.56,.34,1.55)',
      },
    },
  },
  components: {
    Button: {
      defaultProps: { size: 'lg' },
      styles: (theme, { color: propsColor }, { variant: contextVariant }) => ({
        root: getButtonRootStyles(theme, propsColor, contextVariant),
        label: {
          fontWeight: 500,
        },
      }),
    },
    TextInput: {
      defaultProps: {
        size: 'lg',
      },
      styles: (theme: MantineTheme) => ({
        root: {
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          gap: '.5rem',
        },
        input: {
          display: 'flex',
          alignItems: 'center',
          alignSelf: 'stretch',
          gap: '0.5rem',
          height: '2.5rem',
          minHeight: '2.5rem',
          padding: '0.0625rem 0.875rem',
          borderRadius: '0.5rem',
          border: '1px solid var(--mantine-color-gray-4, #ECECEE)',
          background: theme.white,

          overflow: 'hidden',
          color: 'var(--mantine-color-dark-6, #201F22)',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',

          fontFamily: 'Inter',
          fontSize: '1rem',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: '1.5rem',

          '&::placeholder, &:disabled, &:disabled::placeholder': {
            color: 'var(--mantine-color-gray-5, #A3A3A3)',
          },

          '&:hover:not([data-disabled])': theme.fn.hover({
            border: '1px solid var(--mantine-color-blue-6, #2B77EB)',
            backgroundColor: theme.white,
          }),

          caretColor: 'var(--mantine-color-blue-6, #2B77EB)',
        },
        label: {
          color: theme.black,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontFamily: 'Inter',
          fontSize: '1rem',
          fontStyle: 'normal',
          fontWeight: 600,
          lineHeight: '1.5rem',
        },
        invalid: {
          color: theme.colors.gray[9],

          '&, &:focus-within': {
            borderColor: theme.colors.red[6],
          },
        },
      }),
    },
    PasswordInput: {
      defaultProps: { size: 'lg' },
      styles: (theme: MantineTheme) => ({
        root: {
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          gap: '.5rem',
        },
        input: {
          height: '2.5rem',
          minHeight: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          alignSelf: 'stretch',
          padding: '0.0625rem 0.875rem',
          gap: '0.5rem',
          borderRadius: '0.5rem',
          border: '1px solid var(--mantine-color-gray-4, #ECECEE)',
          background: theme.white,

          '&:hover:not([data-disabled])': theme.fn.hover({
            border: '1px solid var(--mantine-color-blue-6, #2B77EB)',
            backgroundColor: theme.white,
          }),
        },
        innerInput: {
          top: 'initial',
          bottom: 'initial',
          height: '2.5rem',
          minHeight: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flex: '1 0 0',
          overflow: 'hidden',
          color: 'var(--mantine-color-dark-6, #201F22)',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',

          fontFamily: 'Inter',
          fontSize: '1rem',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: '1.5rem',

          '&::placeholder, &:disabled, &:disabled::placeholder': {
            color: 'var(--mantine-color-gray-5, #A3A3A3)',
          },

          caretColor: 'var(--mantine-color-blue-6, #2B77EB)',
        },
        label: {
          color: theme.black,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontFamily: 'Inter',
          fontSize: '1rem',
          fontStyle: 'normal',
          fontWeight: 600,
          lineHeight: '1.5rem',
        },
        invalid: {
          input: {
            // '&::placeholder': {
            //   color: theme.colors.red[6],
            // },
          },
        },
      }),
    },
    NumberInput: {
      defaultProps: {
        size: 'lg',
      },
      styles: (theme: MantineTheme) => ({
        root: {
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          gap: '.5rem',
        },
        input: {
          display: 'flex',
          alignItems: 'center',
          alignSelf: 'stretch',
          gap: '0.5rem',
          height: '2.5rem',
          minHeight: '2.5rem',
          padding: '0.0625rem 0.875rem',
          borderRadius: '0.5rem',
          border: '1px solid var(--mantine-color-gray-4, #ECECEE)',
          background: theme.white,

          overflow: 'hidden',
          color: 'var(--mantine-color-dark-6, #201F22)',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',

          fontFamily: 'Inter',
          fontSize: '1rem',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: '1.5rem',

          '&::placeholder, &:disabled, &:disabled::placeholder': {
            color: 'var(--mantine-color-gray-5, #A3A3A3)',
          },

          '&:hover:not([data-disabled])': theme.fn.hover({
            border: '1px solid var(--mantine-color-blue-6, #2B77EB)',
            backgroundColor: theme.white,
          }),

          caretColor: 'var(--mantine-color-blue-6, #2B77EB)',
        },
        label: {
          color: theme.black,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontFamily: 'Inter',
          fontSize: '1rem',
          fontStyle: 'normal',
          fontWeight: 600,
          lineHeight: '1.5rem',
        },
        control: {
          display: 'none',
        },
        invalid: {
          color: theme.colors.gray[9],

          '&, &:focus-within': {
            borderColor: theme.colors.red[6],
          },
        },
      }),
    },
    Select: {
      defaultProps: { size: 'md' },
    },
    Image: {
      styles: () => ({
        image: {
          objectPosition: 'left !important',
        },
      }),
    },
  },
};

export default shipTheme;
