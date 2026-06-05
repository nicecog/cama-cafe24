import { Button, FormControl, Paper, Container as MuiContainer, Box, styled } from '@mui/material';

export const Container = styled(MuiContainer)`
  min-height: 100vh;
  height: 100%;
  padding-top: 120px;
`;

export const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(4)};
  border-radius: 8px;
  box-shadow: rgb(0 0 0 / 24%) 0px 10px 15px;
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`;

export const FormHeader = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Form = styled('form')`
  margin-top: ${(props) => props.theme.spacing(3)};
  flex-grow: 1;
`;

export const Input = styled(FormControl)`
  margin-top: ${(props) => props.theme.spacing(2)};
  margin-bottom: ${(props) => props.theme.spacing(1)};
`;

export const SignInButton = styled(Button)`
  margin-top: ${(props) => props.theme.spacing(2)};
  border-radius: 8px;
`;
