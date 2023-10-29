import React, { FC } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button, Container } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useStyles } from './styles';
import { productTypes } from '../../../../../resources/product';
import { Table } from '../../../../../components';
import { cartApi, cartTypes } from '../../../../../resources/cart';
import ImageTableItem from '../../../../../components/ImageTableItem';

interface IMyCartTableProps {
  items: productTypes.Product[]
}

const MyCartTable: FC<IMyCartTableProps> = ({ items }) => {
  const { classes } = useStyles();
  const { mutate: removeFromCart } = cartApi.useRemoveProduct<cartTypes.RemoveProductParams>();

  const columns: ColumnDef<productTypes.Product>[] = [
    {
      accessorKey: 'imageUrl',
      header: 'Item',
      cell: (info) => (
        <ImageTableItem
          imageUrl={info.getValue() as string}
          name={info.row.original.name}
          className={classes.image}
        />
      ),
    },
    {
      accessorKey: 'price',
      header: 'Unit Price',
      cell: (info) => (
        <Container className={classes.price}>
          {info.getValue() ? `$${info.getValue()}` : ''}
        </Container>
      ),
    },
    {
      accessorKey: '_id',
      header: '',
      cell: (info) => (
        <Button
          leftIcon={<IconX />}
          onClick={() => {
            removeFromCart({ productId: info.getValue() as string });
          }}
          className={classes.removeButton}
        >
          Remove
        </Button>
      ),
    },
  ];

  const PER_PAGE = 1;

  return (
    <Table
      data={items}
      columns={columns}
      perPage={PER_PAGE}
    />
  );
};

export default MyCartTable;
