import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { AppBar as MuiAppBar, Box, styled } from '@mui/material';

import { DRAWER_WIDTH } from 'constants/app';

export const AppBar = styled(MuiAppBar)<{ $isDesktop: boolean }>`
  box-shadow: none;
  z-index: ${(props) => props.theme.zIndex.drawer};
  width: ${(props) => (props.$isDesktop ? `calc(100% - ${DRAWER_WIDTH}px)` : 'calc(100%)')};
  transition: width 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  border-bottom: ${(props) => `1px solid ${props.theme.palette.grey[500]}3d`};
  background-color: #fff;
  padding-top: 8px;
`;

export const AdminIcon = styled(SupervisorAccountIcon)`
  color: ${(props) => props.theme.palette.common.white};
  height: 32px;
  width: 32px;
  z-index: ${(props) => props.theme.zIndex.drawer + 1};
`;

export const LogoWrap = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;

  gap: ${(props) => props.theme.spacing(1)};
  color: ${(props) => props.theme.palette.primary.dark};

  svg {
    fill: ${(props) => props.theme.palette.primary.dark};
  }
`;
