import { Box, Typography, Container, Grid, TextField, Button } from '@mui/material';
import { LocationOn, Email, Phone } from '@mui/icons-material';
import { motion } from 'framer-motion';

const AnimatedGridItem = ({ children, ...props }: any) => (
  <Grid item component={motion.div} {...props}>
    {children}
  </Grid>
);

export const Contact = () => {
  return (
    <Container sx={{ py: 6 }}>
      <Typography 
        variant="h3" 
        gutterBottom
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Contact Us
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 6 }}>
        We're here to help with any questions you may have
      </Typography>
      
      <Grid container spacing={6}>
        <AnimatedGridItem xs={12} md={6}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box component="form" sx={{ mb: 4 }}>
            <TextField fullWidth label="Your Name" margin="normal" variant="outlined" required />
            <TextField fullWidth label="Email Address" margin="normal" variant="outlined" type="email" required />
            <TextField fullWidth label="Phone Number" margin="normal" variant="outlined" type="tel" />
            <TextField fullWidth label="Message" margin="normal" variant="outlined" multiline rows={4} required />
            <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }}>
              Send Message
            </Button>
          </Box>
        </AnimatedGridItem>
        
        <AnimatedGridItem xs={12} md={6}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box sx={{ backgroundColor: '#f5f5f5', p: 4, borderRadius: 2, height: '100%' }}>
            <Typography variant="h5" gutterBottom>Contact Information</Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <LocationOn color="primary" sx={{ mr: 2 }} />
              <Typography>
                123 Skin Care Avenue<br />
                Dermatology City, DC 12345
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Email color="primary" sx={{ mr: 2 }} />
              <Typography>info@virtualdermacare.com</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Phone color="primary" sx={{ mr: 2 }} />
              <Typography>(123) 456-7890</Typography>
            </Box>
            
            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Hours of Operation</Typography>
            <Typography>
              Monday - Friday: 8:00 AM - 8:00 PM<br />
              Saturday: 9:00 AM - 5:00 PM<br />
              Sunday: Closed
            </Typography>
          </Box>
        </AnimatedGridItem>
      </Grid>
    </Container>
  );
};
