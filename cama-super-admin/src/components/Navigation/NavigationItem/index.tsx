import React from 'react';

import { Typography } from '@mui/material';

import Expand from 'components/Expand';
import { Menu } from 'interfaces/menu';

import * as S from './styled';

interface Props {
  menu: Menu;
  active: boolean;
  countInfo: number | null;
  isCollapseOpen?: boolean;
  onClick?: () => void;
}

function NavigationItem({ menu, onClick, active = false, countInfo, isCollapseOpen = false }: Props) {
  return (
    <S.NavItem onClick={onClick} $active={active} $isParent={Boolean(menu.sub)}>
      {menu.icon && <S.NavItemIcon $active={active}>{menu.icon}</S.NavItemIcon>}
      <S.NavItemText>
        <Typography variant="body1" fontWeight={active ? 600 : 400}>
          {menu.title} {countInfo !== null && `(${countInfo})`}
        </Typography>
      </S.NavItemText>
      {menu.sub && <Expand open={isCollapseOpen} />}
    </S.NavItem>
  );
}

export default NavigationItem;
