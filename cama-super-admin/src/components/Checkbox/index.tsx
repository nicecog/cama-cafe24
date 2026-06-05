import React from 'react';
import styled from 'styled-components'

import { ReactComponent as CheckboxOff } from 'assets/icons/ic_checkbox_off.svg';
import { ReactComponent as CheckboxOn } from 'assets/icons/ic_checkbox_on.svg';

interface CheckboxProps {
  isSelected: boolean;
  onToggleSelected: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ isSelected, onToggleSelected }) => {
  return (
    <CheckboxWrap onClick={onToggleSelected}>
      {isSelected ? <CheckboxOn /> : <CheckboxOff />}
    </CheckboxWrap>
  );
}

export default Checkbox

const CheckboxWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`
