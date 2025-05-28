import { Outlet } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Box } from '@mui/material';

export const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
};