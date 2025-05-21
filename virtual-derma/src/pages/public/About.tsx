import { Box, Typography, Container, Grid } from '@mui/material';

export const About = () => {
  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h3" gutterBottom>
        About Virtual DermaCare
      </Typography>
      <Typography variant="body1" paragraph>
        Virtual DermaCare is revolutionizing dermatology by bringing expert skin care directly to you through our secure, easy-to-use virtual platform.
      </Typography>
      
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            Our Mission
          </Typography>
          <Typography variant="body1" paragraph>
            To make high-quality dermatological care accessible, affordable, and convenient for everyone, regardless of location.
          </Typography>
          <Typography variant="body1" paragraph>
            We believe that everyone deserves access to expert skin care without the hassle of long wait times or travel.
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            How It Works
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li><Typography variant="body1">Book a virtual appointment with a board-certified dermatologist</Typography></li>
            <li><Typography variant="body1">Upload images of your skin concern</Typography></li>
            <li><Typography variant="body1">Have your video consultation</Typography></li>
            <li><Typography variant="body1">Receive diagnosis and treatment plan</Typography></li>
            <li><Typography variant="body1">Get prescriptions delivered to your pharmacy</Typography></li>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6, backgroundColor: '#f5f5f5', p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Our Team
        </Typography>
        <Typography variant="body1" paragraph>
          Our dermatologists are all board-certified with extensive experience in treating a wide range of skin conditions. They undergo rigorous training in telemedicine to ensure you receive the same quality of care as an in-person visit.
        </Typography>
      </Box>
    </Container>
  );
};