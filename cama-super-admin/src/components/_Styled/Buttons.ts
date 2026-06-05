import styled from 'styled-components';

export const CustomButton = styled.button<{ borderColor?: string }>`
  font-size: 12px;
  line-height: 1.4;
  outline: none;
  padding: 6px 8px;
  cursor: pointer;
  border-radius: 8px;
  background: #FFF;
  color: #00AB55;
  border: 1px solid ${({ borderColor }) => borderColor ? borderColor : '#00AB55'};
  margin: 0 4px;
`

export const DoneButton = styled.button`
  font-size: 12px;
  line-height: 1.4;
  outline: none;
  padding: 6px 8px;
  cursor: pointer;
  border-radius: 8px;
  background: #00AB55;
  color: #FFF;
  border: 1px solid #00AB55;
  
  height: 56px;
  width: 60px;
  margin-left: 12px;
`

export const SubmitButton = styled('button')`
  width: 100%;
  background-color: #EFEEF1;
  padding: 13px 12px;
  border-radius: 6px;
  border: none;
  margin-top: ${(props) => props.theme.spacing(2)};
  margin-bottom: ${(props) => props.theme.spacing(2)};
  cursor: pointer;

  &:disabled {
    background-color: #EFEEF1;
    cursor: not-allowed;
  }
`;

export const AdornButton = styled(SubmitButton)`
  background-color: #9897A6;
  padding: 4px 8px;
`;

export const CursorSpan = styled('span')`
  cursor: pointer;
  padding: 0 8px;
  color: #00AB55;
  text-decoration: underline;
  font-weight: bold;
`;
