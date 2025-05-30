import { Box, Typography, TextField, Button, MenuItem, CircularProgress } from '@mui/material';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { appointmentSchema } from '../../../utils/validationSchemas';
import { useAuth } from '../../../contexts/AuthContext';
import { DoctorVerificationDTO } from '../../../types/userTypes';
import { useNavigate } from 'react-router-dom';
import { DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import apiClient from '../../../api/apiClient';
import { bookAppointment } from '../../../api/appointmentService';

type FormData = {
  doctorId: string;
  appointmentTime: Date;
  reason: string;
};

export const BookAppointment = () => {
  const { user, isAuthenticated } = useAuth();
  const [doctors, setDoctors] = useState<DoctorVerificationDTO[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<FormData>({
    resolver: yupResolver(appointmentSchema),
    defaultValues: {
      doctorId: '',
      appointmentTime: new Date(new Date().setHours(9, 0, 0, 0)),
      reason: ''
    }
  });

  const selectedDoctorId = watch('doctorId');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        const response = await apiClient.get<DoctorVerificationDTO[]>('/user-service/api/patient/doctors');
        setDoctors(response.data);
        
        // Auto-select the first doctor if available
        if (response.data.length > 0 && !selectedDoctorId) {
          setValue('doctorId', response.data[0].doctorId.toString());
        }
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
        setError('Failed to load doctors list. Please try again later.');
      } finally {
        setLoadingDoctors(false);
      }
    };

    if (isAuthenticated) {
      fetchDoctors();
    }
  }, [isAuthenticated, setValue, selectedDoctorId]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setError(null);
      
      if (!isAuthenticated || !user) {
        throw new Error('Please login to book an appointment');
      }

      console.log('Form submission data:', data); // Debug log

      const appointmentRequest = {
        doctorId: data.doctorId,
        appointmentTime: data.appointmentTime.toISOString(),
        reason: data.reason,
        patientId: user.id,
        durationMinutes: 30
      };

      await bookAppointment(appointmentRequest);
      navigate('/patient/appointments', { state: { success: true } });
    } catch (error) {
      console.error('Booking failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to book appointment');
    }
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Please login to book an appointment
        </Typography>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Book Appointment
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Schedule a virtual consultation with our specialists
        </Typography>

        {error && (
          <Box sx={{ color: 'error.main', mb: 2 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            maxWidth: 600,
            '& .MuiTextField-root': { mb: 2 }
          }}
        >
          <Controller
            name="doctorId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Select Doctor"
                fullWidth
                variant="outlined"
                error={!!errors.doctorId}
                helperText={errors.doctorId?.message || ' '}
                disabled={isSubmitting || loadingDoctors}
                InputProps={{
                  endAdornment: loadingDoctors ? <CircularProgress size={20} /> : null,
                }}
              >
                {doctors.length > 0 ? (
                  doctors.map((doc) => (
                    <MenuItem key={doc.id} value={doc.doctorId.toString()}>
                      {doc.fullName} ({doc.specialization})
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    {loadingDoctors ? 'Loading doctors...' : 'No doctors available'}
                  </MenuItem>
                )}
              </TextField>
            )}
          />

          <Controller
            name="reason"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Reason for Appointment"
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                error={!!errors.reason}
                helperText={errors.reason?.message}
                disabled={isSubmitting}
              />
            )}
          />

          <Controller
            name="appointmentTime"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                label="Appointment Date & Time"
                value={dayjs(field.value)}
                onChange={(newValue) => {
                  if (newValue) field.onChange(newValue.toDate());
                }}
                minDateTime={dayjs().add(1, 'hour')}
                disablePast
                disabled={isSubmitting}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.appointmentTime,
                    helperText: errors.appointmentTime?.message
                  }
                }}
              />
            )}
          />

          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
            disabled={isSubmitting || !selectedDoctorId}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Book Appointment'}
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};