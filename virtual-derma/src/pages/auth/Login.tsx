import { Box, Typography, Container, Alert } from '@mui/material';
import { LoginForm } from '../../components/common/LoginForm';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const Login = () => {
  const { login } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (credentials: { username: string; password: string }) => {
    try {
      setError('');
      await login(credentials.username, credentials.password);
      
      // Redirect to the intended page or dashboard
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      console.error('Login error:', errorMessage);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Sign In
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <LoginForm onSubmit={handleLogin} />
    </Container>
  );
};
