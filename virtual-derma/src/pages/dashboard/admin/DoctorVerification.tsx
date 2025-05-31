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
  Tabs,
  Tab,
} from '@mui/material';
import { useAuth } from '../../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { DoctorVerificationDTO } from '../../../types/userTypes';
import {
  getPendingDoctors,
  getVerifiedDoctors,
  verifyDoctor,
} from '../../../api/userService';

export const DoctorVerification = () => {
  const { user } = useAuth();
  const [pendingDoctors, setPendingDoctors] = useState<DoctorVerificationDTO[]>([]);
  const [verifiedDoctors, setVerifiedDoctors] = useState<DoctorVerificationDTO[]>([]);
  const [tab, setTab] = useState(0); // 0 = Pending, 1 = Verified

  const fetchDoctors = async () => {
    try {
      const [pending, verified] = await Promise.all([getPendingDoctors(), getVerifiedDoctors()]);
      setPendingDoctors(pending);
      setVerifiedDoctors(verified);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleVerify = async (doctorId: string) => {
    try {
      await verifyDoctor(doctorId); // Add degree path if needed
      fetchDoctors();
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchDoctors();
    }
  }, [user]);

  const handleTabChange = (_: any, newValue: number) => {
    setTab(newValue);
  };

  const renderDoctorRows = (doctors: DoctorVerificationDTO[], isPending: boolean) =>
    doctors.map((doctor) => (
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
          {isPending ? (
            <Button
              variant="contained"
              size="small"
              onClick={() => handleVerify(doctor.doctorId)}
            >
              Verify
            </Button>
          ) : (
            <Typography color="success.main">Verified</Typography>
          )}
        </TableCell>
      </TableRow>
    ));

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Doctor Verification
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Review and verify doctor registrations
      </Typography>

      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Pending" />
        <Tab label="Verified" />
      </Tabs>

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
            {tab === 0
              ? renderDoctorRows(pendingDoctors, true)
              : renderDoctorRows(verifiedDoctors, false)}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
