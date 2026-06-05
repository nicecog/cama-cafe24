import React, { CSSProperties } from 'react';
import { Button } from '@mui/material';

interface BasicButtonProps {
  label: string;
  style?: CSSProperties;
  onClick?: () => void;
}

const BasicButton: React.FC<BasicButtonProps> = ({
  label,
  style= { height: 56 },
  onClick = () => {},
}) => {
  return (
    <Button
      variant="contained"
      color="primary"
      style={style}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export default BasicButton;
