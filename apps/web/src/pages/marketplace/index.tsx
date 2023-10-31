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
import {
  IconArrowsDownUp,
  IconX,
  IconChevronDown,
  IconArrowsUpDown,
} from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import React, {
  ChangeEvent,
  useCallback,
  useLayoutEffect,
  useState,
} from 'react';
import isNumber from 'lodash/isNumber';
import ProductCard from 'components/ProductCard/ProductCard';
import { productApi, productTypes } from 'resources/product';
import { cartApi, cartTypes } from 'resources/cart';
import { SearchImage } from 'public/images';
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

  const [pageIndex, setPageIndex] = useState<number>(1);

  const onPageChangeHandler = (currentPage: any) => {
    setPageIndex(currentPage);
    setParams((prev) => ({
      ...prev,
      page: currentPage,
    }));
  };

  const renderPagination = () => {
    const totalPages = productListResp?.totalPages || 1;

    if (totalPages <= 1) return;

    return (
      <Pagination
        total={totalPages}
        value={pageIndex}
        onChange={onPageChangeHandler}
        color="black"
      />
    );
  };

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
    setPageIndex(1);
  }, [
    debouncedFilterByName,
    debouncedFilterByPriceFrom,
    debouncedFilterByPriceTo,
    sortBy,
    sortDirection,
  ]);

  const { classes } = useStyles();

  return (
    <Container my="md" className={classes.pageRoot}>
      <Grid sx={{
        gap: '1.75rem',
        '& > *': {
          padding: 0,
        },
      }}
      >
        <Grid.Col span="content">
          <Filter
            filterByPriceFrom={filterByPriceFrom}
            filterByPriceTo={filterByPriceTo}
            setPriceFrom={handleFilterByPriceFrom}
            setPriceTo={handleFilterByPriceTo}
          />
        </Grid.Col>
        <Grid.Col span="auto">
          <Stack className={classes.mainInfoWrapper}>
            <TextInput
              size="md"
              value={filterByName}
              onChange={handleFilterByName}
              placeholder="Type to search..."
              radius="md"
              icon={<SearchImage />}
              className={classes.searchInput}
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
            <Stack className={classes.searchParamsSection}>
              <Grid>
                <Grid.Col span="auto">
                  <Stack align="flex-start">
                    <Container
                      w="max-content"
                      className={classes.responseSummary}
                    >
                      {`${productListResp?.count ?? 0} results`}
                    </Container>
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
                        setSortDirection(
                          sortDirection === 'asc' ? 'desc' : 'asc',
                        );
                      }}
                    >
                      {sortDirection === 'asc' ? (
                        <IconArrowsUpDown size={15} />
                      ) : (
                        <IconArrowsDownUp size={15} />
                      )}
                    </ActionIcon>

                    <Menu width={200} shadow="md">
                      <Menu.Target>
                        <Button
                          compact
                          variant="subtle"
                          color="gray"
                          radius="xl"
                          rightIcon={<IconChevronDown size={15} />}
                          size="sm"
                          className={classes.sortBySection}
                        >
                          {`Sorted by ${
                            sortBy !== 'createdOn' ? sortBy : 'creation time'
                          }`}
                        </Button>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          onClick={() => {
                            setSortBy('createdOn');
                          }}
                        >
                          creation time
                        </Menu.Item>
                        <Menu.Item
                          onClick={() => {
                            setSortBy('price');
                          }}
                        >
                          price
                        </Menu.Item>
                        <Menu.Item
                          onClick={() => {
                            setSortBy('name');
                          }}
                        >
                          name
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </Grid.Col>
              </Grid>
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
                    content={`$${filterByPriceFrom ?? 0} - $${
                      filterByPriceTo ?? '∞'
                    }`}
                    filterSkipHandler={() => {
                      handleFilterByPriceFrom('');
                      handleFilterByPriceTo('');
                    }}
                  />
                )}
              </Flex>
            </Stack>
            <Flex
              gap="md"
              justify="center"
              align="center"
              direction="row"
              wrap="wrap"
            >
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
                  key={product._id}
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
          </Stack>
        </Grid.Col>
      </Grid>
      <Center sx={{ marginTop: '2rem' }}>{renderPagination()}</Center>
    </Container>
  );
};

export default Marketplace;
