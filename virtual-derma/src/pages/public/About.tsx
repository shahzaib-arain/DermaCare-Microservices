import { Box, Typography, Container, Grid, List, ListItem, ListItemText } from '@mui/material';
import { motion } from 'framer-motion';

// Create a properly typed motion Grid item component
const AnimatedGridItem = ({ children, ...props }: any) => (
  <Grid item component={motion.div} {...props}>
    {children}
  </Grid>
);

export const About = () => {
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
        About Virtual DermaCare
      </Typography>
      
      <Typography variant="body1" paragraph>
        Virtual DermaCare is revolutionizing dermatology by bringing expert skin care directly to you through our secure, easy-to-use virtual platform.
      </Typography>
      
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <AnimatedGridItem 
          xs={12} 
          md={6}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Typography variant="h4" gutterBottom>
            Our Mission
          </Typography>
          <Typography variant="body1" paragraph>
            To make high-quality dermatological care accessible, affordable, and convenient for everyone, regardless of location.
          </Typography>
          <Typography variant="body1" paragraph>
            We believe that everyone deserves access to expert skin care without the hassle of long wait times or travel.
          </Typography>
        </AnimatedGridItem>
        
        <AnimatedGridItem 
          xs={12} 
          md={6}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Typography variant="h4" gutterBottom>
            How It Works
          </Typography>
          <List dense sx={{ pl: 2 }}>
            <ListItem>
              <ListItemText primary="Book a virtual appointment with a board-certified dermatologist" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Upload images of your skin concern" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Have your video consultation" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Receive diagnosis and treatment plan" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Get prescriptions delivered to your pharmacy" />
            </ListItem>
          </List>
        </AnimatedGridItem>
      </Grid>

      <Box
        component={motion.div}
        sx={{ 
          mt: 6, 
          backgroundColor: 'background.paper', 
          p: 4, 
          borderRadius: 2,
          boxShadow: 1
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Typography variant="h4" gutterBottom>
          Our Team
        </Typography>
        <Typography variant="body1" paragraph>
          Our dermatologists are all board-certified with extensive experience in treating a wide range of skin conditions. 
          They undergo rigorous training in telemedicine to ensure you receive the same quality of care as an in-person visit.
        </Typography>
      </Box>
    </Container>
  );
};