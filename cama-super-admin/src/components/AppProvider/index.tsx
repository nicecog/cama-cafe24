import React, { PropsWithChildren } from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/styled-engine';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RecoilRoot } from 'recoil';

import ApiClient from 'apis/ApiClient';
import GlobalStyles from 'core/theme/GlobalStyles';
import theme from 'core/theme/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      enabled: ApiClient.apiToken !== '',
    },
  },
});

function AppProvider({ children }: PropsWithChildren) {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <StyledEngineProvider injectFirst>
          <CssBaseline />
          <GlobalStyles />
          <MuiThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>{children}</LocalizationProvider>
          </MuiThemeProvider>
        </StyledEngineProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </RecoilRoot>
  );
}

export default AppProvider;
