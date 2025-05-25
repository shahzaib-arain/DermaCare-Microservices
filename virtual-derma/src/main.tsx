import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import './styles/global.css';
import theme from './styles/theme';
import { AuthProvider } from './contexts/AuthContext';




const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
    <div className="fade-in slide-up">
  <React.StrictMode>
    <BrowserRouter>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </BrowserRouter>
  </React.StrictMode>
  </div>
);