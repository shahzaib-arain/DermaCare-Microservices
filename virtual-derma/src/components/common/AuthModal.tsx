import { useState } from 'react';
import { Dialog, Tab, Tabs } from '@mui/material';
import { LoginForm } from './LoginForm';
import { RegisterPatient } from 'pages/auth/RegisterPatient';
import { RegisterDoctor } from 'pages/auth/RegisterDoctor';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register-patient' | 'register-doctor';
}

export const AuthModal = ({ open, onClose, initialTab = 'login' }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState(initialTab);

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
        {activeTab === 'login' && <LoginForm onSuccess={onClose} />}
        {activeTab === 'register-patient' && <RegisterPatient onSuccess={onClose} />}
        {activeTab === 'register-doctor' && <RegisterDoctor onSuccess={onClose} />}
      </div>
    </Dialog>
  );
};
