import { NextPage } from 'next';
import {
  Button,
  Center,
  Flex, Loader,
  Modal,
  NumberInput,
  Stack,
  TextInput,
  Image, Group, Text,
} from '@mantine/core';
import { IconPhoto, IconPlus, IconUpload, IconX } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import omit from 'lodash/omit';
import { useState } from 'react';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import ProductCard from '../../components/ProductCard/ProductCard';
import { handleError } from '../../utils';
import { productApi } from '../../resources/product';
import { accountApi } from '../../resources/account';
import blobToBase64 from '../../utils/blob-to-base64.util';

const schema = z.object({
  name: z.string().min(1),
  imageUrl: z.string(),
  price: z.number().min(0),
  ownerEmail: z.string().email(),
});

type CreateNeProductParams = z.infer<typeof schema>;

interface ProductsListParams {
  page?: number;
  perPage?: number;
  sort?: {
    createdOn?: 'asc' | 'desc';
    price?: 'asc' | 'desc';
    name?: 'asc' | 'desc';
  };
  filter?: {
    name?: string;
    price?: {
      from: number;
      to: number;
    };
    ownerEmail?: string;
  };
}

const YourProducts: NextPage = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const { data: account } = accountApi.useGet();

  const [params] = useState<ProductsListParams>({
    filter: {
      ownerEmail: account?.email,
    },
  });

  const {
    register,
    handleSubmit,
    setError,
    // watch,
    resetField,
    getValues,
    formState: { errors },
    setValue,
    reset,
  } = useForm<CreateNeProductParams>({
    resolver: zodResolver(schema),
    defaultValues: {
      ownerEmail: account?.email,
    },
  });

  const [image, setImage] = useState<FileWithPath>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [isImageDropzoneLoading, setIsImageDropzoneLoading] = useState<boolean>(false);

  if (image) {
    blobToBase64(image).then((value) => {
      setImageUrl(value as string);
      setValue('imageUrl', value as string);
      setIsImageDropzoneLoading(false);
    });
  }
  const preview = imageUrl && <Image src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />;

  const {
    data: productList,
    isLoading: isProductListLoading,
    refetch: updateProductList,
  } = productApi.useList(params);

  const {
    mutate: createProduct,
    isLoading: isCreateNewProductLoading,
  } = productApi.useCreateProduct<CreateNeProductParams>();

  const onSubmit = (data: CreateNeProductParams) => createProduct(data, {
    onSuccess: async () => {
      await updateProductList();
      reset();
      setImage(undefined);
      setImageUrl(undefined);
      close();
    },
    onError: (e) => handleError(e, setError),
  });

  return (
    <div>
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
            isOwn
            price={product.price}
            name={product.name}
            imageUrl={product.imageUrl}
            key={product._id}
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
        <Button onClick={open}>
          <IconPlus />
          Add new product
        </Button>
      </Center>
      <Modal
        opened={opened}
        onClose={() => {
          if (Number.isNaN(getValues('price'))) resetField('price');
          return close();
        }}
        title="Add new card"
        centered
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={20}>
            <div>
              <Dropzone
                onDrop={(images) => {
                  setImage(images[0]);
                  setIsImageDropzoneLoading(true);
                }}
                loading={isImageDropzoneLoading}
                multiple={false}
                maxSize={3 * 1024 ** 2}
                accept={IMAGE_MIME_TYPE}
                style={{ marginBottom: '5px' }}
              >
                <Group>
                  <Dropzone.Accept>
                    <IconUpload
                      style={{
                        width: '5rem',
                        height: '5rem',
                        color: '#4664b2',
                        margin: 'auto',
                      }}
                      stroke={1.5}
                    />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX
                      style={{
                        width: '5rem',
                        height: '5rem',
                        color: '#b24646',
                        margin: 'auto',
                      }}
                      stroke={1.5}
                    />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    {preview ?? (
                    <IconPhoto
                      style={{
                        width: '5rem',
                        height: '5rem',
                        color: '#858484',
                        margin: 'auto',
                      }}
                      stroke={1.5}
                    />
                    )}
                  </Dropzone.Idle>

                  <div>
                    <Text size="xl" inline align="center">
                      Drag images here or click to select files
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7} align="center">
                      Attach as many files as you like, each file should not
                      exceed 5mb
                    </Text>
                  </div>
                </Group>
              </Dropzone>
              <div style={{ color: 'red', fontSize: '1em' }}>
                {errors.imageUrl?.message}
              </div>
            </div>
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
              onChange={(value) => {
                register('price', { valueAsNumber: true }).onChange({
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
            loading={isCreateNewProductLoading}
            fullWidth
            mt={34}
          >
            Create Product
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default YourProducts;
