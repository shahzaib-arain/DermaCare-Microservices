import { Card, CardContent, CardMedia, Typography, Button, Box, Rating, SxProps, Theme } from '@mui/material';
import { DoctorVerificationDTO } from '../../types/userTypes';

interface DoctorCardProps {
  doctor: DoctorVerificationDTO & { photoUrl?: string };
  onBookAppointment?: () => void;
  sx?: SxProps<Theme>;
}

export const DoctorCard = ({ doctor, onBookAppointment, sx = {} }: DoctorCardProps) => {
  // Determine the image path based on doctorId
  const imageUrl = `/images/doctors/${doctor.doctorId}.jpg`;
  
 return (
    <Card 
      sx={{ 
        maxWidth: 345, 
        m: 2, 
        boxShadow: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...sx
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={imageUrl}
        alt={doctor.fullName}
        sx={{
          objectFit: 'cover',
          width: '100%'
        }}
        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
          const target = e.target as HTMLImageElement;
          // Fallback to a default image if needed
          target.src = '/images/doctors/default-doctor.jpg';
        }}
      />
      {/* Rest of the card content remains the same */}
      <CardContent sx={{ flexGrow: 1 }}>
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