import { Box, Typography, Button } from '@mui/material';
import { StatsCard } from '../../../components/dashboard/StatsCard';
import { useAuth } from '../../../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { AppointmentDTO } from '../../../types/appointmentTypes';
import EventNoteIcon from '@mui/icons-material/EventNote';
import HealingIcon from '@mui/icons-material/Healing';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import { DoctorProfile } from './DoctorProfile';
import apiClient from '../../../api/apiClient';

export const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<AppointmentDTO[]>(`/api/appointment/doctor/${user.id}`);
        setAppointments(response.data);
      } catch (err) {
        setError('Failed to fetch appointments.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const todayAppointments = appointments.filter(appt => {
    const apptDate = new Date(appt.appointmentTime);
    const today = new Date();
    return (
      apptDate.getDate() === today.getDate() &&
      apptDate.getMonth() === today.getMonth() &&
      apptDate.getFullYear() === today.getFullYear()
    );
  }).length;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Doctor Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome back, Dr. {user?.email?.split('@')[0]}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          mb: 4,
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
          <StatsCard
            title="Today's Appointments"
            value={todayAppointments}
            icon={EventNoteIcon}
            color="primary"
          />
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
          <StatsCard
            title="Pending Diagnoses"
            value="5" // replace with dynamic data when available
            icon={HealingIcon}
            color="secondary"
          />
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
          <StatsCard
            title="Prescriptions This Week"
            value="12" // replace with dynamic data when available
            icon={LocalPharmacyIcon}
            color="success"
          />
        </Box>
      </Box>

      <DoctorProfile />

      <Box
        sx={{
          backgroundColor: 'background.paper',
          p: 3,
          borderRadius: 2,
          boxShadow: 1,
          mt: 4,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Today's Schedule
        </Typography>

        {loading && <Typography>Loading appointments...</Typography>}
        {error && <Typography color="error">{error}</Typography>}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {appointments
            .filter(appt => {
              const apptDate = new Date(appt.appointmentTime);
              const today = new Date();
              return (
                apptDate.getDate() === today.getDate() &&
                apptDate.getMonth() === today.getMonth() &&
                apptDate.getFullYear() === today.getFullYear() &&
                appt.status === 'BOOKED'
              );
            })
            .map(appt => (
              <Box
                key={appt.id}
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography variant="subtitle1">{appt.patientName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(appt.appointmentTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                </Box>
                <Typography variant="body2">{appt.reason}</Typography>
                <Button variant="contained" size="small">
                  Start Consultation
                </Button>
              </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
};
