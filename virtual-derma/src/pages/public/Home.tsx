import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { DoctorCard } from '../../components/ui/DoctorCard';
import { TreatmentSlider } from '../../components/ui/TreatmentSlider';
import { FeedbackCarousel } from '../../components/ui/FeedbackCarousel';

// Hardcoded data - replace with API calls as needed
const featuredDoctors = [
  {
    doctorId: '1',
    fullName: 'Dr. Sarah Johnson',
    specialization: 'Acne Specialist',
    degreeNumber: 'MD12345',
    email: 's.johnson@dermacare.com',
    phone: '+1234567890',
    verified: true
  },
  {
    doctorId: '2',
    fullName: 'Dr. Michael Chen',
    specialization: 'Eczema Expert',
    degreeNumber: 'MD67890',
    email: 'm.chen@dermacare.com',
    phone: '+1987654321',
    verified: true
  },
  {
    doctorId: '3',
    fullName: 'Dr. Emma Williams',
    specialization: 'Psoriasis Specialist',
    degreeNumber: 'MD54321',
    email: 'e.williams@dermacare.com',
    phone: '+1122334455',
    verified: true
  }
];

const diseases = [
  {
    name: 'Acne',
    description: 'Comprehensive virtual treatment for all acne types',
    image: '/images/treatments/acne.jpg'
  },
  {
    name: 'Eczema',
    description: 'Personalized care plans for eczema management',
    image: '/images/treatments/eczema.jpg'
  },
  {
    name: 'Psoriasis',
    description: 'Advanced treatment options for psoriasis',
    image: '/images/treatments/psoriasis.jpg'
  },
  {
    name: 'Rosacea',
    description: 'Specialized care for rosacea symptoms',
    image: '/images/treatments/rosacea.jpg'
  }
];

export const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), url(/images/hero-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        py: 10,
        textAlign: 'center'
      }}>
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
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
          {diseases.map((disease) => (
            <Grid item xs={12} sm={6} md={3} key={disease.name}>
              <Box sx={{
                height: 300,
                backgroundImage: `url(${disease.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 2,
                position: 'relative',
                '&:hover': {
                  transform: 'scale(1.03)',
                  transition: 'transform 0.3s ease'
                }
              }}>
                <Box sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  bgcolor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  p: 2,
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8
                }}>
                  <Typography variant="h6">{disease.name}</Typography>
                  <Typography variant="body2">{disease.description}</Typography>
                </Box>
              </Box>
            </Grid>
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
            {featuredDoctors.map((doctor) => (
              <Grid item xs={12} sm={6} md={4} key={doctor.doctorId}>
                <DoctorCard 
                  doctor={doctor} 
                  onBookAppointment={() => console.log('Book appointment for', doctor.fullName)}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Container sx={{ py: 6 }}>
        <FeedbackCarousel />
      </Container>

      {/* Call to Action */}
      <Box sx={{
        backgroundImage: 'linear-gradient(to right, #1976d2, #2196f3)',
        color: 'white',
        py: 8,
        textAlign: 'center'
      }}>
        <Container>
          <Typography variant="h4" component="h2" gutterBottom>
            Ready for healthier skin?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Start your virtual dermatology journey today
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            color="secondary"
            sx={{ 
              px: 6,
              fontSize: '1.1rem'
            }}
          >
            Get Started
          </Button>
        </Container>
      </Box>
    </Box>
  );
};