import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Box, Typography } from '@mui/material';
import { registerDoctor } from '../../api/authService';
import { useState } from 'react';

interface RegisterDoctorProps {
  onSuccess: () => void;
}

interface FormValues {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  degreeNumber: string;
  specialization: string;
}

const schema = yup.object({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8).required('Password is required'),
  phone: yup.string().matches(/^[+0-9]+$/, 'Phone number must be valid').min(10).required('Phone is required'),
  degreeNumber: yup.string().required('Degree number is required'),
  specialization: yup.string().required('Specialization is required'),
}).required();

export const RegisterDoctor = ({ onSuccess }: RegisterDoctorProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const [error, setError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setError(null);
    try {
      const response = await registerDoctor({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: "DOCTOR",
        degreeNumber: data.degreeNumber,
        specialization: data.specialization
      });
      
      if (response.success) {
        onSuccess();
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
      console.error('Registration failed:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
      <Typography variant="h5" gutterBottom>Register as Doctor</Typography>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <TextField
        label="Full Name"
        {...register('fullName')}
        error={!!errors.fullName}
        helperText={errors.fullName?.message}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Phone"
        {...register('phone')}
        error={!!errors.phone}
        helperText={errors.phone?.message}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Degree Number"
        {...register('degreeNumber')}
        error={!!errors.degreeNumber}
        helperText={errors.degreeNumber?.message}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Specialization"
        {...register('specialization')}
        error={!!errors.specialization}
        helperText={errors.specialization?.message}
        fullWidth
        margin="normal"
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