import React, { ChangeEvent } from 'react';

import {Box, styled, Typography} from '@mui/material';

interface Props {
  tabName: string;
  isActive?: boolean;
  onNavigate: () => void;
}

function DetailTabItem({ tabName, isActive=false, onNavigate }: Props) {
  return (
    <ItemWrap isActive={isActive} onClick={onNavigate}>
      <Typography variant="h4">{tabName}</Typography>
    </ItemWrap>
  );
}

export default DetailTabItem;

const ItemWrap = styled('div')<{ isActive: boolean }>`
  padding: 4px 8px;
  cursor: pointer;
  color: gray;
  ${({ isActive }) => isActive && `
    border-bottom: 3px solid #000;
    color: #000;
  `}
`;
