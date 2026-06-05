import React from 'react';

import { Button, DialogContent } from '@mui/material';

import * as S from './styled';

interface Props {
  open: boolean;
  onClose: () => void;
  onAction: () => void;
  content: string;
}

function Alert({ open, content, onAction, onClose }: Props) {
  const handleAction = () => {
    onAction();
    onClose();
  };

  return (
    <S.Container
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <S.Title id="alert-dialog-title">Alert</S.Title>

      <DialogContent id="alert-dialog-description">
        <S.ContentText>{content}</S.ContentText>
      </DialogContent>

      <S.Actions>
        <Button size="small" onClick={onClose}>
          취소
        </Button>
        <Button color="error" size="small" onClick={handleAction}>
          삭제
        </Button>
      </S.Actions>
    </S.Container>
  );
}

export default Alert;
