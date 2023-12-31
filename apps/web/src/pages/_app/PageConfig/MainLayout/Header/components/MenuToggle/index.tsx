import { forwardRef, memo } from 'react';
import { Avatar, UnstyledButton } from '@mantine/core';

import { accountApi } from 'resources/account';

const MenuToggle = forwardRef<HTMLButtonElement>((props, ref) => {
  const { data: account } = accountApi.useGet();

  if (!account) return null;

  return (
    <UnstyledButton ref={ref} {...props}>
      <Avatar color="dark" radius="xl" src={account.avatarUrl}>
        {account.email.charAt(0)}
      </Avatar>
    </UnstyledButton>
  );
});

export default memo(MenuToggle);
