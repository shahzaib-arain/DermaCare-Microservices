import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useApi } from '../../../hooks/useApi';
import { useAuth } from '../../../contexts/AuthContext';
import { useEffect } from 'react';
import { PrescriptionDTO } from '../../../types/pharmacyTypes';
import { formatDate } from '../../../utils/dateUtils';

export const MyPrescriptions = () => {
  const { user } = useAuth();
  const { data: prescriptions, fetchData: fetchPrescriptions } = useApi<PrescriptionDTO[]>();

  useEffect(() => {
    if (user?.id) {
      fetchPrescriptions({
        url: `/api/pharmacy/prescription/patient/${user.id}`,
        method: 'get',
      });
    }
  }, [user, fetchPrescriptions]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Prescriptions
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        View your current and past medication prescriptions
      </Typography>

      {prescriptions?.map((prescription) => (
        <Accordion key={prescription.id} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Prescription #{prescription.id.slice(0, 8)}</Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDate(prescription.dateCreated)} • {prescription.status}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle1" gutterBottom>
              Prescribed by: {prescription.doctorName}
            </Typography>
            <List>
              {prescription.items.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${item.medicineName ?? 'Unknown Medicine'} - ${item.dosage}`}
                    secondary={`${item.duration} • ${item.instructions}`}
                  />
                </ListItem>
              ))}
            </List>
            <Button variant="outlined" sx={{ mt: 2 }} disabled={prescription.status !== 'ACTIVE'}>
              Order Medicines
            </Button>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};
