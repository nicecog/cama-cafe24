import { Box, styled } from '@mui/material';

export const Container = styled(Box)``;

export const Content = styled(Box)``;

export const PaginationArea = styled(Box)`
  display: flex;
  justify-content: flex-end;
  padding: ${(props) => props.theme.spacing(2)};
`;
