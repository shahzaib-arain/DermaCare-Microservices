import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { DoctorCard } from '../../components/ui/DoctorCard';
import { TreatmentSlider } from '../../components/ui/TreatmentSlider';
import { FeedbackCarousel } from '../../components/ui/FeedbackCarousel';
import { motion } from 'framer-motion';
import { DoctorVerificationDTO } from '../../types';

// Extend DoctorVerificationDTO to include photoUrl
type DoctorWithPhoto = DoctorVerificationDTO & {
  photoUrl: string;
};

// Types for diseases and doctors
type Disease = {
  name: string;
  description: string;
  image: string;
};

const diseases: Disease[] = [
  {
    name: "Acne",
    description: "Effective treatments for acne breakouts and scars.",
    image: "/images/acne.jpg",
  },
  {
    name: "Eczema",
    description: "Gentle care and management of eczema symptoms.",
    image: "/images/eczema.jpg",
  },
  {
    name: "Psoriasis",
    description: "Relief for chronic psoriasis flare-ups.",
    image: "/images/psoriasis.jpg",
  },
  {
    name: "Rosacea",
    description: "Control redness and inflammation with expert care.",
    image: "/images/rosacea.jpg",
  },
];

// Use the extended type here
const featuredDoctors: DoctorWithPhoto[] = [
  {
    doctorId: "d1",
    fullName: "Dr. Jane Smith",
    email: "jane.smith@example.com",
    phone: "555-1234",
    degreeNumber: "MD123456",
    specialization: "Dermatologist",
    verified: true,
    photoUrl: "/images/doctors/jane_smith.jpg",
  },
  {
    doctorId: "d2",
    fullName: "Dr. John Doe",
    email: "john.doe@example.com",
    phone: "555-5678",
    degreeNumber: "MD789012",
    specialization: "Skin Specialist",
    verified: false,
    photoUrl: "/images/doctors/john_doe.jpg",
  },
  {
    doctorId: "d3",
    fullName: "Dr. Emily Clark",
    email: "emily.clark@example.com",
    phone: "555-9012",
    degreeNumber: "MD345678",
    specialization: "Cosmetic Dermatologist",
    verified: true,
    photoUrl: "/images/doctors/emily_clark.jpg",
  },
];

// AnimatedGridItem component with motion and MUI Grid
const AnimatedGridItem = ({ children, ...props }: any) => (
  <Grid item component={motion.div} {...props}>
    {children}
  </Grid>
);

export const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(/images/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          py: 10,
          textAlign: 'center',
        }}
      >
        <Container>
          <Typography
            variant="h2"
            component={motion.h1}
            gutterBottom
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Virtual Dermatology Care
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
            Expert skin care from the comfort of your home
          </Typography>
          <Button variant="contained" size="large" color="secondary">
            Book a Consultation
          </Button>
        </Container>
      </Box>

      {/* Diseases Section */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Conditions We Treat
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 6 }}>
          Our specialists provide virtual care for a wide range of skin conditions
        </Typography>

        <TreatmentSlider />

        <Grid container spacing={4} sx={{ mt: 2 }}>
          {diseases.map((disease, index) => (
            <AnimatedGridItem
              key={disease.name}
              xs={12}
              sm={6}
              md={3}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Box
                sx={{
                  height: 300,
                  backgroundImage: `url(${disease.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 2,
                  position: 'relative',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    transition: 'transform 0.3s ease',
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    p: 2,
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                  }}
                >
                  <Typography variant="h6">{disease.name}</Typography>
                  <Typography variant="body2">{disease.description}</Typography>
                </Box>
              </Box>
            </AnimatedGridItem>
          ))}
        </Grid>
      </Container>

      {/* Doctors Section */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: 6 }}>
        <Container>
          <Typography variant="h3" align="center" gutterBottom>
            Our Specialist Doctors
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 6 }}>
            Board-certified dermatologists available for virtual consultations
          </Typography>

          <Grid container spacing={4}>
            {featuredDoctors.map((doctor, index) => (
              <AnimatedGridItem
                key={doctor.doctorId}
                xs={12}
                sm={6}
                md={4}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <DoctorCard
                  doctor={doctor}
                  onBookAppointment={() => console.log('Book appointment for', doctor.fullName)}
                />
              </AnimatedGridItem>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Container sx={{ py: 6 }}>
        <FeedbackCarousel />
      </Container>

      {/* Call to Action */}
      <Box
        sx={{
          backgroundImage: 'linear-gradient(to right, #1976d2, #2196f3)',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container>
          <Typography variant="h4" component="h2" gutterBottom>
            Ready for healthier skin?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Book your virtual dermatology appointment today.
          </Typography>
          <Button variant="contained" size="large" color="secondary">
            Book Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
};
