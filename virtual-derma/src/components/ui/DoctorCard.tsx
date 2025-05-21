import { Card, CardContent, CardMedia, Typography, Button, Box, Rating } from '@mui/material';
import { DoctorVerificationDTO } from '../../types/userTypes';

interface DoctorCardProps {
  doctor: DoctorVerificationDTO;
  onBookAppointment?: () => void;
}

export const DoctorCard = ({ doctor, onBookAppointment }: DoctorCardProps) => {
  return (
    <Card sx={{ maxWidth: 345, m: 2, boxShadow: 3 }}>
      <CardMedia
        component="img"
        height="200"
        image={`/images/doctors/${doctor.doctorId}.jpg`} // Replace with your image path
        alt={doctor.fullName}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {doctor.fullName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {doctor.specialization}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Rating value={4.5} precision={0.5} readOnly />
          <Typography variant="body2" sx={{ ml: 1 }}>
            (24 reviews)
          </Typography>
        </Box>
        {onBookAppointment && (
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={onBookAppointment}
          >
            Book Appointment
          </Button>
        )}
      </CardContent>
    </Card>
  );
};