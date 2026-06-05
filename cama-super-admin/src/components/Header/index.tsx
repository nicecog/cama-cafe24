import React from 'react';
import { NavLink } from 'react-router-dom';

import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { Box, Hidden, IconButton, Toolbar, Typography } from '@mui/material';

import useAuth from 'hooks/useAuth';
import useDrawer from 'hooks/useDrawer';

import { stageInfo } from '../../services/apis/mainApiClient';
import { APP_NAME_KR } from '../../constants/app';

import * as S from './styled';

function Header() {
  const { isLoggedIn, handleLogout } = useAuth();
  const { isDesktop, isDrawerOpen, handleToggleDrawerOpen } = useDrawer();

  return (
    <S.AppBar $isDesktop={true}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <S.LogoWrap>
          <SupervisorAccountIcon sx={{ width: 40, height: 40 }} />
          <Typography variant="h4">{APP_NAME_KR} ADMIN {stageInfo.name}</Typography>
        </S.LogoWrap>

        <Box display="flex">
          {isLoggedIn ? (
            <IconButton onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          ) : (
            <NavLink to="/login">
              <IconButton>
                <LoginIcon />
              </IconButton>
            </NavLink>
          )}
          {/*<Hidden lgUp>*/}
          {/*  <IconButton onClick={handleToggleDrawerOpen}>{isDrawerOpen ? <MenuOpenIcon /> : <MenuIcon />}</IconButton>*/}
          {/*</Hidden>*/}
        </Box>
      </Toolbar>
    </S.AppBar>
  );
}

export default Header;
