import { useState } from 'react';
import { Dialog, Tab, Tabs, Alert } from '@mui/material';
import { LoginForm } from './LoginForm';
import { RegisterPatient } from 'pages/auth/RegisterPatient';
import { RegisterDoctor } from 'pages/auth/RegisterDoctor';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register-patient' | 'register-doctor';
}

export const AuthModal = ({ open, onClose, initialTab = 'login' }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (credentials: { username: string; password: string }) => {
    try {
      setLoginError('');
      await login(credentials.username, credentials.password);
      onClose();
      // Redirect will be handled by AuthContext state change
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setLoginError(errorMessage);
      console.error('Login error:', errorMessage);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        variant="fullWidth"
        sx={{ mb: 2 }}
      >
        <Tab label="Login" value="login" />
        <Tab label="Register as Patient" value="register-patient" />
        <Tab label="Register as Doctor" value="register-doctor" />
      </Tabs>

      <div style={{ padding: '0 24px 24px' }}>
        {activeTab === 'login' && (
          <>
            {loginError && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setLoginError('')}>
                {loginError}
              </Alert>
            )}
            <LoginForm onSubmit={handleLogin} />
          </>
        )}
        {activeTab === 'register-patient' && <RegisterPatient onSuccess={onClose} />}
        {activeTab === 'register-doctor' && <RegisterDoctor onSuccess={onClose} />}
      </div>
    </Dialog>
  );
};