import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress, Container, styled } from '@mui/material';

import Drawer from 'components/Drawer';
import Header from 'components/Header';

import useAuth from 'hooks/useAuth';
import useDrawer from 'hooks/useDrawer';

import { DRAWER_WIDTH } from 'constants/app';

const MainContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$isDesktop',
})<{ $isDesktop: boolean }>`
  min-height: calc(100vh - 72px);
  padding-left: ${(props) => (props.$isDesktop ? `${DRAWER_WIDTH}px` : '0')};
  padding-top: 72px;
  margin-top: ${(props) => props.theme.spacing(3)};
`;

const Main = styled(Box)`
  width: 100%;
  min-height: calc(100vh - 120px);
  padding: ${(props) => props.theme.spacing(3)};
`;

function Home() {
  const { initAuth, isLoggedIn } = useAuth();
  const { handleToggleDrawerOpen } = useDrawer();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    if (isLoggedIn) {
      setAuthReady(true);
      initAuth();
      return () => {
        mounted = false;
      };
    }

    initAuth().finally(() => {
      if (mounted) {
        setAuthReady(true);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (!authReady) {
    return (
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box sx={{ width: '100vw', minHeight: '100vh' }}>
      <Header />
      <Drawer onClose={handleToggleDrawerOpen} open={true} />

      <MainContainer $isDesktop={true}>
        <Main>
          <Container>
            <Outlet />
          </Container>
        </Main>
      </MainContainer>
    </Box>
  );
}

export default Home;
