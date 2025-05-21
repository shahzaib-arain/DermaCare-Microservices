import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import { validateToken } from '../api/authService';
import { useNavigate } from 'react-router-dom';

interface DecodedToken {
  sub: string;
  roles: string[];
  userId: string;
  exp: number;
  iat: number;
}

interface AuthUser {
  token: string;
  email: string;
  id: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  userRole: string | null;  // Added userRole here
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<{
    isAuthenticated: boolean;
    user: AuthUser | null;
    loading: boolean;
  }>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const isValid = await validateToken(token);
        if (isValid) {
          const decoded = jwt_decode(token) as DecodedToken;
          setState({
            isAuthenticated: true,
            user: {
              token,
              email: decoded.sub,
              id: decoded.userId,
              role: decoded.roles[0].replace('ROLE_', ''),
            },
            loading: false,
          });
          return;
        }
      }
      setState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    } catch (error) {
      console.error('Authentication check failed:', error);
      setState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    const decoded = jwt_decode(token) as DecodedToken;
    setState({
      isAuthenticated: true,
      user: {
        token,
        email: decoded.sub,
        id: decoded.userId,
        role: decoded.roles[0].replace('ROLE_', ''),
      },
      loading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setState({
      isAuthenticated: false,
      user: null,
      loading: false,
    });
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        userRole: state.user ? state.user.role : null,  // Provide userRole here
        loading: state.loading,
        login,
        logout,
        checkAuth,
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
