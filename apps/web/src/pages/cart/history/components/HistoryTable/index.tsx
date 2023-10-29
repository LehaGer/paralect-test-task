import React, { FC } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Container } from '@mantine/core';
import { useStyles } from './styles';
import { Table } from '../../../../../components';
import { cartTypes } from '../../../../../resources/cart';
import ImageTableItem from '../../../../../components/ImageTableItem';

interface IHistoryTableProps {
  stripeSessionList: cartTypes.HistoryItemResponse[]
}

interface IProductWithSessionInfo {
  id?: string;
  price?: number;
  name?: string;
  imageUrl: string | null;
  sessionId: string;
  totalSessionCost: number | null;
  status: 'complete' | 'expired' | 'open' | null;
  paymentStatus: 'no_payment_required' | 'paid' | 'unpaid';
  paymentIntentTime: Date;
}
const HistoryTable: FC<IHistoryTableProps> = ({ stripeSessionList }) => {
  const items = stripeSessionList.reduce((acc: IProductWithSessionInfo[], sessionItem) => {
    const productsWithSessionInfo = sessionItem.products.map((product) => ({
      ...product,
      sessionId: sessionItem.id,
      totalSessionCost: sessionItem.totalCost,
      status: sessionItem.status,
      paymentStatus: sessionItem.paymentStatus,
      paymentIntentTime: sessionItem.paymentIntentTime,
    }));
    return [
      ...acc,
      ...productsWithSessionInfo,
    ];
  }, []);
  const { classes } = useStyles();

  const columns: ColumnDef<IProductWithSessionInfo>[] = [
    {
      accessorKey: 'id',
      header: 'Item',
      cell: (info) => (
        <ImageTableItem
          imageUrl={info.row.original.imageUrl ?? ''}
          name={info.row.original.name ?? ''}
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
      accessorKey: 'paymentIntentTime',
      header: 'Date',
      cell: (info) => (
        <Container className={classes.date}>
          {`${(new Date(info.getValue() as string))
            .toLocaleDateString()
            .replace('/', '')}`}
        </Container>
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

export default HistoryTable;
