import { useAuth } from '../contexts/AuthContext';

export const useAuthCheck = () => {
  const { isAuthenticated, loading } = useAuth();

  return {
    isAuthenticated,
    isLoading: loading,
  };
};

export const useUserRole = () => {
  const { user } = useAuth();
  return user?.role;  // Now getting role from user object
};

export const useUser = () => {
  const { user } = useAuth();
  return user;
};