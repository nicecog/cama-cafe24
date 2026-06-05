import React, { ChangeEvent } from 'react';

import { Box, FormControlLabel, FormLabel, Radio, RadioGroup as MuiRadioGroup } from '@mui/material';

interface Props {
  label: string;
  value: unknown;
  options: Array<{ value: unknown; label: string }>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function RadioGroup({ label, value, options, onChange }: Props) {
  return (
    <Box>
      <FormLabel id={`radio-buttons-group-${label}`}>{label}</FormLabel>
      <MuiRadioGroup row aria-labelledby="radio-buttons-group-label" value={value} onChange={onChange}>
        {options.map((option) => (
          <FormControlLabel key={option.label} value={option.value} control={<Radio />} label={option.label} />
        ))}
      </MuiRadioGroup>
    </Box>
  );
}

export default RadioGroup;
