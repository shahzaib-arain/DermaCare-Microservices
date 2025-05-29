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
  IconButton
} from '@mui/material';
import { useApi } from '../../../hooks/useApi';
import { useAuth } from '../../../contexts/AuthContext';
import { useEffect } from 'react';
import { AppointmentDTO } from '../../../types/appointmentTypes';
import { formatDateTime } from '../../../utils/dateUtils';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';

export const MyAppointments = () => {
  const { user } = useAuth();
  const { data: appointments, fetchData: fetchAppointments } = useApi<AppointmentDTO[]>();

  useEffect(() => {
    if (user?.email) {
      fetchAppointments({
        url: `/api/appointment/patient/${user.email}`,
        method: 'get'
      });
    }
  }, [user, fetchAppointments]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Appointments
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        View and manage your upcoming and past appointments
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Doctor</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments?.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.doctorName}</TableCell>
                <TableCell>{formatDateTime(appointment.appointmentTime)}</TableCell>
                <TableCell>{appointment.reason}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: 'inline-block',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      backgroundColor:
                        appointment.status === 'BOOKED'
                          ? 'info.light'
                          : appointment.status === 'COMPLETED'
                          ? 'success.light'
                          : appointment.status === 'CANCELLED'
                          ? 'error.light'
                          : 'warning.light',
                      color: 'common.white'
                    }}
                  >
                    {appointment.status}
                  </Box>
                </TableCell>
                <TableCell>
                  {appointment.status === 'BOOKED' && (
                    <>
                      <IconButton color="primary" size="large">
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" size="large">
                        <CancelIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
