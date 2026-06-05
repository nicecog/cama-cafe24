import React from 'react';
import { styled } from '@mui/material';

import { ReactComponent as DefaultImageIcon } from '../../assets/icons/img_box_light.svg';

interface Props {
  imgSrc: string | null;
}

function ImagePlaceholder({ imgSrc }: Props) {
  return (
    <Container>
      {imgSrc ? <img src={imgSrc} alt="업로드된 이미지" style={{ width: 72, height: 72 }} /> : <DefaultImageIcon />}
    </Container>
  );
}

const Container = styled('div')`
  background-color: #F9F9FA;
  border-radius: 2px;
  border: 1px solid #EFEEF1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
`;

export default React.memo(ImagePlaceholder);

