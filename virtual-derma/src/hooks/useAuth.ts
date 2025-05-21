import { useAuth } from '../contexts/AuthContext';

export const useAuthCheck = () => {
  const { isAuthenticated, loading } = useAuth();

  return {
    isAuthenticated,
    isLoading: loading,
  };
};

export const useUserRole = () => {
  const { userRole } = useAuth();
  return userRole;
};

export const useUser = () => {
  const { user } = useAuth();
  return user;
};