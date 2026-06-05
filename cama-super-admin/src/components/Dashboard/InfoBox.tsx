import React, { Fragment } from 'react';
import styled from 'styled-components';

interface InfoBoxProps {
  label: string;
  value: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({ label, value }) => {
  return (
    <InfoBoxWrap>
      <span>{label}</span> <br/>
      <span>{value}</span>
    </InfoBoxWrap>
  )
}

export default InfoBox;

const InfoBoxWrap = styled.div`
  font-size: 20px;
  line-height: 1.4;
  font-weight: 500;
  color: rgb(0, 168, 164);
  background-color: rgb(237, 246, 246);
  border: 1.5px solid rgb(0, 168, 164);
  padding: 20px;
  text-align: center;
  border-radius: 8px;
  
  flex: 1;
`
