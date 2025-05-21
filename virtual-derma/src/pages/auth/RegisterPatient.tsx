import { Box, Typography, Container, Link } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField } from '../../components/common/TextField';
import { Button } from '../../components/common/Button';
import { registerPatient } from '../../api/authService';
import { useNavigate } from 'react-router-dom';

// Type definitions
interface FormValues {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}

interface RegisterDTO {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role: string;
}

// Yup validation schema
const registerPatientSchema = yup.object({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  phone: yup
    .string()
    .matches(/^[0-9]+$/, 'Phone number must contain only digits')
    .min(10, 'Phone number must be at least 10 digits')
    .required('Phone number is required'),
});

export const RegisterPatient = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(registerPatientSchema), // <-- Here the fix: no generic argument
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      phone: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const registrationData: RegisterDTO = {
        ...data,
        role: 'patient',
      };
      await registerPatient(registrationData);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box
        sx={{
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: 'background.paper',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Patient Registration
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Create your Virtual DermaCare account
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
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
            sx={{ mb: 3 }}
          />

          <Button type="submit" variant="contained" fullWidth size="large" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register'}
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
