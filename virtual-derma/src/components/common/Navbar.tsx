import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
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
  const { user } = useAuth();
  const userRole = user?.role ?? '';

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
    <></>
//    <Drawer
//   variant="permanent"
//   sx={{
//     width: 240,
//     flexShrink: 0,
//     [`& .MuiDrawer-paper`]: { 
//       width: 240, 
//       boxSizing: 'border-box',
//       position: 'relative', // Fix positioning
//       display:"flex",
//       justifyItems:"center"
//     },
//   }}
// >
//       <Toolbar /> {/* For proper spacing below app bar */}
//       <List>
//         {filteredItems.map((item) => (
//           <ListItem disablePadding key={item.text}>
//             <ListItemButton component={Link} to={item.path}>
//               <ListItemIcon>{item.icon}</ListItemIcon>
//               <ListItemText primary={item.text} />
//             </ListItemButton>
//           </ListItem>
//         ))}
//       </List>
//     </Drawer>
  );
};
