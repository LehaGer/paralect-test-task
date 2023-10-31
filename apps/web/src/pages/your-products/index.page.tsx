import { NextPage } from 'next';
import {
  Center,
  Flex,
  Pagination, Container, Skeleton,
} from '@mantine/core';
import React, { useState } from 'react';
import ProductCard from 'components/ProductCard/ProductCard';
import { productApi, productTypes } from 'resources/product';
import { useStyles } from './styles';
import AddNewCardButton from './components/AddNewCardButton';
import { Link } from '../../components';
import { RoutePath } from '../../routes';

const YourProducts: NextPage = () => {
  const [params, setParams] = useState<productTypes.ProductsListParams>({ perPage: 9 });

  const {
    data: productListResp,
    isLoading: isProductListLoading,
  } = productApi.useList<productTypes.ProductsListParams>(params);

  const [pageIndex, setPageIndex] = useState<number>(1);

  const onPageChangeHandler = (currentPage: any) => {
    setPageIndex(currentPage);
    setParams((prev) => ({
      ...prev,
      page: currentPage,
    }));
  };

  const renderPagination = () => {
    const totalPages = productListResp?.totalPages ?? 1;

    if (totalPages === 1) return;

    return (
      <Pagination
        total={totalPages}
        value={pageIndex}
        onChange={onPageChangeHandler}
        color="black"
      />
    );
  };

  const { mutate: removeCard } = productApi.useRemove();

  const { classes } = useStyles();

  return (
    <>
      <Container className={classes.pageName}>
        Your Products
      </Container>
      <Flex
        gap="md"
        justify="center"
        align="center"
        direction="row"
        wrap="wrap"
      >
        <Link type="router" href={RoutePath.YourProductsCreate} underline={false}>
          <AddNewCardButton />
        </Link>
        {isProductListLoading && Array(4).fill(null).map(() => (
          <Skeleton
            radius="md"
            visible={isProductListLoading}
            width="20.03125rem"
            mih="23.40453rem"
          />
        ))}
        {productListResp?.items.map((product) => (
          <ProductCard
            isOwn
            price={product.price}
            name={product.name}
            imageUrl={product.imageUrl}
            key={product._id}
            removeCard={() => { removeCard(product._id); }}
          />
        ))}
      </Flex>
      <Center className={classes.paginationSection}>{renderPagination()}</Center>
    </>
  );
};

export default YourProducts;
