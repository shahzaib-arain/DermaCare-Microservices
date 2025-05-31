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
  CircularProgress,
  IconButton,
} from '@mui/material';
import { useAuth } from '../../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { AppointmentDTO } from '../../../types/appointmentTypes';
import { formatDateTime } from '../../../utils/dateUtils';
import { getDoctorAppointments, updateAppointmentStatus } from '../../../api/appointmentService';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VideocamIcon from '@mui/icons-material/Videocam';

export const Appointments = () => {
  const { user, isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!isAuthenticated || !user || !user.email) {
          throw new Error('Please login to view appointments');
        }

        const data = await getDoctorAppointments(user.email); // ✅ use email now
        setAppointments(data);
      } catch (error) {
        console.error('Failed to fetch doctor appointments:', error);
        setError(error instanceof Error ? error.message : 'Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [isAuthenticated, user]);

  const handleStatusChange = async (id: string, status: 'COMPLETED' | 'CANCELLED') => {
    try {
      setError(null);
      const updatedAppointment = await updateAppointmentStatus(id, status);
      setAppointments((prev) =>
        prev.map((app) => (app.id === id ? updatedAppointment : app))
      );
    } catch (error) {
      console.error('Failed to update appointment status:', error);
      setError(error instanceof Error ? error.message : 'Failed to update appointment');
    }
  };

  const handleStartAppointment = (appointmentId: string) => {
    // Implement video call start logic
    console.log('Starting appointment:', appointmentId);
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Please login to view appointments
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Appointments
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        View and manage your patient appointments
      </Typography>

      {appointments.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: 'center', p: 4 }}>
          No appointments scheduled yet.
        </Typography>
      ) : (
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
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.patientName}</TableCell>
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
                        color: 'common.white',
                      }}
                    >
                      {appointment.status}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {appointment.status === 'BOOKED' && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          color="primary"
                          aria-label="start appointment"
                          onClick={() => handleStartAppointment(appointment.id)}
                        >
                          <VideocamIcon />
                        </IconButton>
                        <IconButton
                          color="success"
                          aria-label="mark as completed"
                          onClick={() => handleStatusChange(appointment.id, 'COMPLETED')}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          aria-label="cancel appointment"
                          onClick={() => handleStatusChange(appointment.id, 'CANCELLED')}
                        >
                          <CancelIcon />
                        </IconButton>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
