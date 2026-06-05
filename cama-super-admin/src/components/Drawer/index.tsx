import React from 'react';

import { useMediaQuery, useTheme, Drawer as MuiDrawer, Typography, Avatar } from '@mui/material';

import Navigation from 'components/Navigation';
import useAuth from 'hooks/useAuth';

import * as S from './styled';

interface Props {
  open: boolean;
  onClose: () => void;
}

function Drawer({ open, onClose }: Props) {
  const { authState } = useAuth();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true,
  });

  return (
    <MuiDrawer open={open} onClose={onClose} anchor="left" variant={'persistent'}>
      <S.Wrapper>
        <S.Top>
          <S.Profile>
            {/*<Avatar src={authInfo?.account.profileImage ?? undefined} />*/}
            <S.ProfileInfo>
              <Typography variant="subtitle1">관리자</Typography>
              {authState && <Typography>Admin</Typography>}
            </S.ProfileInfo>
          </S.Profile>
        </S.Top>

        <S.Contents>
          <Navigation />
        </S.Contents>
      </S.Wrapper>
    </MuiDrawer>
  );
}

export default Drawer;
