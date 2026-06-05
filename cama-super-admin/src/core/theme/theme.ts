import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
  interface PaletteColorOptions {
    lighter: string;
    light: string;
    main: string;
    dark: string;
    darker: string;
  }
}

const palette = {
  primary: {
    lighter: '#C8FACD',
    light: '#5BE584',
    main: '#00AB55',
    dark: '#007B55',
    darker: '#005249',
  },
  secondary: { lighter: '#D6E4FF', light: '#84A9FF', main: '#3366FF', dark: '#1939B7', darker: '#091A7A' },
  info: { lighter: '#D0F2FF', light: '#74CAFF', main: '#1890FF', dark: '#0C53B7', darker: '#04297A' },
  success: { lighter: '#E9FCD4', light: '#AAF27F', main: '#54D62C', dark: '#229A16', darker: '#08660D' },
  warning: { lighter: '#FFF7CD', light: '#FFE16A', main: '#FFC107', dark: '#B78103', darker: '#7A4F01' },
  error: { lighter: '#FFE7D9', light: '#FFA48D', main: '#FF4842', dark: '#B72136', darker: '#7A0C2E' },
  grey: {
    '100': '#F9FAFB',
    '200': '#F4F6F8',
    '300': '#DFE3E8',
    '400': '#C4CDD5',
    '500': '#919EAB',
    '600': '#637381',
    '700': '#454F5B',
    '800': '#212B36',
    '900': '#161C24',
  },
};

const theme = createTheme({
  palette,
  typography: {
    button: {
      fontSize: 14,
      lineHeight: '24px',
      fontWeight: 700,
    },
    overline: {
      fontSize: 12,
      lineHeight: '18px',
      fontWeight: 700,
    },
    caption: {
      fontSize: 12,
      lineHeight: '18px',
      fontWeight: 400,
    },
    body1: {
      fontSize: 16,
      lineHeight: '24px',
      fontWeight: 400,
    },
    body2: {
      fontSize: 14,
      lineHeight: '21px',
      fontWeight: 400,
    },
    subtitle1: {
      fontSize: 16,
      lineHeight: '24px',
      fontWeight: 600,
    },
    subtitle2: {
      fontSize: 14,
      lineHeight: '22px',
      fontWeight: 600,
    },
    h1: {
      fontSize: 64,
      lineHeight: '80px',
      fontWeight: 700,
      letterSpacing: 2,
    },
    h2: {
      fontSize: 48,
      lineHeight: '64px',
      fontWeight: 700,
    },
    h3: {
      fontSize: 32,
      lineHeight: '48px',
      fontWeight: 700,
    },
    h4: {
      fontSize: 24,
      lineHeight: '36px',
      fontWeight: 700,
    },
    h5: {
      fontSize: 20,
      lineHeight: '30px',
      fontWeight: 700,
    },
    h6: {
      fontSize: 18,
      lineHeight: '28px',
      fontWeight: 700,
    },
  },
  components: {
    MuiTableHead: {
      styleOverrides: {
        root: {
          '.MuiTableCell-root': {
            backgroundColor: palette.grey[200],
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          boxShadow: 'rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px',
        },
      },
    },
  },
});

export default theme;
