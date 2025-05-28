import { Box, Typography, Container, Alert } from '@mui/material';
import { LoginForm } from '../../components/common/LoginForm';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const Login = () => {
  const { isAuthenticated, user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('[Login] User authenticated, redirecting...');
      const from = location.state?.from?.pathname || getDefaultRoute(user.role);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  const getDefaultRoute = (role: string) => {
    switch(role) {
      case 'PATIENT': return '/patient/dashboard';
      case 'DOCTOR': return '/doctor/dashboard';
      case 'ADMIN': return '/admin/dashboard';
      default: return '/';
    }
  };

  const handleLogin = async (credentials: { username: string; password: string }) => {
    try {
      setError('');
      await login(credentials.username, credentials.password);
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