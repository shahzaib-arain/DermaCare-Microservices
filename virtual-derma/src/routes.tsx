import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { Services } from './pages/public/Services';
import { Contact } from './pages/public/Contact';
import { Login } from './pages/auth/Login';
import { RegisterPatient } from './pages/auth/RegisterPatient';
import { RegisterDoctor } from './pages/auth/RegisterDoctor';
import { PatientLayout } from './pages/dashboard/patient/PatientLayout';
import { PatientDashboard } from './pages/dashboard/patient/PatientDashboard';
import { DoctorDashboard } from './pages/dashboard/doctor/DoctorDashboard';
import { AdminDashboard } from './pages/dashboard/admin/AdminDashboard';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { BookAppointment } from './pages/dashboard/patient/BookAppointment';
import { UploadDiagnosis } from './pages/dashboard/patient/UploadDiagnosis';
import { MyAppointments } from './pages/dashboard/patient/MyAppointments';
import { MyPrescriptions } from './pages/dashboard/patient/MyPrescriptions';
import { DoctorVerification } from './pages/dashboard/admin/DoctorVerification';
import  NotFoundPage  from './pages/404';
import { Unauthorized } from './pages/Unauthorized';

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
          <ProtectedRoute requiredRole="PATIENT">
            <PatientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="appointments" element={<MyAppointments />} />
        <Route path="appointments/book" element={<BookAppointment />} />
        <Route path="prescriptions" element={<MyPrescriptions />} />
        <Route path="upload-diagnosis" element={<UploadDiagnosis />} />
      </Route>

      {/* Doctor Routes */}
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute requiredRole="DOCTOR">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/doctor-verification"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <DoctorVerification />
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};