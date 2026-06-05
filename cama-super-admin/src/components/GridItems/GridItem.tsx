import React, { Fragment } from 'react';
import { Grid, Typography } from '@mui/material';

interface GridItemProps {
  label: string;
  value: string;
  size?: number;
}

const GridItem: React.FC<GridItemProps> = ({ label, value, size= 8 }) => {
  return (
    <Fragment>
      <Grid item xs={12 - size}>
        <Typography variant="subtitle1">{label}</Typography>
      </Grid>
      <Grid item xs={size}>
        <Typography variant="subtitle1">{value}</Typography>
      </Grid>
    </Fragment>
  )
}

export default GridItem;
