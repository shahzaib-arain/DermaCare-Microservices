// src/pages/Unauthorized.tsx
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: 'center', mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        403 - Unauthorized Access
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        You don't have permission to access this page.
      </Typography>
      <Button 
        variant="contained" 
        onClick={() => navigate('/')}
      >
        Go to Home
      </Button>
    </Box>
  );
};