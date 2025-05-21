import { Box, Typography, Container, Link } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerDoctorSchema } from '../../utils/validationSchemas';
import { TextField } from '../../components/common/TextField';
import { Button } from '../../components/common/Button';
import { registerDoctor } from '../../api/authService';
import { useNavigate } from 'react-router-dom';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  degreeNumber: string;
  specialization: string;
}

export const RegisterDoctor = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(registerDoctorSchema)
  });
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      await registerDoctor(data);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ 
        p: 4, 
        boxShadow: 3, 
        borderRadius: 2,
        backgroundColor: 'background.paper'
      }}>
        <Typography variant="h4" align="center" gutterBottom>
          Doctor Registration
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Join our network of dermatology specialists
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Full Name"
            {...register('fullName')}
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            type="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Phone Number"
            {...register('phone')}
            error={!!errors.phone}
            helperText={errors.phone?.message}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Medical Degree Number"
            {...register('degreeNumber')}
            error={!!errors.degreeNumber}
            helperText={errors.degreeNumber?.message}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Specialization"
            {...register('specialization')}
            error={!!errors.specialization}
            helperText={errors.specialization?.message}
            fullWidth
            sx={{ mb: 3 }}
          />
          
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
          >
            Register
          </Button>
        </Box>
        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link href="/login" underline="hover">
              Sign In
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};