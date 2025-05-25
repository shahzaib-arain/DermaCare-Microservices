// src/styles/GlobalStyles.js
import { GlobalStyles as MuiGlobalStyles } from '@mui/material';

const GlobalStyles = () => (
  <MuiGlobalStyles
    styles={{
      '*': {
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
      },
      html: {
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        scrollBehavior: 'smooth',
      },
      body: {
        backgroundColor: '#F9FAFC',
      },
      a: {
        textDecoration: 'none',
      },
      '@keyframes fadeIn': {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
      },
      '.slick-slide': {
        padding: '0 10px',
      },
      '.slick-list': {
        margin: '0 -10px',
      },
    }}
  />
);

export default GlobalStyles;