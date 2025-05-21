import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Typography } from '@mui/material';
import { login } from '../../api/authService';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormProps {
  onSuccess: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const { login: authLogin } = useAuth();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data.email, data.password);
      authLogin(response.token);
      onSuccess();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Email"
        type="email"
        {...register('email', { required: 'Email is required' })}
        error={!!errors.email}
        helperText={errors.email?.message}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        {...register('password', { required: 'Password is required' })}
        error={!!errors.password}
        helperText={errors.password?.message}
        sx={{ mb: 2 }}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 2, mb: 2 }}
      >
        Sign In
      </Button>
    </Box>
  );
};