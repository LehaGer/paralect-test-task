import { NextPage } from 'next';
import {
  Button,
  Center,
  Flex,
  Loader,
  Modal,
  NumberInput,
  Stack,
  TextInput,
  LoadingOverlay,
  Pagination,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import omit from 'lodash/omit';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { FileWithPath } from '@mantine/dropzone';
import { PaginationState } from '@tanstack/react-table';
import ProductCard from 'components/ProductCard/ProductCard';
import { handleError } from 'utils';
import { productApi, productTypes } from 'resources/product';
import { accountApi } from 'resources/account';
import ImagePicker from './components/ImagePicker';
import { useStyles } from './styles';

const schema = z.object({
  name: z.string().min(1).max(36, 'Name can not contain more then 36 symbols.'),
  price: z.number().min(0, 'Price can not be less then 0'),
  imageUrl: z.string().url('provided image is not a url'),
});

type CreateNewProductParams = z.infer<typeof schema>;

const YourProducts: NextPage = () => {
  const [isModalOpen, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [isCreateProductFormLoading, {
    open: openProductFormLoader,
    close: closeProductFormLoader,
  }] = useDisclosure(false);

  const { data: account } = accountApi.useGet();

  const [imageFile, setImageFile] = useState<FileWithPath>();

  const {
    register,
    handleSubmit,
    setError,
    resetField,
    getValues,
    formState: { errors },
    setValue,
    reset,
  } = useForm<CreateNewProductParams>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    register('imageUrl');
  }, [register]);

  const [params, setParams] = useState<productTypes.ProductsListParams>({});

  const {
    data: productListResp,
    isLoading: isProductListLoading,
  } = productApi.useList<productTypes.ProductsListParams>(params);

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

  useLayoutEffect(() => {
    setParams((prev) => ({
      ...prev,
      perPage: 10,
      filter: {
        ...prev.filter,
        ownerId: account?._id,
        price: {
          ...prev.filter?.price,
        },
      },
      page: 1,
    }));
    setPagination((prev) => ({
      ...prev,
      pageIndex: 1,
    }));
  }, [account]);

  const {
    mutate: uploadImage,
  } = productApi.useUploadImage();

  const {
    mutate: createProduct,
  } = productApi.useCreateProduct<CreateNewProductParams>();

  const { mutate: removeCard } = productApi.useRemove();

  const onSubmit = async (data: CreateNewProductParams) => {
    openProductFormLoader();
    if (!imageFile) {
      setError('imageUrl', { message: 'required' });
      closeProductFormLoader();
      return;
    }
    const body = new FormData();
    body.append('file', imageFile, imageFile.name);

    const imageStoreUrl: string = await new Promise((resolve, reject) => {
      uploadImage(body, {
        onSuccess: (imageUrlFromServerResp) => {
          setValue('imageUrl', imageUrlFromServerResp, { shouldValidate: true });
          resolve(imageUrlFromServerResp);
        },
        onError: (e) => {
          handleError(e, setError);
          reject();
        },
      });
    });

    await new Promise((resolve, reject) => {
      createProduct(
        { ...data, imageUrl: imageStoreUrl },
        {
          onSuccess: async () => {
            reset();
            resolve(undefined);
            closeModal();
          },
          onError: (e) => {
            handleError(e, setError);
            reject();
          },
        },
      );
    });

    closeProductFormLoader();
  };

  const handleSettingImage = (file: FileWithPath | undefined) => {
    setImageFile(file);
    if (file !== undefined) setValue('imageUrl', URL.createObjectURL(file), { shouldValidate: true });
    else resetField('imageUrl', { keepError: false });
  };

  const { classes } = useStyles();

  return (
    <>
      <Flex
        gap="md"
        justify="center"
        align="center"
        direction="row"
        wrap="wrap"
      >
        {isProductListLoading
            && (
            <Center>
              <Loader color="blue" />
            </Center>
            )}
        {productListResp?.items.map((product) => (
          <ProductCard
            _id={product._id}
            isOwn
            price={product.price}
            name={product.name}
            imageUrl={product.imageUrl}
            key={product._id}
            removeCard={() => { removeCard(product._id); }}
          />
        ))}
        {(!productListResp || !productListResp?.items.length)
            && (
            <Center className={classes.notExistsMsg}>
              You have no own products yet
            </Center>
            )}
      </Flex>
      <Center className={classes.paginationSection}>{renderPagination()}</Center>
      <Center className={classes.addNewProductBtn}>
        <Button onClick={openModal}>
          <IconPlus />
          Add new product
        </Button>
      </Center>
      <Modal
        opened={isModalOpen}
        onClose={() => {
          if (Number.isNaN(getValues('price'))) resetField('price');
          return closeModal();
        }}
        title="Add new card"
        centered
      >
        <LoadingOverlay visible={isCreateProductFormLoading} overlayBlur={2} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={20}>
            <ImagePicker
              setImageFormValue={handleSettingImage}
              formErrorMessage={errors.imageUrl?.message}
              defaultImage={getValues('imageUrl')}
            />
            <TextInput
              {...register('name')}
              label="Product Name"
              placeholder="Product Name"
              error={errors.name?.message}
            />
            <NumberInput
              {...omit(register('price', { valueAsNumber: true }), [
                'onChange',
                'max',
                'min',
              ])}
              onChange={async (value) => {
                await register('price', { valueAsNumber: true }).onChange({
                  target: { value },
                });
              }}
              max={Number(register('price', { valueAsNumber: true }).max)}
              min={Number(register('price', { valueAsNumber: true }).min)}
              hideControls
              label="Price (USD)"
              placeholder="Price"
              error={errors.price?.message}
            />
          </Stack>
          <Button
            type="submit"
            fullWidth
            mt={34}
          >
            Create Product
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default YourProducts;
