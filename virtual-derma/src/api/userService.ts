// src/api/userService.ts
import apiClient from './apiClient';
import { AxiosError } from 'axios'; // Import AxiosError for proper typing
import { DoctorVerificationDTO, UserResponseDTO } from 'types/userTypes';

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
    const response = await apiClient.post(
      '/security-service/auth/login',
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
    // Proper type checking for AxiosError
    if (error instanceof AxiosError) {
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
    // Handle non-Axios errors
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred during login');
  }
};

export const getPatientProfile = async (): Promise<UserResponseDTO> => {
  try {
    const response = await apiClient.get('/user-service/api/patient/profile');
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Failed to fetch patient profile');
    }
    throw new Error('Failed to fetch patient profile');
  }
};

export const getDoctorProfile = async (): Promise<UserResponseDTO> => {
  try {
    const response = await apiClient.get('/user-service/api/doctor/profile');
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Failed to fetch doctor profile');
    }
    throw new Error('Failed to fetch doctor profile');
  }
};

// Similar error handling for other functions
export const getPendingDoctors = async (): Promise<DoctorVerificationDTO[]> => {
  try {
    const response = await apiClient.get('/user-service/api/admin/doctors/pending');
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Failed to fetch pending doctors');
    }
    throw new Error('Failed to fetch pending doctors');
  }
};

export const getVerifiedDoctors = async (): Promise<DoctorVerificationDTO[]> => {
  try {
    const response = await apiClient.get('/user-service/api/admin/doctors/verified');
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Failed to fetch verified doctors');
    }
    throw new Error('Failed to fetch verified doctors');
  }
};

export const verifyDoctor = async (
  doctorId: string,
  degreeFilePath?: string
): Promise<void> => {
  try {
    await apiClient.put(
      `/user-service/api/admin/doctors/verify/${doctorId}`,
      {},
      {
        params: { degreeFilePath },
      }
    );
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Failed to verify doctor');
    }
    throw new Error('Failed to verify doctor');
  }
};

export const getAllDoctors = async (): Promise<DoctorVerificationDTO[]> => {
  try {
    const response = await apiClient.get('/user-service/api/patient/doctors');
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Failed to fetch doctors');
    }
    throw new Error('Failed to fetch doctors');
  }
};