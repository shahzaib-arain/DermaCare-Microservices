// styles/medicalTheme.ts
import { createTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';

export const medicalTheme = createTheme({
  palette: {
    primary: {
      main: '#1a73e8', // Trustworthy blue
      light: '#63a4ff',
      dark: '#0045b2',
    },
    secondary: {
      main: '#00acc1', // Teal for contrast
      light: '#5ddef4',
      dark: '#007c91',
    },
    error: {
      main: '#f44336',
    },
    background: {
      default: '#f9fbfd', // Very light blue background
      paper: '#ffffff',
    },
    text: {
      primary: '#2d3748', // Dark gray for text
      secondary: '#718096', // Lighter gray
    },
  },
  typography: {
    fontFamily: [
      '"Inter"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.5px',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          padding: '8px 20px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#2d3748',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});