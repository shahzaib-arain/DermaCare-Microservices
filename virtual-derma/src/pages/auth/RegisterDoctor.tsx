import { Box, Typography, Container, Link } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField } from '../../components/common/TextField';
import { Button } from '../../components/common/Button';
import { registerDoctor } from '../../api/authService';
import { useNavigate } from 'react-router-dom';

// Type definitions
interface FormValues {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  degreeNumber: string;
  specialization: string;
}

interface RegisterDoctorDTO extends FormValues {
  role: string;
}

// Yup validation schema
const registerDoctorSchema = yup.object({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  phone: yup.string()
    .matches(/^[0-9]+$/, 'Phone number must contain only digits')
    .min(10, 'Phone number must be at least 10 digits')
    .required('Phone number is required'),
  degreeNumber: yup.string().required('Medical degree number is required'),
  specialization: yup.string().required('Specialization is required')
});

export const RegisterDoctor = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(registerDoctorSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      phone: '',
      degreeNumber: '',
      specialization: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const registrationData: RegisterDoctorDTO = {
        ...data,
        role: 'doctor'
      };
      await registerDoctor(registrationData);
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
          Doctor Registration
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Join our network of dermatology specialists
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