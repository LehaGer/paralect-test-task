import { NextPage } from 'next';
import {
  ActionIcon,
  Button,
  Center, Container,
  Flex, Grid,
  Group, Menu,
  NumberInput,
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
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import isNumber from 'lodash/isNumber';
import { PaginationState } from '@tanstack/react-table';
import ProductCard from '../../components/ProductCard/ProductCard';
import { productApi } from '../../resources/product';
import { cartApi } from '../../resources/cart';
import { ProductsListParams } from '../../types';
import { AddProductParams, RemoveProductParams } from '../../resources/cart/cart.types';
import ResetFilerButton from './components/ResetFlterButton';

const Marketplace: NextPage = () => {
  const { data: cart } = cartApi.useGet();

  const [params, setParams] = useState<ProductsListParams>({});

  const [sortBy, setSortBy] = useState<'createdOn' | 'price' | 'name'>('createdOn');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const { mutate: addToCart } = cartApi.useAddProduct<AddProductParams>();
  const { mutate: removeFromCart } = cartApi.useRemoveProduct<RemoveProductParams>();

  const {
    data: productListResp,
    isLoading: isProductListLoading,
  } = productApi.useList<ProductsListParams>(params);

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

    if (totalPages === 1) return;

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

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      // console.log('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      // console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
    }
  }, []);

  return (
    <Container
      my="md"
      sx={() => ({
        width: '100%',
        maxWidth: '100%',
      })}
    >
      <Grid gutter="xl">
        <Grid.Col span="content">
          <Skeleton
            radius="md"
            visible={isProductListLoading}
            width="auto"
          >
            <Stack
              sx={(theme) => ({
                backgroundColor: theme.white,
                borderRadius: '1em',
                padding: '2em',
                border: `1px solid ${theme.colors.gray[2]}`,
              })}
            >
              <Group>
                <Container sx={(theme) => ({
                  fontSize: '1.2em',
                  fontWeight: 'bold',
                  color: theme.colors.gray[7],
                  textAlign: 'left',
                  margin: 0,
                  padding: 0,
                })}
                >
                  Filters
                </Container>
                <Button
                  variant="subtle"
                  color="gray"
                  radius="xl"
                  size="xs"
                  compact
                  sx={{
                    width: '7em',
                    marginLeft: 'auto',
                  }}
                  type="reset"
                  rightIcon={<IconX size={15} spacing={0} style={{ margin: 0 }} />}
                  onClick={() => {
                    handleFilterByPriceFrom('');
                    handleFilterByPriceTo('');
                  }}
                >
                  reset all
                </Button>
              </Group>
              <Stack spacing=".5em">
                <Container sx={(theme) => ({
                  fontSize: '1em',
                  fontWeight: 'bold',
                  color: theme.colors.gray[7],
                  textAlign: 'left',
                  margin: 0,
                  padding: 0,
                })}
                >
                  Price
                </Container>
                <Group grow>
                  <NumberInput
                    value={filterByPriceFrom ?? ''}
                    onChange={handleFilterByPriceFrom}
                    icon={<Container>From</Container>}
                    iconWidth={60}
                    sx={{ /* width: '150px', paddingLeft: '10em' */}}
                    min={0}
                    max={filterByPriceTo ?? Infinity}
                  />
                  <NumberInput
                    value={filterByPriceTo ?? ''}
                    onChange={handleFilterByPriceTo}
                    icon={<Container>To</Container>}
                    iconWidth={35}
                    sx={{ width: '100px' }}
                    min={filterByPriceFrom ?? 0}
                  />
                </Group>
              </Stack>
            </Stack>
          </Skeleton>
        </Grid.Col>
        <Grid.Col span="auto">
          <Stack>
            <Skeleton
              radius="md"
              visible={isProductListLoading}
              width="auto"
              height={42}
            >
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
            </Skeleton>
            <Grid>
              <Grid.Col span="auto">
                <Stack align="flex-start">
                  <Container w="max-content" sx={{ margin: 0, paddingLeft: 5, fontWeight: 'bold' }}>
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
                <Center
                  style={{
                    margin: '1em',
                    fontSize: '1.5em',
                    color: '#b9b9b9',
                    fontWeight: 'bold',
                  }}
                >
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
