import { Box, Typography, Container, Grid, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const services = [
  {
    title: 'Virtual Consultations',
    description: 'Real-time video visits with board-certified dermatologists',
    details: 'Our secure platform allows you to meet with a dermatologist from anywhere. Perfect for follow-ups, medication management, and evaluating skin conditions that can be diagnosed visually.'
  },
  {
    title: 'Skin Condition Diagnosis',
    description: 'Expert evaluation of acne, eczema, psoriasis, and more',
    details: 'Upload photos of your skin concern and receive a professional diagnosis and treatment plan within 24 hours.'
  },
  {
    title: 'Prescription Services',
    description: 'Electronic prescriptions sent to your preferred pharmacy',
    details: 'If medication is needed, we can send prescriptions directly to your local pharmacy or recommend effective over-the-counter treatments.'
  },
  {
    title: 'Treatment Plans',
    description: 'Personalized care plans for chronic skin conditions',
    details: 'For conditions like eczema or psoriasis, we develop comprehensive long-term treatment strategies tailored to your specific needs.'
  }
];

export const Services = () => {
  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h3" gutterBottom>
        Our Services
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 6 }}>
        Comprehensive dermatological care delivered virtually
      </Typography>
      
      <Grid container spacing={4}>
        {services.map((service, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Accordion defaultExpanded={index === 0}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box>
                  <Typography variant="h5">{service.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {service.description}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{service.details}</Typography>
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6, p: 4, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Conditions We Treat
        </Typography>
        <Grid container spacing={2}>
          {[
            'Acne', 'Eczema', 'Psoriasis', 'Rosacea', 
            'Skin Infections', 'Rashes', 'Warts', 'Hair Loss',
            'Nail Disorders', 'Skin Cancer Screening', 'Allergic Reactions'
          ].map((condition) => (
            <Grid item xs={6} sm={4} md={3} key={condition}>
              <Typography variant="body1">• {condition}</Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};