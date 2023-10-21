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
  Space,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import omit from 'lodash/omit';
import { useEffect, useState } from 'react';
import { FileWithPath } from '@mantine/dropzone';
import ProductCard from '../../components/ProductCard/ProductCard';
import { handleError } from '../../utils';
import { productApi } from '../../resources/product';
import { accountApi } from '../../resources/account';
import ImagePicker from './components/ImagePicker';

const schema = z.object({
  name: z.string().min(1).max(36, 'Name can not contain more then 36 symbols.'),
  price: z.number().min(0, 'Price can not be less then 0'),
  imageUrl: z.string().url('provided image is not a url'),
});

type CreateNewProductParams = z.infer<typeof schema>;

interface ProductsListParams {
  page?: number;
  perPage?: number;
  sort?: {
    createdOn?: 'asc' | 'desc';
    price?: 'asc' | 'desc';
    name?: 'asc' | 'desc';
  };
  filter?: {
    id?: string;
    name?: string;
    price?: {
      from: number;
      to: number;
    };
    ownerId?: string;
  };
}

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

  const {
    data: productList,
    isLoading: isProductListLoading,
  } = productApi.useList<ProductsListParams>({ filter: { ownerId: account?._id } });

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

  return (
    <>
      <Center
        style={{
          margin: '1em',
          fontSize: '2em',
          color: 'gray',
          fontWeight: 'bold',
        }}
      >
        Your Products
      </Center>
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
        {productList?.items.map((product) => (
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
        {(!productList || !productList?.items.length)
            && (
            <Center style={{
              margin: '1em',
              fontSize: '1.5em',
              color: '#b9b9b9',
              fontWeight: 'bold',
            }}
            >
              You have no own products yet
            </Center>
            )}
      </Flex>
      <Center style={{ marginTop: '2em' }}>
        <Button onClick={openModal}>
          <IconPlus />
          Add new product
        </Button>
      </Center>
      <Space h="xl" />
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
