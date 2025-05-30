import {
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MedicineDTO } from '../../../types/pharmacyTypes';
import { createPrescription } from '../../../api/pharmacyService';
import apiClient from '../../../api/apiClient';

interface PrescriptionItem {
  medicineId: string;
  dosage: string;
  duration: string;
  instructions: string;
  quantity: number;
}

export const CreatePrescription = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState<MedicineDTO[]>([]);
  const [items, setItems] = useState<PrescriptionItem[]>([
    { medicineId: '', dosage: '', duration: '', instructions: '', quantity: 1 },
  ]);
  const [patientId, setPatientId] = useState('patient-id-here'); // You can modify this to come from props or route params

  // Fetch medicines list
  useEffect(() => {
    if (user?.token) {
      apiClient
        .get<MedicineDTO[]>('/api/pharmacy/medicines', {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((res) => setMedicines(res.data))
        .catch((err) => console.error('Failed to fetch medicines:', err));
    }
  }, [user]);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { medicineId: '', dosage: '', duration: '', instructions: '', quantity: 1 },
    ]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: keyof PrescriptionItem,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      await createPrescription(
        {
          patientId,
          doctorId: user.id,
          doctorName: `${user.firstName} ${user.lastName}`,
          items: items.map((item) => ({
            medicineId: item.medicineId,
            dosage: item.dosage,
            duration: item.duration,
            instructions: item.instructions,
            quantity: item.quantity,
          })),
          status: 'ACTIVE',
        },
        user.id
      );
      navigate('/doctor/prescriptions');
    } catch (error) {
      console.error('Failed to create prescription:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create Prescription
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Prescribe medications for your patient
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        <TextField
          label="Patient ID"
          fullWidth
          value={patientId}
          disabled
          sx={{ mb: 3 }}
        />

        {items.map((item, index) => (
          <Box
            key={index}
            sx={{
              p: 3,
              mb: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
            }}
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                <Autocomplete
                  options={medicines}
                  getOptionLabel={(option) => option.name}
                  value={medicines.find((m) => m.id === item.medicineId) || null}
                  onChange={(_, value) =>
                    updateItem(index, 'medicineId', value?.id || '')
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Medicine" required />
                  )}
                />
              </Box>

              <TextField
                label="Dosage"
                value={item.dosage}
                onChange={(e) => updateItem(index, 'dosage', e.target.value)}
                required
                sx={{ flex: '1 1 200px', minWidth: '200px' }}
              />

              <TextField
                label="Duration"
                value={item.duration}
                onChange={(e) => updateItem(index, 'duration', e.target.value)}
                required
                sx={{ flex: '1 1 200px', minWidth: '200px' }}
              />

              <TextField
                label="Quantity"
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(index, 'quantity', Math.max(1, Number(e.target.value)))
                }
                inputProps={{ min: 1 }}
                required
                sx={{ flex: '1 1 150px', minWidth: '150px' }}
              />

              <TextField
                label="Instructions"
                value={item.instructions}
                onChange={(e) => updateItem(index, 'instructions', e.target.value)}
                required
                multiline
                rows={2}
                sx={{ flex: '1 1 300px', minWidth: '300px' }}
              />

              {items.length > 1 && (
                <IconButton
                  color="error"
                  onClick={() => removeItem(index)}
                  aria-label="Remove item"
                >
                  <RemoveCircleOutlineIcon />
                </IconButton>
              )}
            </Box>
          </Box>
        ))}

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addItem}
          sx={{ mb: 3 }}
        >
          Add Medicine
        </Button>

        <Box>
          <Button type="submit" variant="contained" size="large">
            Submit Prescription
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
