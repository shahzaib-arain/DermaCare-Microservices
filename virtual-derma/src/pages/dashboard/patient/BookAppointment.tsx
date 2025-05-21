import { Box, Typography, Grid, TextField, Button, MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';
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

interface FormData {
  doctorId: string;
  date: Date;
  time: Date;
  reason: string;
}

export const BookAppointment = () => {
  const { user } = useAuth();
  const { data: doctors, fetchData: fetchDoctors } = useApi<DoctorVerificationDTO[]>();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: yupResolver(appointmentSchema)
  });

  useEffect(() => {
    fetchDoctors({
      url: '/api/patient/doctors',
      method: 'get'
    });
  }, [fetchDoctors]);

  const onSubmit = async (data: FormData) => {
    if (!user?.id) return;
    
    const appointmentTime = new Date(data.date);
    appointmentTime.setHours(data.time.getHours());
    appointmentTime.setMinutes(data.time.getMinutes());

    try {
      await bookAppointment({
        doctorId: data.doctorId,
        appointmentTime: appointmentTime.toISOString(),
        reason: data.reason
      }, user.id);
      navigate('/patient/appointments');
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Book Appointment
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Schedule a virtual consultation with our specialists
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 600 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              select
              label="Select Doctor"
              fullWidth
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
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Appointment Date"
              minDate={dayjs()}
              onChange={(date) => setValue('date', date?.toDate() || new Date())}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.date,
                  helperText: errors.date?.message
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TimePicker
              label="Appointment Time"
              ampm={false}
              minutesStep={15}
              onChange={(time) => setValue('time', time?.toDate() || new Date())}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.time,
                  helperText: errors.time?.message
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Reason for Visit"
              multiline
              rows={4}
              fullWidth
              {...register('reason')}
              error={!!errors.reason}
              helperText={errors.reason?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" size="large">
              Book Appointment
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};