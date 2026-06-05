import React, { Fragment } from 'react';
import styled from 'styled-components';

interface InfoBoxSmallProps {
  label: string;
  value: string;
}

const InfoBoxSmall: React.FC<InfoBoxSmallProps> = ({ label, value }) => {
  return (
    <InfoBoxWrap>
      <span>{label}</span>
      <span>{value}</span>
    </InfoBoxWrap>
  )
}

export default InfoBoxSmall;

const InfoBoxWrap = styled.div`
  font-size: 20px;
  line-height: 1.4;
  font-weight: 500;
  color: rgb(0, 168, 164);
  background-color: rgb(237, 246, 246);
  border: 1.5px solid rgb(0, 168, 164);
  text-align: center;
  border-radius: 8px;
  
  height: 40px;
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
`
