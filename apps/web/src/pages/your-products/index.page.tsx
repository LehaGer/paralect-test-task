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
  Pagination, Container,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import omit from 'lodash/omit';
import React, { useEffect, useState } from 'react';
import { FileWithPath } from '@mantine/dropzone';
import ProductCard from 'components/ProductCard/ProductCard';
import { handleError } from 'utils';
import { productApi, productTypes } from 'resources/product';
import ImagePicker from './components/ImagePicker';
import { useStyles } from './styles';
import AddNewCardButton from './components/AddNewCardButton';

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

  const { mutate: uploadImage } = productApi.useUploadImage();

  const { mutate: createProduct } = productApi.useCreateProduct<CreateNewProductParams>();

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
        {isProductListLoading && (
          <Center>
            <Loader color="blue" />
          </Center>
        )}
        <AddNewCardButton onClick={openModal} />
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
        {!isProductListLoading
            && !productListResp?.items.length
            && (
            <Center className={classes.notExistsMsg}>
              You have no own products yet
            </Center>
            )}
      </Flex>
      <Center className={classes.paginationSection}>{renderPagination()}</Center>
      <Modal
        opened={isModalOpen}
        onClose={() => {
          if (Number.isNaN(getValues('price'))) resetField('price');
          return closeModal();
        }}
        title="Create new product"
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
              label="Title of the product"
              placeholder="Enter title of the product..."
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
              label="Price"
              placeholder="Enter price of the product"
              error={errors.price?.message}
            />
          </Stack>
          <Button
            type="submit"
            fullWidth
            mt={34}
          >
            Upload Product
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default YourProducts;
