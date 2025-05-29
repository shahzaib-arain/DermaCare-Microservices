import axios from 'axios';
import { DoctorVerificationDTO, UserResponseDTO } from 'types/userTypes';

const API_BASE_URL = 'http://localhost:9092/user-service/api';

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const { username, password } = credentials;
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  try {
    const response = await axios.post(
      `http://localhost:9092/security-service/auth/login`,
      formData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        withCredentials: true
      }
    );

    const token = response.data?.token || response.data;
    if (!token) throw new Error('Token not received from server');
    return { token };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Detailed login error:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });

      if (error.response?.status === 401) {
        throw new Error('Invalid username or password');
      }
      throw new Error(error.response?.data?.message || 'Login failed');
    }
    throw new Error('Network error');
  }
};

const getAuthConfig = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getPatientProfile = async (token: string): Promise<UserResponseDTO> => {
  const response = await axios.get(`${API_BASE_URL}/patient/profile`, getAuthConfig(token));
  return response.data;
};

export const getDoctorProfile = async (token: string): Promise<UserResponseDTO> => {
  const response = await axios.get(`${API_BASE_URL}/doctor/profile`, getAuthConfig(token));
  return response.data;
};

export const getPendingDoctors = async (token: string): Promise<DoctorVerificationDTO[]> => {
  const response = await axios.get(`${API_BASE_URL}/admin/doctors/pending`, getAuthConfig(token));
  return response.data;
};

export const getVerifiedDoctors = async (token: string): Promise<DoctorVerificationDTO[]> => {
  const response = await axios.get(`${API_BASE_URL}/admin/doctors/verified`, getAuthConfig(token));
  return response.data;
};

export const verifyDoctor = async (
  token: string,
  doctorId: string,
  degreeFilePath?: string
): Promise<void> => {
  await axios.put(
    `${API_BASE_URL}/admin/doctors/verify/${doctorId}`,
    {},
    {
      ...getAuthConfig(token),
      params: { degreeFilePath },
    }
  );
};

export const getAllDoctors = async (token: string): Promise<DoctorVerificationDTO[]> => {
  const response = await axios.get(`${API_BASE_URL}/patient/doctors`, getAuthConfig(token));
  return response.data;
};
