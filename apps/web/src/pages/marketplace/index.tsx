import { NextPage } from 'next';
import {
  ActionIcon,
  Button,
  Center, Container,
  Flex, Grid,
  Group, Menu,
  Pagination,
  Skeleton,
  Stack,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import { IconArrowsDownUp, IconSearch, IconX, IconChevronDown } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import React, {
  ChangeEvent,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import isNumber from 'lodash/isNumber';
import { PaginationState } from '@tanstack/react-table';
import ProductCard from 'components/ProductCard/ProductCard';
import { productApi, productTypes } from 'resources/product';
import { cartApi, cartTypes } from 'resources/cart';
import ResetFilerButton from './components/ResetFlterButton';
import Filter from './components/Filter';
import { useStyles } from './styles';

const Marketplace: NextPage = () => {
  const { data: cart } = cartApi.useGet();

  const [params, setParams] = useState<productTypes.ProductsListParams>({});

  const [sortBy, setSortBy] = useState<'createdOn' | 'price' | 'name'>('createdOn');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const { mutate: addToCart } = cartApi.useAddProduct<cartTypes.AddProductParams>();
  const { mutate: removeFromCart } = cartApi.useRemoveProduct<cartTypes.RemoveProductParams>();

  const {
    data: productListResp,
    isLoading: isProductListLoading,
  } = productApi.useList<productTypes.ProductsListParams>(params);

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: 8,
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const onPageChangeHandler = useCallback(
    (currentPage: any) => {
      setPagination({ pageIndex: currentPage, pageSize });
      setParams((prev) => ({
        ...prev,
        page: currentPage,
      }));
    },
    [pageSize],
  );

  const renderPagination = useCallback(() => {
    const { totalPages } = productListResp || {
      totalPages: 1,
    };

    const { pageIndex: memoizedPageIndex } = pagination;

    if (totalPages <= 1) return;

    return (
      <Pagination
        total={totalPages}
        value={memoizedPageIndex}
        onChange={onPageChangeHandler}
        color="black"
      />
    );
  }, [onPageChangeHandler, productListResp, pagination]);

  const [filterByName, setFilterByName] = useState('');
  const [filterByPriceFrom, setFilterByPriceFrom] = useState<number>();
  const [filterByPriceTo, setFilterByPriceTo] = useState<number>();

  const [debouncedFilterByName] = useDebouncedValue(filterByName, 500);
  const [debouncedFilterByPriceFrom] = useDebouncedValue(
    filterByPriceFrom,
    500,
  );
  const [debouncedFilterByPriceTo] = useDebouncedValue(filterByPriceTo, 500);

  const handleFilterByName = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setFilterByName(event.target.value);
    },
    [],
  );
  const handleFilterByPriceFrom = useCallback((val: number | '') => {
    setFilterByPriceFrom(isNumber(val) ? val : undefined);
  }, []);
  const handleFilterByPriceTo = useCallback((val: number | '') => {
    setFilterByPriceTo(isNumber(val) ? val : undefined);
  }, []);

  useLayoutEffect(() => {
    setParams((prev) => ({
      ...prev,
      perPage: 8,
      filter: {
        ...prev.filter,
        name: debouncedFilterByName,
        price: {
          ...prev.filter?.price,
          from: debouncedFilterByPriceFrom,
          to: debouncedFilterByPriceTo,
        },
      },
      sort: {
        [sortBy]: sortDirection,
      },
      page: 1,
    }));
    setPagination((prev) => ({
      ...prev,
      pageIndex: 1,
    }));
  }, [
    debouncedFilterByName,
    debouncedFilterByPriceFrom,
    debouncedFilterByPriceTo,
    sortBy,
    sortDirection,
  ]);

  const { classes } = useStyles();

  return (
    <Container
      my="md"
      className={classes.pageRoot}
    >
      <Grid gutter="xl">
        <Grid.Col span="content">
          <Filter
            filterByPriceFrom={filterByPriceFrom}
            filterByPriceTo={filterByPriceTo}
            setPriceFrom={handleFilterByPriceFrom}
            setPriceTo={handleFilterByPriceTo}
          />
        </Grid.Col>
        <Grid.Col span="auto">
          <Stack>
            <TextInput
              size="md"
              value={filterByName}
              onChange={handleFilterByName}
              placeholder="Type to search..."
              radius="md"
              icon={<IconSearch size={16} />}
              rightSection={
                  filterByName ? (
                    <UnstyledButton
                      onClick={() => setFilterByName('')}
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <IconX color="gray" />
                    </UnstyledButton>
                  ) : null
                }
            />
            <Grid>
              <Grid.Col span="auto">
                <Stack align="flex-start">
                  <Container w="max-content" className={classes.responseSummary}>
                    {`${productListResp?.count ?? 0} results`}
                  </Container>
                  <Flex>
                    {filterByName && (
                    <ResetFilerButton
                      content={filterByName}
                      filterSkipHandler={() => {
                        setFilterByName('');
                      }}
                    />
                    )}
                    {(filterByPriceFrom || filterByPriceTo) && (
                    <ResetFilerButton
                      content={`$${filterByPriceFrom ?? 0} - $${filterByPriceTo ?? '∞'}`}
                      filterSkipHandler={() => {
                        handleFilterByPriceFrom('');
                        handleFilterByPriceTo('');
                      }}
                    />
                    )}
                  </Flex>
                </Stack>
              </Grid.Col>
              <Grid.Col span="content">
                <Group spacing={0}>
                  <ActionIcon
                    radius="xl"
                    color="gray"
                    variant="subtle"
                    size={15}
                    style={{ margin: 0 }}
                    onClick={() => {
                      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                    }}
                  >
                    <IconArrowsDownUp size={15} />
                  </ActionIcon>

                  <Menu width={200} shadow="md" zIndex={999}>
                    <Menu.Target>
                      <Button
                        compact
                        variant="subtle"
                        color="gray"
                        radius="xl"
                        rightIcon={(<IconChevronDown size={15} />)}
                        size="sm"
                      >
                        {`Sorted by ${sortBy !== 'createdOn' ? sortBy : 'creation time'}`}
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item onClick={() => { setSortBy('createdOn'); }}>creation time</Menu.Item>
                      <Menu.Item onClick={() => { setSortBy('price'); }}>price</Menu.Item>
                      <Menu.Item onClick={() => { setSortBy('name'); }}>name</Menu.Item>
                    </Menu.Dropdown>
                  </Menu>

                </Group>
              </Grid.Col>
            </Grid>
            <Skeleton
              radius="md"
              visible={isProductListLoading}
              width="auto"
              mih={350}
            >
              <Flex
                gap="md"
                justify="center"
                align="center"
                direction="row"
                wrap="wrap"
              >
                {productListResp?.items.map((product) => (
                  <ProductCard
                    key={product._id}
                    _id={product._id}
                    price={product.price}
                    name={product.name}
                    imageUrl={product.imageUrl}
                    isInCart={cart?.productIds.includes(product._id)}
                    addToCart={() => {
                      addToCart({ productId: product._id });
                    }}
                    removeFromCart={() => {
                      removeFromCart({ productId: product._id });
                    }}
                  />
                ))}
                {!isProductListLoading && !productListResp?.items.length && (
                <Center className={classes.productsNotExistsMsg}>
                  There no products in marketplace yet
                </Center>
                )}
              </Flex>
            </Skeleton>
            <Skeleton
              radius="md"
              visible={isProductListLoading}
              width="auto"
              height={42}
            >
              <Center>{renderPagination()}</Center>
            </Skeleton>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default Marketplace;
