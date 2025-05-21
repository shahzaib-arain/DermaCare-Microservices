import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Avatar } from '@mui/material';
import { useApi } from '../../../hooks/useApi';
import { useEffect } from 'react';
import { DoctorVerificationDTO } from '../../../types/userTypes';
import { verifyDoctor } from '../../../api/userService';

export const DoctorVerification = () => {
  const { data: pendingDoctors, fetchData: fetchPendingDoctors } = useApi<DoctorVerificationDTO[]>();

  useEffect(() => {
    fetchPendingDoctors({
      url: '/api/admin/doctors/pending',
      method: 'get'
    });
  }, [fetchPendingDoctors]);

  const handleVerify = async (doctorId: string) => {
    try {
      await verifyDoctor(doctorId, '/path/to/degree.pdf'); // Replace with actual path
      fetchPendingDoctors({
        url: '/api/admin/doctors/pending',
        method: 'get'
      });
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

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
            {pendingDoctors?.map((doctor) => (
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
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={() => handleVerify(doctor.doctorId)}
                  >
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