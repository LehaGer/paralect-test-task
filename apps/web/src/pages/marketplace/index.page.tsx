import { NextPage } from 'next';
import {
  Center,
  Flex,
  Group,
  Loader,
  NumberInput,
  Pagination,
  Skeleton,
  Space,
  Stack,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import {
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

const Marketplace: NextPage = () => {
  const { data: cart, refetch: refetchCart } = cartApi.useGet();

  const [params, setParams] = useState<ProductsListParams>({});

  const { mutate: addToCart } = cartApi.useAddProduct<AddProductParams>();
  const { mutate: removeFromCart } = cartApi.useRemoveProduct<RemoveProductParams>();

  const {
    data: productListResp,
    isLoading: isProductListLoading,
  } = productApi.useList<ProductsListParams>(params);

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: 10,
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
      filter: {
        ...prev.filter,
        name: debouncedFilterByName,
        price: {
          ...prev.filter?.price,
          from: debouncedFilterByPriceFrom,
          to: debouncedFilterByPriceTo,
        },
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
    <Stack spacing="lg">
      <Center
        style={{
          margin: '1em',
          fontSize: '2em',
          color: 'gray',
          fontWeight: 'bold',
        }}
      >
        Marketplace
      </Center>
      <Group noWrap position="center" spacing="xs">
        <Skeleton
          height={42}
          radius="sm"
          visible={isProductListLoading}
          width="auto"
        >
          <TextInput
            size="md"
            value={filterByName}
            onChange={handleFilterByName}
            placeholder="Search by name"
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
            sx={{ width: '350px' }}
          />
        </Skeleton>
        <Skeleton
          height={42}
          radius="sm"
          visible={isProductListLoading}
          width="auto"
          sx={{ overflow: !isProductListLoading ? 'initial' : 'overflow' }}
        >
          <NumberInput
            size="md"
            value={filterByPriceFrom}
            onChange={handleFilterByPriceFrom}
            placeholder="from price"
            icon={<IconSearch size={16} />}
            sx={{ width: '150px' }}
            min={0}
          />
        </Skeleton>
        <Skeleton
          height={42}
          radius="sm"
          visible={isProductListLoading}
          width="auto"
          sx={{ overflow: !isProductListLoading ? 'initial' : 'overflow' }}
        >
          <NumberInput
            size="md"
            value={filterByPriceTo}
            onChange={handleFilterByPriceTo}
            placeholder="to price"
            icon={<IconSearch size={16} />}
            sx={{ width: '150px' }}
            min={0}
          />
        </Skeleton>
      </Group>
      <Flex
        gap="md"
        justify="center"
        align="center"
        direction="row"
        wrap="wrap"
      >
        {isProductListLoading && (
          <Center>
            <Loader color="blue" />
          </Center>
        )}
        {productListResp?.items.map((product) => (
          <ProductCard
            key={product._id}
            _id={product._id}
            price={product.price}
            name={product.name}
            imageUrl={product.imageUrl}
            isInCart={cart?.productIds.includes(product._id)}
            addToCart={() => {
              addToCart(
                { productId: product._id },
                {
                  onSuccess: async () => {
                    await refetchCart();
                  },
                },
              );
            }}
            removeFromCart={() => {
              removeFromCart(
                { productId: product._id },
                {
                  onSuccess: async () => {
                    await refetchCart();
                  },
                },
              );
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
      <Center>{renderPagination()}</Center>
      <Space h="xl" />
    </Stack>
  );
};

export default Marketplace;
