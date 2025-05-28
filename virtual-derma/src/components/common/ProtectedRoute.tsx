import { useAuth } from '../../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingScreen } from '../../components/ui/LoadingScreen';
import { ReactNode, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'PATIENT' | 'DOCTOR' | 'ADMIN'; // More specific type
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, loading, checkAuth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Only check auth if we're not already loading and not authenticated
    if (!loading && !isAuthenticated) {
      checkAuth().catch(error => {
        console.error('Auth check failed:', error);
      });
    }
  }, [isAuthenticated, loading, checkAuth]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    // Store the attempted URL for redirect after login
    return <Navigate 
      to="/login" 
      state={{ from: location }} 
      replace 
    />;
  }

  // Check role if required
  if (requiredRole && user?.role !== requiredRole) {
    console.warn(`Unauthorized access attempt: User role ${user?.role} tried to access ${requiredRole} route`);
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};