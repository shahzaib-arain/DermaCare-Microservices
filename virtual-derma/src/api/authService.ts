import axios from 'axios';

const API_BASE_URL = 'http://localhost:9092/security-service';

interface LoginResponse {
  token: string;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      withCredentials: true
    });
    
    if (!response.data?.token) {
      throw new Error('No token received in response');
    }
    
    return { token: response.data.token };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Login error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      throw new Error(error.response?.data?.message || 'Login failed');
    }
    throw new Error('Login failed');
  }
};

export const validateToken = async (token: string): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/auth/validate`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.status === 200;
  } catch (error) {
    console.error('Token validation failed:', error);
    return false;
  }
};

export const registerPatient = async (patientData: {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role: string;
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register/patient`, patientData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.status >= 300) {
      throw new Error(response.data?.message || 'Registration failed');
    }
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error ||
                         'Registration failed. Please try again.';
      throw new Error(errorMessage);
    }
    throw new Error('Registration failed. Please try again.');
  }
};

export const registerDoctor = async (doctorData: {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  degreeNumber: string;
  specialization: string;
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register/doctor`, doctorData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error ||
                         'Doctor registration failed';
      throw new Error(errorMessage);
    }
    throw new Error('Doctor registration failed');
  }
};