import { Box, Typography, Container, Link } from '@mui/material';
import { LoginForm } from '../../components/common/LoginForm';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ 
        p: 4, 
        boxShadow: 3, 
        borderRadius: 2,
        backgroundColor: 'background.paper'
      }}>
        <Typography variant="h4" align="center" gutterBottom>
          Sign In
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Access your Virtual DermaCare account
        </Typography>
        
        <LoginForm onSuccess={function (): void {
                  throw new Error('Function not implemented.');
              } } />
        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2">
            Don't have an account?{' '}
            <Link href="/register/patient" underline="hover">
              Register as Patient
            </Link>{' '}
            or{' '}
            <Link href="/register/doctor" underline="hover">
              Register as Doctor
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};