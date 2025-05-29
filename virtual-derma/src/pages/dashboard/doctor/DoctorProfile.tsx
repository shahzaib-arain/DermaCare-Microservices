import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { getDoctorProfile } from '../../../api/userService';
import { useAuth } from '../../../contexts/AuthContext';
import { UserResponseDTO } from '../../../types/userTypes';

export const DoctorProfile = () => {
 const { user } = useAuth();
const token = user?.token;

  const [profile, setProfile] = useState<UserResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (token) {
          const data = await getDoctorProfile(token);
          setProfile(data);
        }
      } catch (err) {
        console.error('Error fetching doctor profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  if (loading) return <CircularProgress />;

  return (
    <Box component={Paper} sx={{ p: 4, mt: 2 }}>
      <Typography variant="h4" gutterBottom>Doctor Profile</Typography>
      <Typography variant="body1"><strong>Name:</strong> {profile?.fullName}</Typography>
      <Typography variant="body1"><strong>Email:</strong> {profile?.email}</Typography>
      <Typography variant="body1"><strong>Specialization:</strong> {profile?.specialization}</Typography>
      <Typography variant="body1"><strong>Degree No:</strong> {profile?.degreeNumber}</Typography>
      {/* Add more fields as needed */}
    </Box>
  );
};
