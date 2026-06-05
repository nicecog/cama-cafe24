import React, { ChangeEvent } from 'react';
import { MenuItem, TextField, styled } from '@mui/material';

import { SelectProps } from './index';

export const SelectField = styled(TextField)`
  //max-width: 240px;
`;

export const CustomSelectField = styled(SelectField)`
  .MuiOutlinedInput-input {
    padding: 8px 12px;
  }
`

export const SelectItem = styled(MenuItem)`
  margin: ${(props) => `${props.theme.spacing(0.5)} ${props.theme.spacing(1)}`};
  border-radius: 8px;
`;

function CustomSelect({ label, options, value, disabled=false, onChange, styles={} }: SelectProps) {
  return (
    <CustomSelectField disabled={disabled} style={styles} label={label} select fullWidth onChange={onChange} value={value}>
      {options.map((option) => (
        <SelectItem value={option.value} key={option.label}>
          {option.label}
        </SelectItem>
      ))}
    </CustomSelectField>
  );
}

export default CustomSelect;
