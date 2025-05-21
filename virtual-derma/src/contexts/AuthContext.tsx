import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { validateToken } from '../../api/authService';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  user: { email: string; id?: string } | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<{
    isAuthenticated: boolean;
    userRole: string | null;
    user: { email: string; id?: string } | null;
    loading: boolean;
  }>({
    isAuthenticated: false,
    userRole: null,
    user: null,
    loading: true,
  });

  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const isValid = await validateToken(token);
        if (isValid) {
          const decoded: any = jwtDecode(token);
          setState({
            isAuthenticated: true,
            userRole: decoded.roles[0].replace('ROLE_', ''),
            user: { email: decoded.sub, id: decoded.userId },
            loading: false,
          });
          return;
        }
      }
      setState((prev) => ({ ...prev, loading: false }));
    } catch (error) {
      console.error('Auth check failed:', error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    const decoded: any = jwtDecode(token);
    setState({
      isAuthenticated: true,
      userRole: decoded.roles[0].replace('ROLE_', ''),
      user: { email: decoded.sub, id: decoded.userId },
      loading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setState({
      isAuthenticated: false,
      userRole: null,
      user: null,
      loading: false,
    });
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: state.isAuthenticated,
        userRole: state.userRole,
        user: state.user,
        loading: state.loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};