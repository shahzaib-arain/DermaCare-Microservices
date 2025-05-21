// styles/wellnessTheme.ts
import { createTheme } from '@mui/material/styles';

export const wellnessTheme = createTheme({
  palette: {
    primary: {
      main: '#4a8bad', // Soothing blue-green
      light: '#7ab8d9',
      dark: '#1a5f82',
    },
    secondary: {
      main: '#e8b4a0', // Soft peach
      light: '#ffe6d8',
      dark: '#d48a6a',
    },
    background: {
      default: '#f8f5f2', // Warm off-white
      paper: '#ffffff',
    },
    text: {
      primary: '#3e3e3e', // Soft black
      secondary: '#6b6b6b',
    },
    success: {
      main: '#81c784', // Organic green
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", sans-serif',
    h1: {
      fontSize: '2.8rem',
      fontWeight: 500,
      color: '#3e3e3e',
    },
    h2: {
      fontSize: '2.2rem',
      fontWeight: 500,
      color: '#4a8bad',
    },
    body1: {
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 20,
          padding: '8px 24px',
          transition: 'all 0.3s ease',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '1px solid #e0e0e0',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#e8b4a0',
          color: '#3e3e3e',
        },
      },
    },
  },
});