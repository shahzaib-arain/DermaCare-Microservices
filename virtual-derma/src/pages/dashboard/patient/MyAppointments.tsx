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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import { useAuth } from '../../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { AppointmentDTO } from '../../../types/appointmentTypes';
import { formatDateTime } from '../../../utils/dateUtils';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  rescheduleAppointment,
  cancelAppointment,
  getPatientAppointments
} from '../../../api/appointmentService';

export const MyAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
  const [openRescheduleDialog, setOpenRescheduleDialog] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [newDateTime, setNewDateTime] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      if (user?.email) {
        try {
          const data = await getPatientAppointments(user.email);
          setAppointments(data);
        } catch (error) {
          console.error('Failed to fetch appointments:', error);
        }
      }
    };
    fetchAppointments();
  }, [user]);

  const handleCancel = async (id: string) => {
    try {
      await cancelAppointment(id);
      setAppointments(prev => prev.filter(appt => appt.id !== id));
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
    }
  };

  const handleOpenReschedule = (id: string) => {
    setSelectedAppointmentId(id);
    setOpenRescheduleDialog(true);
  };

  const handleReschedule = async () => {
    if (!selectedAppointmentId || !newDateTime) return;
    try {
      const updated = await rescheduleAppointment(selectedAppointmentId, newDateTime);
      setAppointments(prev =>
        prev.map(appt => (appt.id === updated.id ? updated : appt))
      );
      setOpenRescheduleDialog(false);
      setNewDateTime('');
      setSelectedAppointmentId(null);
    } catch (error) {
      console.error('Failed to reschedule appointment:', error);
    }
  };

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
            {appointments.map((appointment) => (
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
                      <IconButton
                        color="primary"
                        size="large"
                        onClick={() => handleOpenReschedule(appointment.id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="large"
                        onClick={() => handleCancel(appointment.id)}
                      >
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

      {/* Reschedule Dialog */}
      <Dialog
        open={openRescheduleDialog}
        onClose={() => setOpenRescheduleDialog(false)}
      >
        <DialogTitle>Reschedule Appointment</DialogTitle>
        <DialogContent>
          <TextField
            label="New Date & Time"
            type="datetime-local"
            fullWidth
            value={newDateTime}
            onChange={(e) => setNewDateTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRescheduleDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleReschedule}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
