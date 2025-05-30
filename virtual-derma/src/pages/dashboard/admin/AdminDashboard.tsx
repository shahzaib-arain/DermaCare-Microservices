import { Box, Typography, Button } from '@mui/material';
import { StatsCard } from '../../../components/dashboard/StatsCard';
import { useApi } from '../../../hooks/useApi';
import { useEffect } from 'react';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GroupIcon from '@mui/icons-material/Group';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicationIcon from '@mui/icons-material/Medication';

interface DoctorDTO {
  id: string;
  name: string;
}

interface PatientDTO {
  id: string;
  name: string;
}

interface MedicineDTO {
  medicineId: string;
  name: string;
}

export const AdminDashboard = () => {
  const { data: doctors, fetchData: fetchDoctors } = useApi<DoctorDTO[]>();
  const { data: patients, fetchData: fetchPatients } = useApi<PatientDTO[]>();
  const { data: medicines, fetchData: fetchMedicines } = useApi<MedicineDTO[]>();

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

      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3,
        mb: 4,
        justifyContent: 'space-between',
      }}>
        <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
          <StatsCard
            title="Total Doctors"
            value={doctors?.length || 0}
            icon={LocalHospitalIcon}
            color="primary"
          />
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
          <StatsCard
            title="Pending Verifications"
            value="5"
            icon={AdminPanelSettingsIcon}
            color="secondary"
          />
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
          <StatsCard
            title="Registered Patients"
            value={patients?.length || 0}
            icon={GroupIcon}
            color="success"
          />
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
          <StatsCard
            title="Medicines in Stock"
            value={medicines?.length || 0}
            icon={MedicationIcon}
            color="warning"
          />
        </Box>
      </Box>

      <Box sx={{
        backgroundColor: 'background.paper',
        p: 3,
        borderRadius: 2,
        boxShadow: 1,
      }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" href="/admin/doctor-verification">
            Verify Doctors
          </Button>
          <Button variant="contained" href="/admin/manage-medicines">
            Manage Medicines
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
