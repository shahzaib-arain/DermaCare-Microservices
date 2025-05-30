import { useAuth } from '../../contexts/AuthContext';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { LoadingScreen } from '../../components/ui/LoadingScreen';
import { useEffect } from 'react';
import { Role } from 'types/userTypes';

interface ProtectedRouteProps {
  requiredRole?: Role;
  children?: React.ReactNode;
}

export const ProtectedRoute = ({
  children,
  requiredRole,
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message: 'Please login to access this page',
        }}
        replace
      />
    );
  }

  if (requiredRole && user?.role !== requiredRole) {
    console.warn(
      `Unauthorized access attempt: User ${user?.email} with role ${user?.role} tried to access ${requiredRole} protected route`
    );
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};