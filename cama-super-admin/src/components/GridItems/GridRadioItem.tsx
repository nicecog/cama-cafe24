import React, { Fragment } from 'react';
import { Grid, Typography } from '@mui/material';

import { ReactComponent as CheckboxOff } from 'assets/icons/ic_checkbox_off.svg';
import { ReactComponent as CheckboxOn } from 'assets/icons/ic_checkbox_on.svg';

interface GridRadioItemProps {
  label: string;
  isSelectedA: boolean;
  isSelectedB: boolean;
  onSelectA: () => void;
  onSelectB: () => void;
}

const GridRadioItem: React.FC<GridRadioItemProps> = ({
  label,
  isSelectedA,
  isSelectedB,
  onSelectA,
  onSelectB,
}) => {
  return (
    <Fragment>
      <Grid item xs={6}>
        <Typography variant="subtitle1" sx={{ paddingTop: 2 }}>{label}</Typography>
      </Grid>
      <Grid item xs={3} onClick={onSelectA} sx={{ paddingTop: 2 }}>
        {isSelectedA ? <CheckboxOn /> : <CheckboxOff />}
      </Grid>
      <Grid item xs={3} onClick={onSelectB} sx={{ paddingTop: 2 }}>
        {isSelectedB ? <CheckboxOn /> : <CheckboxOff />}
      </Grid>
    </Fragment>
  )
}

export default GridRadioItem;
