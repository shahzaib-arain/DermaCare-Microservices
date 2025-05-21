import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Box, Typography } from '@mui/material';

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
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8).required('Password is required'),
  phone: yup.string().matches(/^[0-9]+$/, 'Phone number must be digits').min(10).required('Phone is required'),
}).required();

export const RegisterPatient = ({ onSuccess }: RegisterPatientProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      // Replace with your API call, e.g. registerPatient({ ...data, role: 'patient' });
      await new Promise(res => setTimeout(res, 1000)); // simulate async
      
      onSuccess();
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h5" gutterBottom>Register as Patient</Typography>
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
      <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
        {isSubmitting ? 'Registering...' : 'Register'}
      </Button>
    </Box>
  );
};
