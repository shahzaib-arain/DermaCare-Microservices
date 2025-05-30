import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Avatar,
} from '@mui/material';
import { useAuth } from '../../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { DoctorVerificationDTO } from '../../../types/userTypes';
import apiClient from '../../../api/apiClient';

export const DoctorVerification = () => {
  const { user } = useAuth();
  const [pendingDoctors, setPendingDoctors] = useState<DoctorVerificationDTO[]>([]);

  const fetchPendingDoctors = async () => {
    try {
      const response = await apiClient.get<DoctorVerificationDTO[]>('/api/admin/doctors/pending', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setPendingDoctors(response.data);
    } catch (error) {
      console.error('Failed to fetch pending doctors:', error);
    }
  };

  const handleVerify = async (doctorId: string) => {
    try {
      await apiClient.post(
        `/api/admin/doctors/verify`,
        { doctorId, degreePath: '/path/to/degree.pdf' }, // Replace degreePath appropriately
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      fetchPendingDoctors();
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchPendingDoctors();
    }
  }, [user]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Doctor Verification
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Review and verify new doctor registrations
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Doctor</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Degree Number</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingDoctors.map((doctor) => (
              <TableRow key={doctor.doctorId}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2 }} />
                    <Box>
                      <Typography>{doctor.fullName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {doctor.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{doctor.specialization}</TableCell>
                <TableCell>{doctor.degreeNumber}</TableCell>
                <TableCell>
                  <Button variant="contained" size="small" onClick={() => handleVerify(doctor.doctorId)}>
                    Verify
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
