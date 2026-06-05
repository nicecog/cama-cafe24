import React from 'react';

import { Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import styled from 'styled-components';

type BasicModalType = 'ALERT' | 'CONFIRM';

interface Props {
  modalType?: BasicModalType;
  open: boolean;
  title: string;
  doneLabel?: string;
  onClose: () => void;
  onPressDone: () => void;
  children: React.ReactNode;
}

function BasicWideModal({ modalType='CONFIRM', open, title, doneLabel='확인', onClose, onPressDone, children }: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiPaper-root': {
          minWidth: '800px',
          maxWidth: '800px',
          borderRadius: '6px',
          margin: 0,
          padding: 2,
        },
      }}
    >
      <DialogActions
        sx={{
          padding: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h4">{title}</Typography>
      </DialogActions>

      <DialogContent sx={{ padding: 1 }}>
        {children}
        <ButtonSection>
          {modalType === 'CONFIRM' && (
            <CancelButton onClick={onClose}>
              취소
            </CancelButton>
          )}
          <Button onClick={onPressDone}>
            {doneLabel}
          </Button>
        </ButtonSection>
      </DialogContent>
    </Dialog>
  );
}

export default BasicWideModal;

const ButtonSection = styled.div`
  display: flex;
  margin-top: 28px;
  justify-content: flex-end;
`;

const Button = styled.button`
  font-size: 16px;
  line-height: 1.2;
  color: #FFF;
  border: none;
  outline: none;
  background: #00AB55;
  padding: 12px 16px;
  cursor: pointer;
  border-radius: 8px;
`;

const CancelButton = styled(Button)`
  margin-right: 20px;
  background: #FFF;
  color: #00AB55;
  border: 1px solid #00AB55;
`
