import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

import { Menu } from 'interfaces/menu';
import { CountState } from '../../../stores/countState';

import NavigationItem from '../NavigationItem';

import * as S from './styled';

interface Props {
  menu: Menu;
  countInfo: CountState;
}

function NavigationListItem({ menu, countInfo }: Props) {
  const { pathname } = useLocation();
  const [isActive, setIsActive] = useState(false);
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);

  const handleToggle = useCallback(() => {
    setIsCollapseOpen((prev) => !prev);
  }, []);

  const getCountInfo = () => {
    if (menu.link === '/content-management/treatment/done/list') {
      return countInfo.doneContents || 0;
    }

    if (menu.link === '/content-management/treatment/disabled/list') {
      return countInfo.ingContents || 0;
    }

    return null;
  }

  useEffect(() => {
    if (pathname.includes(menu.link) || (pathname === '/' && ['/users', '/users/users'].includes(menu.link))) {
      setIsCollapseOpen(true);
    } else {
      setIsCollapseOpen(false);
    }

    if (pathname.includes(menu.link) || (pathname === '/' && ['/users', '/users/users'].includes(menu.link))) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [pathname, menu.link]);

  if (menu.sub) {
    return (
      <Box>
        <NavigationItem menu={menu} countInfo={null} onClick={handleToggle} isCollapseOpen={isCollapseOpen} active={isCollapseOpen} />
        {menu.sub.map((submenu) => (
          <S.Collapse key={submenu.title} in={isCollapseOpen} timeout="auto" unmountOnExit>
            <NavigationListItem countInfo={countInfo} menu={submenu} />
          </S.Collapse>
        ))}
      </Box>
    );
  }

  return (
    <S.StyledLink to={menu.link}>
      <NavigationItem menu={menu} countInfo={getCountInfo()} active={isActive} />
    </S.StyledLink>
  );
}

export default NavigationListItem;
