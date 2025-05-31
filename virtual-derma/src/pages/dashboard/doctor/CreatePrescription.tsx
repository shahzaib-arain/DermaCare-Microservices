import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  useForm,
  SubmitHandler,
  Controller,
  useFieldArray,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PrescriptionFormData, prescriptionSchema } from '../../../utils/validationSchemas';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useEffect, useState } from 'react';
import {
  createPrescription,
  getAllMedicines,
} from '../../../api/pharmacyService';
import {
  MedicineDTO,
  PrescriptionStatus,
} from '../../../types/pharmacyTypes';

type FormData = {
  patientId: string;
  items: Array<{
    medicineId: string;
    dosage: string;
    duration: string;
    instructions: string;
  }>;
};

export const CreatePrescription = () => {
  const { user, isAuthenticated } = useAuth();
  const [medicines, setMedicines] = useState<MedicineDTO[]>([]);
  const [loadingMedicines, setLoadingMedicines] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
  control,
  handleSubmit,
  formState: { errors, isSubmitting },
} = useForm<PrescriptionFormData>({
  resolver: yupResolver(prescriptionSchema),
  defaultValues: {
    patientId: '',
    items: [
      {
        medicineId: '',
        dosage: '',
        duration: '',
        instructions: '',
      },
    ],
  },
});
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoadingMedicines(true);
        const data = await getAllMedicines();
        setMedicines(data);
      } catch (error) {
        console.error('Failed to fetch medicines:', error);
        setError('Failed to load medicines list. Please try again later.');
      } finally {
        setLoadingMedicines(false);
      }
    };

    if (isAuthenticated) {
      fetchMedicines();
    }
  }, [isAuthenticated]);

const onSubmit: SubmitHandler<PrescriptionFormData> = async (data) => {
    try {
      setError(null);

      if (!isAuthenticated || !user) {
        throw new Error('Please login to create a prescription');
      }

      const prescriptionRequest = {
        patientId: data.patientId,
        doctorId: user.id,
        doctorName: `${user.firstName} ${user.lastName}`,
        status: 'ACTIVE' as PrescriptionStatus,
        items: data.items,
      };

      await createPrescription(prescriptionRequest);
      navigate('/doctor/create-prescription', { state: { success: true } });
    } catch (error) {
      console.error('Prescription creation failed:', error);
      setError('Failed to create prescription. Please try again.');
    }
  };

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: 1200,
        '& .MuiTextField-root': { mb: 2 },
      }}
    >
      <Typography variant="h5" gutterBottom>
        Create Prescription
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Controller
        name="patientId"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Patient ID"
            fullWidth
            error={!!errors.patientId}
            helperText={errors.patientId?.message}
          />
        )}
      />

      {fields.map((field, index) => (
        <Box key={field.id} display="flex" gap={2} alignItems="center">
          <Controller
            name={`items.${index}.medicineId`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Medicine"
                fullWidth
                error={!!errors.items?.[index]?.medicineId}
                helperText={errors.items?.[index]?.medicineId?.message}
              >
                {loadingMedicines ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} />
                  </MenuItem>
                ) : (
                  medicines.map((medicine) => (
                    <MenuItem key={medicine.id} value={medicine.id}>
                      {medicine.name}
                    </MenuItem>
                  ))
                )}
              </TextField>
            )}
          />

          <Controller
            name={`items.${index}.dosage`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Dosage"
                fullWidth
                error={!!errors.items?.[index]?.dosage}
                helperText={errors.items?.[index]?.dosage?.message}
              />
            )}
          />

          <Controller
            name={`items.${index}.duration`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Duration"
                fullWidth
                error={!!errors.items?.[index]?.duration}
                helperText={errors.items?.[index]?.duration?.message}
              />
            )}
          />

          <Controller
            name={`items.${index}.instructions`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Instructions"
                fullWidth
                error={!!errors.items?.[index]?.instructions}
                helperText={errors.items?.[index]?.instructions?.message}
              />
            )}
          />

          <IconButton
            onClick={() => remove(index)}
            disabled={fields.length === 1 || isSubmitting}
            color="error"
          >
            <RemoveCircleOutlineIcon />
          </IconButton>
        </Box>
      ))}

      <Button
        type="button"
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() =>
          append({
            medicineId: '',
            dosage: '',
            duration: '',
            instructions: '',
          })
        }
        disabled={isSubmitting}
        sx={{ mb: 3 }}
      >
        Add Medicine
      </Button>

      <Box>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Prescription'}
        </Button>
      </Box>
    </Box>
  );
};
