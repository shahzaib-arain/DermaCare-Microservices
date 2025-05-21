import { Box } from '@mui/material';
import { Header } from './components/common/Header';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { medicalTheme } from './styles/medicalTheme';
import { ThemeProvider } from '@mui/material/styles';
import { AppRoutes } from './routes';

function App() {
  return (
     <ThemeProvider theme={medicalTheme}>
     <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <Header />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <AppRoutes />
        </Box>
      </Box>
      <Footer />
    </Box>
    </ThemeProvider>
 
  );
}

export default App;