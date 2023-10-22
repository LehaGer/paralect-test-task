import { FC, memo, useState } from 'react';
import { Button, Group, Image, Text } from '@mantine/core';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';

import { useStyles } from './styles';

interface IImagePickerProps {
  setImageFormValue: (imageUrl: FileWithPath | undefined) => void;
  formErrorMessage: string | undefined;
  defaultImage: string | undefined;
}

const ImagePicker: FC<IImagePickerProps> = ({
  setImageFormValue,
  formErrorMessage,
  defaultImage,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>();
  const [isImageDropzoneLoading, setIsImageDropzoneLoading] = useState<boolean>(false);

  const { classes } = useStyles();

  const isFileSizeCorrect = (file: FileWithPath) => {
    const oneMBinBytes = 1048576;
    if ((file.size / oneMBinBytes) > 2) {
      setErrorMessage('Sorry, you cannot upload a file larger than 2 MB.');
      return false;
    }
    return true;
  };

  const isFileFormatCorrect = (file: FileWithPath) => {
    if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) return true;
    setErrorMessage('Sorry, you can only upload JPG, JPEG or PNG photos.');
    return false;
  };

  const handlePhotoUpload = async ([imageFile]: FileWithPath[]) => {
    setErrorMessage(null);
    setIsImageDropzoneLoading(true);

    if (isFileFormatCorrect(imageFile) && isFileSizeCorrect(imageFile) && imageFile) {
      setImageUrl(URL.createObjectURL(imageFile));
      setImageFormValue(imageFile);
    }

    setIsImageDropzoneLoading(false);
  };

  const handlerImageRemove = () => {
    setErrorMessage(null);
    setImageUrl(undefined);
    setImageFormValue(undefined);
  };

  return (
    <>
      <Dropzone
        name="imageUrl"
        accept={['image/png', 'image/jpg', 'image/jpeg']}
        onDrop={handlePhotoUpload}
        loading={isImageDropzoneLoading}
        multiple={false}
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
            {imageUrl || defaultImage ? (
              <Image
                src={imageUrl || defaultImage}
                onLoad={() => {
                  if (imageUrl) URL.revokeObjectURL(imageUrl);
                }}
                height="10em"
              />
            ) : (
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
              Image should not exceed 2MB
            </Text>
          </div>
        </Group>
      </Dropzone>
      {(imageUrl || defaultImage) && (
        <Button
          variant="subtle"
          onClick={handlerImageRemove}
          size="sm"
        >
          Remove
        </Button>
      )}
      {!!errorMessage && <p className={classes.errorMessage}>{errorMessage}</p>}
      {!!formErrorMessage && (
        <p className={classes.errorMessage}>{formErrorMessage}</p>
      )}
    </>
  );
};

export default memo(ImagePicker);
