// src/pages/dashboard/doctor/CreatePrescription.tsx
import { Box, Typography, TextField, Button, Autocomplete } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; // Added this import
import { useForm } from 'react-hook-form';
import { useApi } from '../../../hooks/useApi';
import { useEffect, useState } from 'react';
import { MedicineDTO, PrescriptionItemDTO } from '../../../types/pharmacyTypes';
import { createPrescription } from '../../../api/pharmacyService';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface FormData {
  patientId: string;
  items: Array<{
    medicineId: string;
    dosage: string;
    duration: string;
    instructions: string;
    quantity: number;
  }>;
}

export const CreatePrescription = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: medicines, fetchData: fetchMedicines } = useApi<MedicineDTO[]>();
  const [items, setItems] = useState<FormData['items']>([{
    medicineId: '',
    dosage: '',
    duration: '',
    instructions: '',
    quantity: 1
  }]);

  useEffect(() => {
    fetchMedicines({
      url: '/api/pharmacy/medicines',
      method: 'get'
    });
  }, [fetchMedicines]);

  const handleSubmit = async () => {
    if (!user?.id) return;

    try {
      await createPrescription({
        patientId: 'patient-id-here',
        items: items.map(item => ({
          medicineId: item.medicineId,
          dosage: item.dosage,
          quantity: item.quantity,
          instructions: item.instructions,
          duration: item.duration
        })),
        doctorId: user.id,
        doctorName: `${user.firstName} ${user.lastName}`,
        status: 'ACTIVE' as const
      }, user.id);
      navigate('/doctor/prescriptions');
    } catch (error) {
      console.error('Prescription creation failed:', error);
    }
  };

  const addItem = () => {
    setItems([...items, {
      medicineId: '',
      dosage: '',
      duration: '',
      instructions: '',
      quantity: 1
    }]);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const updateItem = (index: number, field: keyof FormData['items'][0], value: string | number) => {
    const newItems = [...items];
    newItems[index][field] = value as never;
    setItems(newItems);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create Prescription
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Prescribe medications for your patient
      </Typography>

      <Box 
        component="form" 
        onSubmit={(e) => { 
          e.preventDefault(); 
          handleSubmit(); 
        }}
        sx={{ width: '100%' }}
      >
        <TextField
          label="Patient ID"
          fullWidth
          value="patient-id-here"
          sx={{ mb: 3 }}
          disabled
        />

        {items.map((item, index) => (
          <Box 
            key={index} 
            sx={{
              p: 3,
              mb: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1
            }}
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                <Autocomplete
                  options={medicines || []}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} label="Medicine" required />
                  )}
                  onChange={(_, value) => updateItem(index, 'medicineId', value?.id || '')}
                />
              </Box>
              
              <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <TextField
                  label="Dosage"
                  fullWidth
                  value={item.dosage}
                  onChange={(e) => updateItem(index, 'dosage', e.target.value)}
                  required
                />
              </Box>
              
              <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <TextField
                  label="Duration"
                  fullWidth
                  value={item.duration}
                  onChange={(e) => updateItem(index, 'duration', e.target.value)}
                  required
                />
              </Box>
              
              <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <TextField
                  label="Quantity"
                  type="number"
                  fullWidth
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                  required
                  inputProps={{ min: 1 }}
                />
              </Box>
              
              <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                <TextField
                  label="Instructions"
                  fullWidth
                  value={item.instructions}
                  onChange={(e) => updateItem(index, 'instructions', e.target.value)}
                  required
                  multiline
                  rows={2}
                />
              </Box>
            </Box>

            {items.length > 1 && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  color="error" 
                  onClick={() => removeItem(index)}
                  variant="outlined"
                >
                  Remove Item
                </Button>
              </Box>
            )}
          </Box>
        ))}

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button 
            variant="outlined" 
            onClick={addItem}
            startIcon={<AddIcon />}
          >
            Add Another Medicine
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            size="large"
          >
            Create Prescription
          </Button>
        </Box>
      </Box>
    </Box>
  );
};