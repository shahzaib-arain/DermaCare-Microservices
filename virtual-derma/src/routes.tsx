import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { Services } from './pages/public/Services';
import { Contact } from './pages/public/Contact';
import { Login } from './pages/auth/Login';
import { RegisterPatient } from './pages/auth/RegisterPatient';
import { RegisterDoctor } from './pages/auth/RegisterDoctor';
import { PatientDashboard } from './pages/dashboard/patient/PatientDashboard';
import { DoctorDashboard } from './pages/dashboard/doctor/DoctorDashboard';
import { AdminDashboard } from './pages/dashboard/admin/AdminDashboard';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { BookAppointment } from './pages/dashboard/patient/BookAppointment';
import { UploadDiagnosis } from './pages/dashboard/patient/UploadDiagnosis';
import { DoctorVerification } from './pages/dashboard/admin/DoctorVerification';
import  NotFoundPage  from './pages/404';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register/patient" element={<RegisterPatient onSuccess={function (): void {
              throw new Error('Function not implemented.');
          } } />} />
      <Route path="/register/doctor" element={<RegisterDoctor onSuccess={function (): void {
              throw new Error('Function not implemented.');
          } } />} />

      {/* Patient Routes */}
      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute requiredRole="PATIENT">
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/appointments/book"
        element={
          <ProtectedRoute requiredRole="PATIENT">
            <BookAppointment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/diagnosis/upload"
        element={
          <ProtectedRoute requiredRole="PATIENT">
            <UploadDiagnosis />
          </ProtectedRoute>
        }
      />

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