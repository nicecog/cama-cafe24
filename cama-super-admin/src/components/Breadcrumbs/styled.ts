import { Breadcrumbs as MuiBreadcrumbs, Typography, styled } from '@mui/material';

export const Breadcrumbs = styled(MuiBreadcrumbs)`
  margin-bottom: ${(props) => props.theme.spacing(1)};
`;

export const Text = styled(Typography)`
  color: ${(props) => props.theme.palette.grey[500]};

  a {
    color: ${(props) => props.theme.palette.grey[800]};
  }
`;
