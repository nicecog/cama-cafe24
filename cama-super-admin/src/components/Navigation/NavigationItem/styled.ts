import { Box, ListItemButton, ListItemText, styled } from '@mui/material';

export const NavItem = styled(ListItemButton)<{ $active: boolean; $isParent?: boolean }>`
  display: flex;
  padding: ${(props) => `${props.theme.spacing(1)} ${props.theme.spacing(2)}`};
  color: ${(props) => (props.$active ? props.theme.palette.primary.main : props.theme.palette.grey[600])};
  border-radius: 8px;
  margin-bottom: ${(props) => props.theme.spacing(0.5)};
  background-color: ${(props) =>
    props.$isParent && props.$active ? `${props.theme.palette.primary.main}14` : 'transparent'};
`;

export const NavItemIcon = styled(Box)<{ $active: boolean }>`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  margin-right: ${(props) => props.theme.spacing(1)};
  color: ${(props) => (props.$active ? props.theme.palette.primary.main : props.theme.palette.grey[600])};
`;

export const NavItemText = styled(ListItemText)`
  flex: auto;
  text-align: left;
`;
