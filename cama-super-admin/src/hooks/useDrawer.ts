import { useMediaQuery, useTheme } from '@mui/material';
import { useRecoilState } from 'recoil';

import { drawerState } from 'atoms';

function useDrawer() {
  const [isDrawerOpen, setIsDrawerOpen] = useRecoilState(drawerState);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true,
  });

  const handleToggleDrawerOpen = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  return {
    isDesktop,
    isDrawerOpen,
    handleToggleDrawerOpen,
  };
}

export default useDrawer;
