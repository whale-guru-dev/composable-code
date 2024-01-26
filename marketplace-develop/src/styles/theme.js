import { createTheme } from '@mui/material';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Poppins',
      'Open Sans',
      'Roboto',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      '"Noto Sans"',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      '"Noto Color Emoji"',
    ].join(','),
    button: {
      textTransform: 'none',
    },
  },
  spacing: 8,
  palette: {
    text: {
      darker: '#212121',
      main: '#353840',
      menu: '#434D55',
      medium: '#707083',
      light: '#8B939B',
      lighter: '#E5E8EB',
      white: '#FFFFFF',
    },
    primary: {
      main: '#25E47A',
      lighter: '#45FF9A',
    },
    secondary: {
      main: '#2781E2',
    },
    background: {
      white: '#FFFFFF',
      main: '#FBFDFF',
      dark: '#04111D',
    },
    border: {
      main: '#212121',
      lighter: '#DFDFDF',
    },
    footer: {
      background: 'rgba(15, 44, 64, 1)',
    },
  },
});

export default theme;
