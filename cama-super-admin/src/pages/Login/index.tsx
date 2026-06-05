import React from 'react';

import {
  CircularProgress,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  DialogContent,
  Button,
} from '@mui/material';

import useController from './hooks';
import * as S from './styled';
import { stageInfo } from '../../services/apis/mainApiClient';
import { APP_NAME_KR } from '../../constants/app';

function Login() {
  const { handleSubmit, onSubmit, register, errors, modalOpen, handleModalClose, errorMsg } =
    useController();

  return (
    <S.Container maxWidth="sm">
      <S.Wrapper>
        <S.FormHeader>
          <Typography variant="h4">{APP_NAME_KR} 관리자 로그인 {stageInfo.name}</Typography>
        </S.FormHeader>
        <S.Form onSubmit={handleSubmit(onSubmit)}>
          <S.Input fullWidth>
            <TextField
              {...register('principal')}
              label="아이디"
              placeholder="아이디 입력"
              error={Boolean(errors.principal)}
              helperText={errors.principal?.message}
            />
          </S.Input>
          <S.Input fullWidth>
            <TextField
              {...register('credentials')}
              label="비밀번호"
              placeholder="비밀번호 입력"
              type="password"
              error={Boolean(errors.credentials)}
              helperText={errors.credentials?.message}
            />
          </S.Input>
          {/*<S.SignInButton type="submit" variant="contained" fullWidth size="large" disabled={isLoading}>*/}
          {/*  {isLoading ? <CircularProgress size={24} /> : '로그인'}*/}
          {/*</S.SignInButton>*/}
          <S.SignInButton type="submit" variant="contained" fullWidth size="large">
            로그인
          </S.SignInButton>
        </S.Form>
      </S.Wrapper>

      <Dialog open={modalOpen} onClose={handleModalClose}>
        <DialogTitle>로그인 실패</DialogTitle>

        <DialogContent>
          <DialogContentText>{errorMsg}</DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button size="small" onClick={handleModalClose}>
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </S.Container>
  );
}

export default Login;
