import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { Services } from './pages/public/Services';
import { Contact } from './pages/public/Contact';
import { Login } from './pages/auth/Login';
import { RegisterPatient } from './pages/auth/RegisterPatient';
import { RegisterDoctor } from './pages/auth/RegisterDoctor';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import NotFoundPage from './pages/404';
import { Unauthorized } from './pages/Unauthorized';
import { Role } from 'types/userTypes';

// Patient components
import { PatientLayout } from './pages/dashboard/patient/PatientLayout';
import { PatientDashboard } from './pages/dashboard/patient/PatientDashboard';
import { BookAppointment } from './pages/dashboard/patient/BookAppointment';
import { UploadDiagnosis } from './pages/dashboard/patient/UploadDiagnosis';
import { MyAppointments } from './pages/dashboard/patient/MyAppointments';
import { MyPrescriptions } from './pages/dashboard/patient/MyPrescriptions';
import { PatientProfile } from './pages/dashboard/patient/PatientProfile';

// Doctor components
import { DoctorLayout } from './pages/dashboard/doctor/DoctorLayout';
import { DoctorDashboard } from './pages/dashboard/doctor/DoctorDashboard';
import { Appointments } from './pages/dashboard/doctor/Appointments';
import { Diagnoses } from './pages/dashboard/doctor/Diagnoses';
import { CreatePrescription } from './pages/dashboard/doctor/CreatePrescription';
import { DoctorProfile } from './pages/dashboard/doctor/DoctorProfile';

// Admin components
import { AdminLayout } from './pages/dashboard/admin/AdminLayout';
import { AdminDashboard } from './pages/dashboard/admin/AdminDashboard';
import { DoctorVerification } from './pages/dashboard/admin/DoctorVerification';
import { ManageMedicines } from './pages/dashboard/admin/ManageMedicines';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route 
        path="/register/patient" 
        element={<RegisterPatient onSuccess={() => window.location.href = '/patient/dashboard'} />} 
      />
      <Route 
        path="/register/doctor" 
        element={<RegisterDoctor onSuccess={() => window.location.href = '/doctor/dashboard'} />} 
      />

      {/* Patient Routes */}
      <Route 
        path="/patient" 
        element={
          <ProtectedRoute requiredRole={Role.PATIENT}>
            <PatientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="appointments" element={<MyAppointments />} />
        <Route path="book-appointment" element={<BookAppointment />} />
        <Route path="prescriptions" element={<MyPrescriptions />} />
        <Route path="upload-diagnosis" element={<UploadDiagnosis />} />
        <Route path="profile" element={<PatientProfile />} />
      </Route>

   {/* Doctor Routes */}
<Route 
  path="/doctor" 
  element={
    <ProtectedRoute requiredRole={Role.DOCTOR}>
      <DoctorLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<Navigate to="dashboard" replace />} />
  <Route path="dashboard" element={<DoctorDashboard />} />
  <Route path="appointments" element={<Appointments />} />
  <Route path="diagnoses" element={<Diagnoses />} />
  <Route path="create-prescription" element={<CreatePrescription />} />
  <Route path="patient" element={<DoctorProfile />} />
  <Route path="profile" element={<DoctorProfile />} />
</Route>

      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRole={Role.ADMIN}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="doctor-verification" element={<DoctorVerification />} />
        <Route path="manage-medicines" element={<ManageMedicines />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};