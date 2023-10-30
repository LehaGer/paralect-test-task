import { createStyles, getStylesRef } from '@mantine/core';

const BROWSE_BTN_SIZE = '11.25rem';

export const useStyles = createStyles(({
  colors,
  white,
  primaryColor,
  other: {
    transition: { speed, easing },
  },
}) => ({
  dropzoneRoot: {
    border: 'none',
    borderRadius: '1.25rem',
    padding: 0,
    margin: 0,
    backgroundColor: 'transparent',
    overflow: 'hidden',

    [`&:hover .${getStylesRef('addIcon')}`]: {
      color: colors.gray[5],
    },

    [`&:hover .${getStylesRef('innerAvatar')}`]: {
      opacity: 1,
    },
  },
  browseButton: {
    ref: getStylesRef('browseButton'),
    width: BROWSE_BTN_SIZE,
    height: BROWSE_BTN_SIZE,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: `all ${speed.fast} ${easing.easeInOut}`,
    cursor: 'pointer',
    fontSize: '5rem',
  },
  error: {
    border: `.25rem dashed ${colors.red[5]}`,
  },
  addIcon: {
    ref: getStylesRef('addIcon'),
    color: colors[primaryColor][6],
    transition: `all ${speed.fast} ${easing.easeInOut}`,
  },
  innerAvatar: {
    ref: getStylesRef('innerAvatar'),
    width: BROWSE_BTN_SIZE,
    height: BROWSE_BTN_SIZE,
    background: '#10101099',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.gray[2],
    opacity: 0,
    transition: `all ${speed.smooth} ${easing.easeInOut}`,
    '& > *': {
      width: '2.5rem',
      height: '2.5rem',
    },
  },
  text: {
    width: '144px',
    lineHeight: '24px',
    color: colors.gray[6],
    wordWrap: 'break-word',
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  errorMessage: {
    marginTop: '10px',
    fontSize: '14px',
    lineHeight: '17px',
    color: colors.red[5],
  },
  avatar: {
    width: BROWSE_BTN_SIZE,
    height: BROWSE_BTN_SIZE,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  },
  imageDropzoneContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    padding: 0,
  },
  deleteButton: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    display: 'flex',
    width: '2rem',
    height: '2rem',
    padding: '0.375rem',
    'justify-content': 'center',
    'align-items': 'center',
    gap: '0.625rem',
    'border-radius': '0.5rem',
    background: white,
    'flex-shrink': 0,
  },
}));
