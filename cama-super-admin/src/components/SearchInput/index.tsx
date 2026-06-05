import React, { ChangeEvent, KeyboardEvent } from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, InputAdornment, TextField } from '@mui/material';

interface Props {
  value: string;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
}

function SearchInput({ value, onChange, onKeyUp, placeholder, setValue }: Props) {
  return (
    <TextField
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: setValue && value !== '' && (
          <InputAdornment position="end">
            <IconButton onClick={() => setValue('')}>
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ),
        onKeyUp: onKeyUp,
      }}
    />
  );
}

export default SearchInput;
