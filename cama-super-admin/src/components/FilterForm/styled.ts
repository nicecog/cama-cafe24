import { Box, Button, styled } from '@mui/material';

export const Wrapper = styled(Box)`
  margin: ${(props) => props.theme.spacing(3, 0)};
`;

export const ButtonGroup = styled(Box)`
  margin-top: ${(props) => props.theme.spacing(2)};
`;

export const SubmitButton = styled(Button)``;

export const ResetButton = styled(Button)``;
