import React, { FC } from 'react';
import { Container, ActionIcon } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useStyles } from './styles';

interface IAddNewCardButtonProps {
  onClick?: (e: any) => void;
}

const AddNewCardButton: FC<IAddNewCardButtonProps> = ({ onClick }) => {
  const { classes } = useStyles();
  return (
    <ActionIcon className={classes.root} onClick={onClick}>
      <Container className={classes.content}>
        <IconPlus className={classes.button} />
        <Container className={classes.info}>New Product</Container>
      </Container>
    </ActionIcon>
  );
};

export default AddNewCardButton;
