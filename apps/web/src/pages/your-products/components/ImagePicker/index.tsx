import React, { FC, memo, useRef, useState } from 'react';
import { ActionIcon, Button, Container, Image } from '@mantine/core';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { IconPencil, IconPlus } from '@tabler/icons-react';

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

  const openRef = useRef<() => void>(() => {});

  const { classes, cx } = useStyles();

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
    <Container sx={{ margin: 0, padding: 0 }}>
      <Container className={classes.imageDropzoneContainer}>
        <Container sx={{ padding: 0, position: 'relative' }}>
          <Dropzone
            name="imageUrl"
            accept={['image/png', 'image/jpg', 'image/jpeg']}
            onDrop={handlePhotoUpload}
            loading={isImageDropzoneLoading}
            multiple={false}
            openRef={openRef}
            classNames={{
              root: classes.dropzoneRoot,
            }}
          >
            <label
              className={cx(classes.browseButton, {
                [classes.error]: errorMessage,
              })}
            >
              {imageUrl || defaultImage ? (
                <div
                  className={classes.avatar}
                  style={{
                    backgroundImage: `url(${imageUrl || defaultImage})`,
                  }}
                >
                  <div className={classes.innerAvatar}>
                    <IconPencil />
                  </div>
                </div>
              ) : (
                <div
                  className={classes.avatar}
                  style={{
                    backgroundImage: 'url("../images/default-image.svg")',
                  }}
                >
                  <div className={classes.innerAvatar}>
                    <IconPlus />
                  </div>
                </div>
              )}
            </label>
          </Dropzone>
          {(imageUrl || defaultImage) && (
            <ActionIcon
              className={classes.deleteButton}
              onClick={(e) => {
                e.stopPropagation();
                handlerImageRemove();
              }}
            >
              <Image src="../images/trash-can.svg" width="1.5rem" height="1.5rem" />
            </ActionIcon>
          )}
        </Container>
        <Button variant="outline" onClick={() => openRef.current()}>Upload Photo</Button>
      </Container>
      {!!errorMessage && <p className={classes.errorMessage}>{errorMessage}</p>}
      {!!formErrorMessage && (
        <p className={classes.errorMessage}>{formErrorMessage}</p>
      )}
    </Container>
  );
};

export default memo(ImagePicker);
