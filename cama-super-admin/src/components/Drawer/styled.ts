import { Box, styled } from '@mui/material';

import { DRAWER_WIDTH } from 'constants/app';

export const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: ${DRAWER_WIDTH}px;
  background-color: ${(props) => props.theme.palette.common.white};
`;

export const Top = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing(4)};
  padding: ${(props) => props.theme.spacing(3)};
`;

export const Profile = styled(Box)`
  padding: ${(props) => props.theme.spacing(2)};
  border-radius: 12px;
  background-color: ${(props) => props.theme.palette.grey[200]};
  display: flex;
  align-items: center;
`;

export const ProfileInfo = styled(Box)`
  display: flex;
  flex-direction: column;
  margin-left: ${(props) => props.theme.spacing(2)};
`;

export const Contents = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: ${(props) => `0 ${props.theme.spacing(2)}`};
`;
