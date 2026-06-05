import { ChangeEvent, useRef, useState } from 'react';
import { encodeFileToBase64 } from '../utils/imageReader';

import commonApi from '../services/apis/common';

const useImageUpload = () => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClickUpload = () => {
    inputRef.current?.click();
  };

  const handleUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = e;
    if (files) {
      encodeFileToBase64(files[0])
        .then((res) => commonApi.uploadBase64Image({ base64: res as string }))
        .then(res => {
          setImgSrc(res[0]);
        });
    }
  };

  const onDownloadImgSrc = () => {
    if(imgSrc === null) return

    const link = document.createElement('a')
    link.href = imgSrc
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return {
    imgSrc,
    setImgSrc,
    inputRef,
    handleClickUpload,
    handleUploadChange,
    onDownloadImgSrc,
  };
};

export default useImageUpload;
