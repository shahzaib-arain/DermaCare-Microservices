import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Accordion, AccordionSummary, AccordionDetails,
  List, ListItem, ListItemText, Button, Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useApi } from '../../../hooks/useApi';
import { useAuth } from '../../../contexts/AuthContext';
import { PrescriptionDTO, PrescriptionItemDTO, MedicineDTO } from '../../../types/pharmacyTypes';
import { formatDate } from '../../../utils/dateUtils';
import apiClient from '../../../api/apiClient';

export const MyPrescriptions = () => {
  const { user } = useAuth();
  const { data: prescriptions, fetchData: fetchPrescriptions } = useApi<PrescriptionDTO[]>();
  const [medicines, setMedicines] = useState<MedicineDTO[]>([]);
  const [expanded, setExpanded] = useState<string | false>(false);

  useEffect(() => {
    if (user?.email) {
      fetchPrescriptions({
        url: `/dermacare-service/api/pharmacy/prescription/patient/${user.email}`,
        method: 'get'
      });

      apiClient.get<MedicineDTO[]>('/dermacare-service/api/pharmacy/medicines')
        .then(res => setMedicines(res.data))
        .catch(err => console.error('Failed to fetch medicines:', err));
    }
  }, [user, fetchPrescriptions]);

  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleOrderMedicines = async (prescriptionId: string) => {
    try {
      await apiClient.post(`/dermacare-service/api/pharmacy/order/${prescriptionId}`);
      alert('Medicines ordered successfully!');
    } catch (error) {
      console.error('Error ordering medicines:', error);
      alert('Failed to order medicines.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>My Prescriptions</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        View your current and past medication prescriptions
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>All Available Medicines</Typography>
        {medicines.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No medicines available.</Typography>
        ) : (
          <List dense sx={{ maxHeight: 200, overflowY: 'auto', bgcolor: '#f9f9f9' }}>
            {medicines.map((med) => (
              <ListItem key={med.id}>
                <ListItemText
                  primary={med.name}
                  secondary={med.description || `Type: ${med.type || 'N/A'}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      <Divider sx={{ mb: 4 }} />

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
