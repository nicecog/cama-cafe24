import React from 'react';
import { Grid, Typography, styled } from '@mui/material';

import Checkbox from './index';

interface CheckboxItemProps {
  label: string;
  isSelected: boolean;
  onToggleSelect: () => void;
}

const CheckboxItem: React.FC<CheckboxItemProps> = ({
  label,
  isSelected,
  onToggleSelect,
}) => {
  return (
    <CheckboxItemWrap onClick={onToggleSelect}>
      <Checkbox isSelected={isSelected} onToggleSelected={() => {}} />
      <Grid item xs={12}>
        <Typography variant="subtitle1">{label}</Typography>
      </Grid>
    </CheckboxItemWrap>
  )
}

export default CheckboxItem;

const CheckboxItemWrap = styled('div')`
  display: flex;
  align-items: center;
  gap: 8px;
  marginRight: 12px;
`
