import React, { useCallback } from 'react';
import { NavLink, To, useNavigate } from 'react-router-dom';

import { Button, ButtonProps } from '@mui/material';

interface Props extends ButtonProps {
  to?: To;
  text: string;
}
function LinkButton({ to, text, ...props }: Props) {
  const navigate = useNavigate();

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  if (to) {
    return (
      <NavLink to={to}>
        <Button {...props}>{text}</Button>
      </NavLink>
    );
  }

  return (
    <Button onClick={goBack} {...props}>
      {text}
    </Button>
  );
}

export default LinkButton;
