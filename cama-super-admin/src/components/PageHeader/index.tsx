import React from 'react';
import { useLocation } from 'react-router-dom';

import { Box, Typography } from '@mui/material';

import Breadcrumbs from 'components/Breadcrumbs';
import { getBreadcrumbData, getTitleData } from 'utils/route';

interface Props {
  title?: string;
  mb?: number;
}

function PageHeader({ title, mb=3 }: Props) {
  const { pathname } = useLocation();
  const titleData = title || getTitleData(pathname) || '';
  const breadcrumbs = getBreadcrumbData(pathname);

  return (
    <Box mb={mb}>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Typography variant="h3">{titleData}</Typography>
    </Box>
  );
}

export default PageHeader;
