import React, { FC } from 'react';
import { Container, Image } from '@mantine/core';
import { useStyles } from './styles';

interface IImageTableItemProps {
  imageUrl: string;
  name: string;
  className?: string;
}

const ImageTableItem: FC<IImageTableItemProps> = ({ imageUrl, name, className }) => {
  const { classes } = useStyles();

  return (
    <Container className={`${classes.root} ${className && ''}`}>
      <Image className={classes.image} src={imageUrl} width="5rem" height="5rem" />
      <Container className={classes.name}>
        {name}
      </Container>
    </Container>
  );
};

export default ImageTableItem;
