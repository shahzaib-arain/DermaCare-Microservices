import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  Home as HomeIcon,
  CalendarToday as AppointmentsIcon,
  MedicalServices as DiagnosisIcon,
  LocalPharmacy as PharmacyIcon,
  People as DoctorsIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface NavItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  roles?: Array<'ADMIN' | 'DOCTOR' | 'PATIENT'>;
}

export const Navbar = () => {
  const { userRole } = useAuth();

  const navItems: NavItem[] = [
    { text: 'Home', icon: <HomeIcon />, path: '/', roles: ['ADMIN', 'DOCTOR', 'PATIENT'] },
    { text: 'Appointments', icon: <AppointmentsIcon />, path: '/appointments', roles: ['ADMIN', 'DOCTOR', 'PATIENT'] },
    { text: 'Diagnosis', icon: <DiagnosisIcon />, path: '/diagnosis', roles: ['ADMIN', 'DOCTOR', 'PATIENT'] },
    { text: 'Pharmacy', icon: <PharmacyIcon />, path: '/pharmacy', roles: ['ADMIN', 'DOCTOR', 'PATIENT'] },
    { text: 'Doctors', icon: <DoctorsIcon />, path: '/doctors', roles: ['ADMIN'] },
    { text: 'Admin', icon: <AdminIcon />, path: '/admin', roles: ['ADMIN'] },
  ];

  const filteredItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(userRole as any)
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
      }}
    >
      <Toolbar /> {/* For proper spacing below app bar */}
      <List>
        {filteredItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};