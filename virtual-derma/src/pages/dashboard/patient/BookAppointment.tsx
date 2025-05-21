import { Box, Typography, TextField, Button, MenuItem } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { appointmentSchema } from '../../../utils/validationSchemas';
import { useApi } from '../../../hooks/useApi';
import { useAuth } from '../../../contexts/AuthContext';
import { DoctorVerificationDTO } from '../../../types/userTypes';
import { bookAppointment } from '../../../api/appointmentService';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { useEffect } from 'react';

interface FormData {
  doctorId: string;
  date: Date;
  time: Date;
  reason: string;
}

interface AppointmentRequest {
  doctorId: string;
  appointmentTime: string;
  reason: string;
  patientId: string;
  durationMinutes: number;
}

export const BookAppointment = () => {
  const { user } = useAuth();
  const { data: doctors, fetchData: fetchDoctors } = useApi<DoctorVerificationDTO[]>();
  const navigate = useNavigate();

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setValue,
    control
  } = useForm<FormData>({
    resolver: yupResolver(appointmentSchema as any), // Temporary workaround
    defaultValues: {
      date: new Date(),
      time: new Date(new Date().setHours(9, 0, 0, 0)) // Default to 9:00 AM
    }
  });

  useEffect(() => {
    fetchDoctors({
      url: '/api/patient/doctors',
      method: 'get',
      headers: {
        Authorization: `Bearer ${user?.token}`
      }
    });
  }, [fetchDoctors, user?.token]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!user?.id || !user.token) {
      console.error('User ID or token is missing');
      return;
    }

    const appointmentTime = new Date(data.date);
    appointmentTime.setHours(data.time.getHours());
    appointmentTime.setMinutes(data.time.getMinutes());

    const appointmentRequest: AppointmentRequest = {
      doctorId: data.doctorId,
      appointmentTime: appointmentTime.toISOString(),
      reason: data.reason,
      patientId: user.id,
      durationMinutes: 30 // Default duration
    };

    try {
      await bookAppointment(appointmentRequest, user.token);
      navigate('/patient/appointments', { state: { success: true } });
    } catch (error) {
      console.error('Booking failed:', error);
      // Optionally show error to user
    }
  };

  return (
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
          {doctors?.map((doctor) => (
            <MenuItem key={doctor.doctorId} value={doctor.doctorId}>
              {doctor.fullName} - {doctor.specialization}
            </MenuItem>
          ))}
        </TextField>

        {/* Date & Time Pickers */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <DatePicker
            label="Appointment Date"
            minDate={dayjs()}
            onChange={(date) => setValue('date', date?.toDate() || new Date())}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!errors.date,
                helperText: errors.date?.message,
              }
            }}
          />

          <TimePicker
            label="Appointment Time"
            ampm={false}
            minutesStep={15}
            onChange={(time) => setValue('time', time?.toDate() || new Date())}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!errors.time,
                helperText: errors.time?.message,
              }
            }}
          />
        </Box>

        {/* Reason for Visit */}
        <TextField
          label="Reason for Visit"
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          {...register('reason')}
          error={!!errors.reason}
          helperText={errors.reason?.message}
        />

        {/* Submit Button */}
        <Button 
          type="submit" 
          variant="contained" 
          size="large" 
          fullWidth
          sx={{ mt: 2 }}
        >
          Book Appointment
        </Button>
      </Box>
    </Box>
  );
};