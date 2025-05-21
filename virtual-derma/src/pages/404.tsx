import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: 4,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[3],
        }}
      >
        <ErrorOutlineIcon
          sx={{
            fontSize: 80,
            color: theme.palette.error.main,
            mb: 2,
          }}
        />
        
        <Typography variant="h1" sx={{ mb: 2, fontWeight: 700 }}>
          404
        </Typography>
        
        <Typography variant="h4" sx={{ mb: 2 }}>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4, maxWidth: '600px' }}>
          Oops! The page you're looking for doesn't exist or has been moved.
          Please check the URL or navigate back to our homepage.
        </Typography>
        
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
          }}
        >
          Return to Homepage
        </Button>
        
        <Box sx={{ mt: 6 }}>
          <Typography variant="body2" color="text.secondary">
            Need help?{' '}
            <RouterLink
              to="/contact"
              style={{
                color: theme.palette.primary.main,
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Contact our support team
            </RouterLink>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFoundPage;