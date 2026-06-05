import { Box, styled } from '@mui/material';

export const Section = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing(3)};

  & + & {
    margin-top: ${(props) => props.theme.spacing(6)};
  }
`;

export const ThumbImgView = styled('div')<{ height: number }>`
  width: 240px;
  height: ${({height}) => height}px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid rgba(0,0,0,0.23);
`

export const ThumbImg = styled('img')`
  width: 100%;
  height: 100%;
  object-fit: contain;
`

export const RollingView = styled('div')`
  width: 380px;
  height: 240px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid rgba(0,0,0,0.23);
  margin: 20px auto 0;
  position: relative;
`

export const RollingIndexView = styled('div')`
  width: 50px;
  height: 30px;
  position: absolute;
  left: 30px;
  bottom: -32px;
`
