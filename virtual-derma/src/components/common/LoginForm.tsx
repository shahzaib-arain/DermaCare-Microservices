import { useState } from 'react';
import { TextField, Button, Box, CircularProgress, Alert } from '@mui/material';

interface LoginFormProps {
  onSubmit: (credentials: { username: string; password: string }) => Promise<void>;
}

export const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      await onSubmit({ username, password });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        margin="normal"
        required
        disabled={isSubmitting}
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
        required
        disabled={isSubmitting}
      />
      <Button 
        type="submit" 
        variant="contained" 
        fullWidth 
        sx={{ mt: 2 }} 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Login'
        )}
      </Button>
    </Box>
  );
};