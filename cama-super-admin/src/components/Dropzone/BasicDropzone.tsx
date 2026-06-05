import React, { useState, Fragment, PropsWithChildren } from 'react';
import styled from 'styled-components';
import { useDropzone, Accept } from 'react-dropzone';
import { pipe, map, tap, head, take, each, toAsync, toArray } from '@fxts/core';

import { ImageType } from '../../constants/enums';
import commonApi from '../../services/apis/common';

interface BasicDropzoneProps {
  setPreviews: (prevs: string[]) => void;
  count?: number;
  multiple?: boolean;
  imageType: ImageType,
}

function BasicDropzone({
  setPreviews,
  count = 1,
  multiple = false,
  imageType,
  children,
}: PropsWithChildren<BasicDropzoneProps>) {
  const [uploading, setUploading] = useState(false)

  const getAccept = (imageType: ImageType): Accept | undefined => {
    switch (imageType) {
      case 'IMAGE':
        return { ['image/*']: ['.jpeg', '.png', '.jpg'] };
      case 'VIDEO':
        return { ['video/*']: ['.mp4'] };
      default:
        return undefined;
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: getAccept(imageType),
    multiple: multiple,
    onDrop: (acceptedFiles) => {
      setUploading(true);

      pipe(
        new FormData(),
        tap(formData => pipe(acceptedFiles,
          take(count),
          each(file => formData.append('img', file, file.name)),
        )),
        (fd) => toAsync([fd]),
        map(commonApi.uploadImage),
        toArray,
        head,
        (prevs) => {
          prevs && setPreviews(prevs);
        },
        () => {
          setUploading(false)
        },
      );
    }
  })

  return (
    <Fragment>
      <DropZoneBox {...getRootProps()}>
        <input {...getInputProps()} />
        {children}
      </DropZoneBox>
    </Fragment>
  );
};

export default BasicDropzone

const DropZoneBox = styled.div`
  outline: none;
`
