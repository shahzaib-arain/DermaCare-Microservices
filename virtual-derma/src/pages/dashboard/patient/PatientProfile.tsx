import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { UserResponseDTO } from '../../../types/userTypes';
import apiClient from '../../../api/apiClient';

export const PatientProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await apiClient.get<UserResponseDTO>('/user/profile');
        setProfile(data);
      } catch (err) {
        console.error('Error fetching patient profile:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.token) fetchProfile();
  }, [user]);

  if (loading) return <CircularProgress />;

  return (
    <Box component={Paper} sx={{ p: 4, mt: 2 }}>
      <Typography variant="h4" gutterBottom>Patient Profile</Typography>
      <Typography variant="body1"><strong>Name:</strong> {profile?.fullName}</Typography>
      <Typography variant="body1"><strong>Email:</strong> {profile?.email}</Typography>
      <Typography variant="body1"><strong>Phone:</strong> {profile?.phone}</Typography>
    </Box>
  );
};
