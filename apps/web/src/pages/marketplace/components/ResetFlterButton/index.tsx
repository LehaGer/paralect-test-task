import React, { FC } from 'react';
import { ActionIcon, Button } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useStyles } from './styles';

interface IResetFilerButtonProps {
  content: string;
  filterSkipHandler: () => void;
}

const ResetFilerButton: FC<IResetFilerButtonProps> = ({ content, filterSkipHandler }) => {
  const { classes } = useStyles();

  return (
    <Button
      variant="outline"
      color="gray"
      radius="xl"
      size="xs"
      compact
      className={classes.root}
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
};

export default ResetFilerButton;
