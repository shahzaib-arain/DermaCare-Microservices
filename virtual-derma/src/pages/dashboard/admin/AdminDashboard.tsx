import { Box, Typography, Grid } from '@mui/material';
import { StatsCard } from '../../../components/dashboard/StatsCard';
import { useApi } from '../../../hooks/useApi';
import { useEffect } from 'react';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GroupIcon from '@mui/icons-material/Group';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicationIcon from '@mui/icons-material/Medication';

export const AdminDashboard = () => {
  const { data: doctors, fetchData: fetchDoctors } = useApi();
  const { data: patients, fetchData: fetchPatients } = useApi();
  const { data: medicines, fetchData: fetchMedicines } = useApi();

  useEffect(() => {
    fetchDoctors({ url: '/api/admin/doctors/verified', method: 'get' });
    fetchPatients({ url: '/api/admin/patients', method: 'get' });
    fetchMedicines({ url: '/api/pharmacy/medicines', method: 'get' });
  }, [fetchDoctors, fetchPatients, fetchMedicines]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        System overview and management
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Doctors"
            value={doctors?.length || 0}
            icon={LocalHospitalIcon}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Pending Verifications"
            value="5"
            icon={AdminPanelSettingsIcon}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Registered Patients"
            value={patients?.length || 0}
            icon={GroupIcon}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Medicines in Stock"
            value={medicines?.length || 0}
            icon={MedicationIcon}
            color="warning"
          />
        </Grid>
      </Grid>

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
          <Button 
            variant="contained"
            href="/admin/doctor-verification"
          >
            Verify Doctors
          </Button>
          <Button 
            variant="contained"
            href="/admin/manage-medicines"
          >
            Manage Medicines
          </Button>
        </Box>
      </Box>
    </Box>
  );
};