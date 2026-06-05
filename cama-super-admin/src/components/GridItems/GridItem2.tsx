import React, { Fragment } from 'react';
import { Grid, Typography } from '@mui/material';

interface GridItemProps {
  label: string;
  value: string;
  size?: number;
  hasBorder?: boolean;
}

const GridItem2: React.FC<GridItemProps> = ({
  label,
  value,
  size= 8,
  hasBorder = true,
}) => {
  return (
    <Fragment>
      <Grid
        item xs={12 - size}
        style={hasBorder ? {
          borderBottom: '1px solid #BDBDBD',
          paddingBottom: 6,
        } : {
          paddingBottom: 6,
        }}
      >
        <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
          {label}
        </Typography>
      </Grid>
      <Grid
        item xs={size}
        style={hasBorder ? {
          borderBottom: '1px solid #BDBDBD',
          paddingBottom: 6,
        } : {
          paddingBottom: 6,
        }}
      >
        <Typography variant="body1" style={{ color: '#637381' }}>
          {value}
        </Typography>
      </Grid>
    </Fragment>
  )
}

export default GridItem2;
