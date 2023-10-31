import { FC, memo, ReactNode } from 'react';
import NextLink from 'next/link';
import { Anchor } from '@mantine/core';

import styles from './styles';

interface LinkProps {
  children: ReactNode;
  type?: 'url' | 'router';
  href?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'left' | 'center' | 'right' | 'justify';
  icon?: ReactNode;
  inNewTab?: boolean;
  underline?: boolean;
  inherit?: boolean;
  disabled?: boolean;
  className?: string;
}

const Link: FC<LinkProps> = ({
  type = 'url',
  children,
  href = '#',
  size = 'md',
  disabled,
  inNewTab,
  underline = true,
  icon,
  inherit,
  align = 'left',
  className,
}) => {
  switch (type) {
    case 'router':
      return (
        <Anchor
          size={size}
          inherit={inherit}
          underline={underline}
          sx={(theme) => styles(theme, disabled)}
          align={align}
          className={className}
          component={NextLink}
          href={href}
          passHref
        >
          {icon}
          {children}
        </Anchor>
      );

    case 'url':
      return (
        <Anchor
          href={href}
          target={inNewTab ? '_blank' : '_self'}
          rel="noreferrer"
          size={size}
          inherit={inherit}
          underline={underline}
          sx={(theme) => styles(theme, disabled)}
          align={align}
        >
          {icon}
          {children}
        </Anchor>
      );
    default:
      return null;
  }
};

export default memo(Link);
