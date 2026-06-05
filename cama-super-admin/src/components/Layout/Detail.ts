import { Card, CardActions, CardContent, styled } from '@mui/material';

export const Container = styled(Card)``;

export const Content = styled(CardContent)`
  padding: ${(props) => props.theme.spacing(3)};
`;

export const Footer = styled(CardActions)`
  justify-content: flex-end;
  padding: ${(props) => props.theme.spacing(3)};
  padding-top: 0;
`;
