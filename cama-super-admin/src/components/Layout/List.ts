import { Box, Paper, styled } from '@mui/material';

export const CardContainer = styled(Paper)``;

export const CardHeader = styled(Box)`
  display: flex;
  padding: ${(props) => props.theme.spacing(3)};
  gap: ${(props) => props.theme.spacing(2)};
  width: 100%;
  align-items: center;
`;
