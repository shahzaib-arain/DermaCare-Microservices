// src/components/common/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ReactElement } from 'react';

interface ProtectedRouteProps {
  requiredRole?: string;
  children?: React.ReactNode;
}

export const ProtectedRoute = ({ requiredRole, children }: ProtectedRouteProps): ReactElement => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Return a proper loading component
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};