import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Box, Typography, Alert, Link } from '@mui/material';
import { registerPatient } from '../../api/authService';
import { useState } from 'react';
import axios from 'axios';

interface RegisterPatientProps {
  onSuccess: () => void;
}

interface FormValues {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}

const schema = yup.object({
  fullName: yup.string().required('Full name is required'),
  email: yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  phone: yup.string()
    .matches(/^[+0-9]+$/, 'Phone number must be valid')
    .min(10, 'Phone number must be at least 10 digits')
    .required('Phone is required'),
}).required();

export const RegisterPatient = ({ onSuccess }: RegisterPatientProps) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const [error, setError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setError(null);
    try {
      await registerPatient({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: "PATIENT"
      });
      onSuccess();
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Registration failed. Please try again.';
      setError(errorMessage);
      console.error('Registration error:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
      <Typography variant="h5" gutterBottom>Register as Patient</Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.includes('already in use') ? (
            <>
              Email already registered. <Link href="/login">Try logging in?</Link>
            </>
          ) : (
            error
          )}
        </Alert>
      )}

      <TextField
        label="Full Name"
        {...register('fullName')}
        error={!!errors.fullName}
        helperText={errors.fullName?.message}
        fullWidth
        margin="normal"
        disabled={isSubmitting}
      />
      <TextField
        label="Email"
        type="email"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
        fullWidth
        margin="normal"
        disabled={isSubmitting}
      />
      <TextField
        label="Password"
        type="password"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
        fullWidth
        margin="normal"
        disabled={isSubmitting}
      />
      <TextField
        label="Phone"
        {...register('phone')}
        error={!!errors.phone}
        helperText={errors.phone?.message}
        fullWidth
        margin="normal"
        disabled={isSubmitting}
      />
      <Button 
        type="submit" 
        variant="contained" 
        fullWidth 
        disabled={isSubmitting}
        sx={{ mt: 3, mb: 2 }}
      >
        {isSubmitting ? 'Registering...' : 'Register'}
      </Button>
    </Box>
  );
};