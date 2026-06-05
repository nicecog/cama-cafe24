import React, { ChangeEvent } from 'react';

import { MenuItem, TextField, styled } from '@mui/material';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps {
  label: string;
  options: Array<SelectOption>;
  value: string | number;
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  styles?: React.CSSProperties;
}

export const SelectField = styled(TextField)`
  //max-width: 240px;
`;

export const SelectItem = styled(MenuItem)`
  margin: ${(props) => `${props.theme.spacing(0.5)} ${props.theme.spacing(1)}`};
  border-radius: 8px;
`;

function Select({ label, options, value, disabled=false, onChange, styles={} }: SelectProps) {
  return (
    <SelectField disabled={disabled} style={styles} label={label} select fullWidth onChange={onChange} value={value}>
      {options.map((option) => (
        <SelectItem value={option.value} key={option.label}>
          {option.label}
        </SelectItem>
      ))}
    </SelectField>
  );
}

export default Select;
