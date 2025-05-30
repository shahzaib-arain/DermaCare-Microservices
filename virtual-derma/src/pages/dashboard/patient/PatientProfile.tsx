import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { UserResponseDTO } from '../../../types/userTypes';
import { getPatientProfile } from '../../../api/userService';

export const PatientProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getPatientProfile();
        setProfile(data);
      } catch (err) {
        console.error('Error fetching patient profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <CircularProgress />;

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box component={Paper} sx={{ p: 4, mt: 2 }}>
      <Typography variant="h4" gutterBottom>Patient Profile</Typography>
      {profile ? (
        <>
          <Typography variant="body1"><strong>Name:</strong> {profile.fullName}</Typography>
          <Typography variant="body1"><strong>Email:</strong> {profile.email}</Typography>
          <Typography variant="body1"><strong>Phone:</strong> {profile.phone}</Typography>
        </>
      ) : (
        <Typography variant="body1">No profile data available</Typography>
      )}
    </Box>
  );
};