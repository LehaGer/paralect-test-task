import React, { FC } from 'react';
import { ActionIcon, Button } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

interface IResetFilerButtonProps {
  content: string;
  filterSkipHandler: () => void;
}

const ResetFilerButton: FC<IResetFilerButtonProps> = ({ content, filterSkipHandler }) => (
  <Button
    variant="outline"
    color="gray"
    radius="xl"
    size="xs"
    compact
    sx={{
      height: '3em',
      marginLeft: '1em',
    }}
    type="reset"
    rightIcon={(
      <ActionIcon
        radius="xl"
        color="gray"
        variant="filled"
        size={15}
        // spacing={0}
        style={{ margin: 0 }}
      >
        <IconX size={15} />
      </ActionIcon>
    )}
    onClick={filterSkipHandler}
  >
    {content}
  </Button>
);

export default ResetFilerButton;
