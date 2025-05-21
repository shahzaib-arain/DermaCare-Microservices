import { List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  CalendarToday as AppointmentsIcon,
  PhotoCamera as DiagnosisIcon,
  LocalPharmacy as PharmacyIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Sidebar = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const userRole = user?.role;

  const patientItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/patient/dashboard' },
    { text: 'Appointments', icon: <AppointmentsIcon />, path: '/patient/appointments' },
    { text: 'Diagnosis', icon: <DiagnosisIcon />, path: '/patient/diagnosis' },
    { text: 'Pharmacy', icon: <PharmacyIcon />, path: '/patient/pharmacy' }
  ];

  const doctorItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/doctor/dashboard' },
    { text: 'Appointments', icon: <AppointmentsIcon />, path: '/doctor/appointments' },
    { text: 'Diagnosis', icon: <DiagnosisIcon />, path: '/doctor/diagnosis' }
  ];

  const adminItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Doctor Verification', icon: <AppointmentsIcon />, path: '/admin/doctor-verification' },
    { text: 'System Settings', icon: <SettingsIcon />, path: '/admin/settings' }
  ];

  const items = userRole === 'ADMIN' 
    ? adminItems 
    : userRole === 'DOCTOR' 
      ? doctorItems 
      : patientItems;

  return (
    <List component="nav" sx={{ width: 250 }}>
      {items.map((item) => (
        <ListItem
          key={item.text}
          component={Link}
          to={item.path}
          sx={{
            color: 'inherit',
            textDecoration: 'none',
            ...(pathname.startsWith(item.path) && {
              backgroundColor: 'primary.light',
              '&:hover': {
                backgroundColor: 'primary.light',
              },
              '& .MuiListItemIcon-root': {
                color: 'primary.main'
              }
            })
          }}
        >
          <ListItemIcon>
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
      <Divider sx={{ my: 1 }} />
    </List>
  );
};