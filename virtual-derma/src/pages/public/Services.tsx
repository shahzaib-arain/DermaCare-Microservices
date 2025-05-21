import { Container, Typography, Grid, Card, CardContent, Box } from '@mui/material';
import { motion } from 'framer-motion';

const AnimatedGridItem = ({ children, ...props }: any) => (
  <Grid item component={motion.div} {...props}>
    {children}
  </Grid>
);

const services = [
  {
    title: 'Skin Consultation',
    description: 'Get expert advice on your skin condition through virtual visits.',
    icon: '🩺',
  },
  {
    title: 'Prescription Services',
    description: 'Receive prescriptions for skin treatments delivered to your door.',
    icon: '💊',
  },
  {
    title: 'Follow-up Care',
    description: 'Scheduled follow-ups to track your treatment progress virtually.',
    icon: '📅',
  },
];

export const Services = () => {
  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h3" gutterBottom align="center">
        Our Services
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 6 }}>
        Comprehensive dermatology care from the comfort of your home
      </Typography>

      <Grid container spacing={4}>
        {services.map(({ title, description, icon }) => (
          <AnimatedGridItem 
            key={title} xs={12} sm={6} md={4}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ height: '100%', textAlign: 'center', py: 4 }}>
              <Box sx={{ fontSize: 64, mb: 2 }}>{icon}</Box>
              <CardContent>
                <Typography variant="h5" gutterBottom>{title}</Typography>
                <Typography variant="body2" color="text.secondary">{description}</Typography>
              </CardContent>
            </Card>
          </AnimatedGridItem>
        ))}
      </Grid>
    </Container>
  );
};
