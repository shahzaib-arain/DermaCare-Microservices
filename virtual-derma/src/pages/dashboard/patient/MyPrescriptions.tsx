// src/pages/dashboard/patient/MyPrescriptions.tsx
import { 
  Box, 
  Typography, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  List, 
  ListItem, 
  ListItemText, 
  Button 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useApi } from '../../../hooks/useApi';
import { useAuth } from '../../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { PrescriptionDTO, PrescriptionItemDTO } from '../../../types/pharmacyTypes';
import { formatDate } from '../../../utils/dateUtils';

export const MyPrescriptions = () => {
  const { user } = useAuth();
  const { data: prescriptions, fetchData: fetchPrescriptions } = useApi<PrescriptionDTO[]>();
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    if (user?.id) {
      fetchPrescriptions({
        url: `/api/pharmacy/prescription/patient/${user.id}`,
        method: 'get',
      });
    }
  }, [user, fetchPrescriptions]);

  const handleOrderMedicines = (prescriptionId: string) => {
    // Implement order functionality here
    console.log(`Ordering medicines for prescription ${prescriptionId}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Prescriptions
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        View your current and past medication prescriptions
      </Typography>

      {prescriptions?.length === 0 && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          You don't have any prescriptions yet.
        </Typography>
      )}

      {prescriptions?.map((prescription) => (
        <Accordion 
          key={prescription.id} 
          expanded={expanded === prescription.id}
          onChange={handleChange(prescription.id)}
          sx={{ mb: 2 }}
        >
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
            {prescription.notes && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Notes: {prescription.notes}
              </Typography>
            )}
            <List dense>
              {prescription.items.map((item: PrescriptionItemDTO, index: number) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${item.medicineName || 'Medicine'} - ${item.dosage}`}
                    secondary={`Quantity: ${item.quantity}${item.instructions ? ` • ${item.instructions}` : ''}`}
                  />
                </ListItem>
              ))}
            </List>
            <Button 
              variant="contained" 
              sx={{ mt: 2 }} 
              disabled={prescription.status !== 'ACTIVE'}
              onClick={() => handleOrderMedicines(prescription.id)}
            >
              Order Medicines
            </Button>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};