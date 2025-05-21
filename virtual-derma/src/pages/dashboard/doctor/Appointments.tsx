import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useApi } from '../../../hooks/useApi';
import { useAuth } from '../../../contexts/AuthContext';
import { useEffect } from 'react';
import { AppointmentDTO } from '../../../types/appointmentTypes';
import { formatDateTime } from '../../../utils/dateUtils';

export const Appointments = () => {
  const { user } = useAuth();
  const { data: appointments, fetchData: fetchAppointments } = useApi<AppointmentDTO[]>();

  useEffect(() => {
    if (user?.id) {
      fetchAppointments({
        url: `/api/appointment/doctor/${user.id}`,
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
        View and manage your patient appointments
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments?.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.patientName}</TableCell>
                <TableCell>{formatDateTime(appointment.appointmentTime)}</TableCell>
                <TableCell>{appointment.reason}</TableCell>
                <TableCell>
                  <Box sx={{
                    display: 'inline-block',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    backgroundColor: 
                      appointment.status === 'BOOKED' ? 'info.light' :
                      appointment.status === 'COMPLETED' ? 'success.light' :
                      appointment.status === 'CANCELLED' ? 'error.light' : 'warning.light',
                    color: 'common.white'
                  }}>
                    {appointment.status}
                  </Box>
                </TableCell>
                <TableCell>
                  {appointment.status === 'BOOKED' && (
                    <Button variant="contained" size="small">
                      Start
                    </Button>
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