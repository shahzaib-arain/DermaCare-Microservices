import { Box, Typography } from '@mui/material';
import { StatsCard } from '../../../components/dashboard/StatsCard';
import { useAuth } from '../../../contexts/AuthContext';
import { useApi } from '../../../hooks/useApi';
import { useEffect } from 'react';
import { AppointmentDTO } from '../../../types/appointmentTypes';
import EventNoteIcon from '@mui/icons-material/EventNote';
import HealingIcon from '@mui/icons-material/Healing';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';

export const PatientDashboard = () => {
  const { user } = useAuth();
  const { data: appointments, fetchData: fetchAppointments } = useApi<AppointmentDTO[]>();

  useEffect(() => {
    if (user?.id) {
      fetchAppointments({
        url: `/api/appointment/patient/${user.id}`,
        method: 'get'
      });
    }
  }, [user, fetchAppointments]);

  const upcomingAppointments = appointments?.filter(appt => 
    new Date(appt.appointmentTime) > new Date()
  ).length || 0;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Patient Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome back! Here's your overview
      </Typography>

      {/* Replace Grid container with flex Box */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3, 
          mb: 4,
          justifyContent: 'space-between'
        }}
      >
        {/* Each StatsCard wrapped in Box with responsive width */}
        <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
          <StatsCard
            title="Upcoming Appointments"
            value={upcomingAppointments}
            icon={EventNoteIcon}
            color="primary"
          />
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
          <StatsCard
            title="Pending Diagnoses"
            value="2"
            icon={HealingIcon}
            color="secondary"
          />
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
          <StatsCard
            title="Active Prescriptions"
            value="1"
            icon={LocalPharmacyIcon}
            color="success"
          />
        </Box>
      </Box>

      <Box sx={{ 
        backgroundColor: 'background.paper',
        p: 3,
        borderRadius: 2,
        boxShadow: 1
      }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            flex: 1,
            textAlign: 'center',
            '&:hover': {
              backgroundColor: 'action.hover',
              cursor: 'pointer'
            }
          }}>
            <Typography variant="body1">Book New Appointment</Typography>
          </Box>
          <Box sx={{
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            flex: 1,
            textAlign: 'center',
            '&:hover': {
              backgroundColor: 'action.hover',
              cursor: 'pointer'
            }
          }}>
            <Typography variant="body1">Upload Diagnosis</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
