import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          DermaCare
          </Link>
        </Typography>

        {/* Add navigation links here */}
<Box sx={{ display: 'flex', gap: 2, mr: 2 }}>
  <Button 
    color="inherit" 
    component={Link} 
    to="/"
    sx={{ fontWeight: 'bold' }} // Optional: make Home stand out
  >
    Home
  </Button>
  <Button color="inherit" component={Link} to="/about">
    About
  </Button>
  <Button color="inherit" component={Link} to="/services">
    Services
  </Button>
  <Button color="inherit" component={Link} to="/contact">
    Contact
  </Button>
</Box>

        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              {user?.email.charAt(0).toUpperCase()}
            </Avatar>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Button color="inherit" onClick={() => setAuthModalOpen(true)}>
            Login
          </Button>
        )}
      </Toolbar>

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </AppBar>
  );
};