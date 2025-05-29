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

const featuredDoctors: DoctorWithPhoto[] = [
  {
    id: "1", // ✅ Add this line
    doctorId: "1",
    fullName: "Dr. John Smith",
    email: "john.smith@example.com",
    phone: "555-1000",
    degreeNumber: "MD100001",
    specialization: "General Dermatologist",
    verified: true,
    photoUrl: "/images/doctors/1.jpg",
  },
  {
    id: "2", // ✅ Add this line
    doctorId: "2",
    fullName: "Dr. Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "555-2000",
    degreeNumber: "MD200002",
    specialization: "Pediatric Dermatology",
    verified: true,
    photoUrl: "/images/doctors/2.jpg",
  },
  {
    id: "3", // ✅ Add this line
    doctorId: "3",
    fullName: "Dr. Michael Chen",
    email: "michael.chen@example.com",
    phone: "555-3000",
    degreeNumber: "MD300003",
    specialization: "Cosmetic Dermatology",
    verified: true,
    photoUrl: "/images/doctors/3.jpg",
  },
];


// AnimatedGridItem component
const AnimatedGridItem = ({ children, ...props }: any) => (
  <Grid item component={motion.div} {...props}>
    {children}
  </Grid>
);

export const Home = () => {
  return (
    <Box sx={{ width: '100%', overflowX: 'hidden', maxWidth: '100vw' }}>
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
        <Container maxWidth="lg">
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
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700, mb: 2 }}
        >
          Conditions We Treat
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}
        >
          Our specialists provide virtual care for a wide range of skin conditions
        </Typography>

        <TreatmentSlider />

        <Grid
          container
          spacing={4}
          sx={{
            mt: 2,
            justifyContent: 'center',
            overflowX: 'hidden',
            width: '100%',
            margin: 0,
          }}
        >
          {diseases.map((disease, index) => (
            <AnimatedGridItem
              key={disease.name}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 350,
                  height: 300,
                  backgroundImage: `url(${disease.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 2,
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: 3,
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
                    p: 3,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {disease.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ lineHeight: 1.5, fontSize: '0.875rem' }}
                  >
                    {disease.description}
                  </Typography>
                </Box>
              </Box>
            </AnimatedGridItem>
          ))}
        </Grid>
      </Container>

      {/* Doctors Section */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: 6, overflowX: 'hidden' }}>
        <Container maxWidth="xl">
          <Typography variant="h3" align="center" gutterBottom>
            Our Specialist Doctors
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 6 }}>
            Board-certified dermatologists available for virtual consultations
          </Typography>

          <Grid container spacing={4} justifyContent="center">
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
        <Container maxWidth="md">
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
