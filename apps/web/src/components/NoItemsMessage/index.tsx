import { FC, ReactElement } from 'react';
import { Container, Image } from '@mantine/core';
import { useStyles } from './styles';

interface INoItemsMessageProps {
  detailedMessage: string;
  actionButton?: ReactElement
}

const NoItemsMessage: FC<INoItemsMessageProps> = ({
  detailedMessage, actionButton,
}) => {
  const { classes } = useStyles();
  return (
    <Container className={classes.root}>
      <Image className={classes.image} src="../images/baloon.png" width="12.875rem" height="12.875rem" />
      <Container className={classes.primaryText}>{'Oops, there\'s nothing here yet!'}</Container>
      {detailedMessage && (
        <Container className={classes.additionalInfo}>{detailedMessage}</Container>
      )}
      {actionButton && (
        <Container className={classes.actionButton}>{actionButton}</Container>
      )}
    </Container>
  );
};

export default NoItemsMessage;
