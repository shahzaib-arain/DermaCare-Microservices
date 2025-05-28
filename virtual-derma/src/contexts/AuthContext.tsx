import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import { login as apiLogin, validateToken } from '../api/authService';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoadingScreen } from '../components/ui/LoadingScreen';

interface DecodedToken {
  sub: string;
  roles: string[] | string;
  userId: string;
  exp: number;
  iat: number;
  firstName?: string;
  lastName?: string;
  isDoctorVerified?: boolean;
}

interface AuthUser {
  token: string;
  email: string;
  id: string;
  role: string;
  firstName: string;
  lastName: string;
  isDoctorVerified?: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const normalizeRole = useCallback((roles: string[] | string): string => {
    if (!roles) return '';
    const role = Array.isArray(roles) ? roles[0] : roles;
    return role.replace('ROLE_', '').toUpperCase();
  }, []);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      
      if (decoded.exp * 1000 < Date.now()) {
        throw new Error('Token expired');
      }

      const isValid = await validateToken(token);
      if (!isValid) {
        throw new Error('Invalid token');
      }

      const role = normalizeRole(decoded.roles);
      const currentUser: AuthUser = {
        token,
        email: decoded.sub,
        id: decoded.userId,
        role,
        firstName: decoded.firstName || '',
        lastName: decoded.lastName || '',
        isDoctorVerified: decoded.isDoctorVerified
      };

      setIsAuthenticated(true);
      setUser(currentUser);
    } catch (error) {
      console.error('Authentication check failed:', error);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [normalizeRole]);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const { token } = await apiLogin(username, password);
      localStorage.setItem('token', token);

      const decoded = jwtDecode<DecodedToken>(token);
      const role = normalizeRole(decoded.roles);

      const loggedInUser: AuthUser = {
        token,
        email: decoded.sub,
        id: decoded.userId,
        role,
        firstName: decoded.firstName || '',
        lastName: decoded.lastName || '',
        isDoctorVerified: decoded.isDoctorVerified
      };

      setIsAuthenticated(true);
      setUser(loggedInUser);

      // Redirect to intended page or default route
      const from = location.state?.from?.pathname || getDefaultRoute(role);
      navigate(from, { replace: true });

    } catch (error) {
      console.error('[AuthContext] Login failed:', error);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getDefaultRoute = (role: string): string => {
    switch(role) {
      case 'PATIENT': return '/patient/dashboard';
      case 'DOCTOR': return '/doctor/dashboard';
      case 'ADMIN': return '/admin/dashboard';
      default: return '/';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) return <LoadingScreen />;

  return (
    <AuthContext.Provider
      value={{ 
        isAuthenticated, 
        user, 
        loading, 
        login, 
        logout, 
        checkAuth 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};