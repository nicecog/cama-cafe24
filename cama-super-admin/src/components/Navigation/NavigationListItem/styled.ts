import { NavLink } from 'react-router-dom';

import { Collapse as MuiCollapse, styled } from '@mui/material';

export const StyledLink = styled(NavLink)`
  width: 100%;
  text-decoration: none;
  color: inherit;
`;

export const Collapse = styled(MuiCollapse)`
  .MuiButtonBase-root {
    padding-left: ${(props) => props.theme.spacing(6)};
  }
`;
