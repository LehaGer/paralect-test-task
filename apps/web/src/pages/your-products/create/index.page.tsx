import { NextPage } from 'next';
import {
  Button,
  NumberInput,
  TextInput,
  LoadingOverlay,
  Container,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import React, { useEffect, useState } from 'react';
import { FileWithPath } from '@mantine/dropzone';
import { handleError } from 'utils';
import { productApi } from 'resources/product';
import router from 'next/router';
import ImagePicker from '../components/ImagePicker';
import { useStyles } from './styles';
import { RoutePath } from '../../../routes';

const schema = z.object({
  name: z.string().min(1).max(36, 'Name can not contain more then 36 symbols.'),
  price: z.number().min(0, 'Price can not be less then 0'),
  imageUrl: z.string().url('provided image is not a url'),
});

type CreateNewProductParams = z.infer<typeof schema>;

const Create: NextPage = () => {
  const [isCreateProductFormLoading, {
    open: openProductFormLoader,
    close: closeProductFormLoader,
  }] = useDisclosure(false);

  const [imageFile, setImageFile] = useState<FileWithPath>();

  const {
    control,
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

  const { mutate: uploadImage } = productApi.useUploadImage();

  const { mutate: createProduct } = productApi.useCreateProduct<CreateNewProductParams>();

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
            router.push(RoutePath.YourProducts, undefined, { shallow: true });
          },
          onError: (e) => {
            closeProductFormLoader();
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
        Create new product
      </Container>
      <LoadingOverlay visible={isCreateProductFormLoading} overlayBlur={2} />
      <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
        <Container className={classes.root}>
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
            className={classes.input}
          />
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <NumberInput
                {...field}
                hideControls
                label="Price"
                placeholder="Enter price of the product"
                error={errors.price?.message}
                className={classes.input}
              />
            )}
          />
        </Container>
        <Button
          type="submit"
          className={classes.button}
        >
          Upload Product
        </Button>
      </form>
    </>
  );
};

export default Create;
