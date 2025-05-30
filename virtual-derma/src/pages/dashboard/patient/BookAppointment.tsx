import { Box, Typography, TextField, Button, MenuItem } from '@mui/material';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { appointmentSchema } from '../../../utils/validationSchemas';
import { useAuth } from '../../../contexts/AuthContext';
import { DoctorVerificationDTO } from '../../../types/userTypes';
import { useNavigate } from 'react-router-dom';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import apiClient from '../../../api/apiClient';

interface FormData {
  doctorId: string;
  date: Date;
  time: Date;
  reason: string;
}

export const BookAppointment = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<DoctorVerificationDTO[]>([]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm<FormData>({
    resolver: yupResolver(appointmentSchema as any),
    defaultValues: {
      date: new Date(),
      time: new Date(new Date().setHours(9, 0, 0, 0)) // Default 9:00 AM
    }
  });

  useEffect(() => {
    if (user?.token) {
      apiClient
        .get<DoctorVerificationDTO[]>('/api/patient/doctors', {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        .then((response) => setDoctors(response.data))
        .catch((error) => console.error('Failed to fetch doctors:', error));
    }
  }, [user?.token]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!user?.id || !user.token) {
      console.error('User ID or token is missing');
      return;
    }

    const appointmentTime = new Date(data.date);
    appointmentTime.setHours(data.time.getHours());
    appointmentTime.setMinutes(data.time.getMinutes());

    const appointmentRequest = {
      doctorId: data.doctorId,
      appointmentTime: appointmentTime.toISOString(),
      reason: data.reason,
      patientId: user.id,
      durationMinutes: 30
    };

    try {
      await apiClient.post('/api/appointment/book', appointmentRequest, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      navigate('/patient/appointments', { state: { success: true } });
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Book Appointment
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Schedule a virtual consultation with our specialists
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            maxWidth: 600,
            '& .MuiTextField-root': { mb: 2 }
          }}
        >
          {/* Doctor Select */}
          <TextField
            select
            label="Select Doctor"
            fullWidth
            variant="outlined"
            {...register('doctorId')}
            error={!!errors.doctorId}
            helperText={errors.doctorId?.message}
          >
            {doctors.length > 0 ? (
              doctors.map((doc, index) => (
                <MenuItem
                  key={doc.id != null ? doc.id.toString() : `index-${index}`}
                  value={doc.id != null ? doc.id.toString() : `doc-${index}`}
                >
                  {doc.fullName}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No doctors available</MenuItem>
            )}
          </TextField>

          {/* Reason */}
          <TextField
            label="Reason for Appointment"
            fullWidth
            variant="outlined"
            {...register('reason')}
            error={!!errors.reason}
            helperText={errors.reason?.message}
          />

          {/* Date Picker */}
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Select Date"
                value={dayjs(field.value)}
                onChange={(newValue) => field.onChange(newValue?.toDate())}
              />
            )}
          />

          {/* Time Picker */}
          <Controller
            name="time"
            control={control}
            render={({ field }) => (
              <TimePicker
                label="Select Time"
                value={dayjs(field.value)}
                onChange={(newValue) => field.onChange(newValue?.toDate())}
              />
            )}
          />

          <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
            Book Appointment
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};
