import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Box, Typography } from '@mui/material';

interface RegisterDoctorProps {
  onSuccess: () => void;
}

interface FormValues {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  licenseNumber: string;
}

const schema = yup.object({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8).required('Password is required'),
  phone: yup.string().matches(/^[0-9]+$/, 'Phone number must be digits').min(10).required('Phone is required'),
  licenseNumber: yup.string().required('License number is required'),
}).required();

export const RegisterDoctor = ({ onSuccess }: RegisterDoctorProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      // Replace with your API call, e.g. registerDoctor({ ...data, role: 'doctor' });
      await new Promise(res => setTimeout(res, 1000)); // simulate async
      
      onSuccess();
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h5" gutterBottom>Register as Doctor</Typography>
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
        label="License Number"
        {...register('licenseNumber')}
        error={!!errors.licenseNumber}
        helperText={errors.licenseNumber?.message}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
        {isSubmitting ? 'Registering...' : 'Register'}
      </Button>
    </Box>
  );
};
