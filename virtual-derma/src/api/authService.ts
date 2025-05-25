import axios from 'axios';
import { JwtResponse, RegisterDTO } from '../types/authTypes';

const API_BASE_URL = '/auth'; // For security-service endpoints

export const login = async (username: string, password: string): Promise<JwtResponse> => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  const response = await axios.post(`${API_BASE_URL}/login`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const registerPatient = async (userData: RegisterDTO): Promise<string> => {
  const response = await axios.post(`${API_BASE_URL}/register/patient`, userData);
  return response.data;
};

export const registerDoctor = async (userData: RegisterDTO): Promise<string> => {
  const response = await axios.post(`${API_BASE_URL}/register/doctor`, userData);
  return response.data;
};

export const validateToken = async (token: string): Promise<boolean> => {
  try {
    await axios.get(`${API_BASE_URL}/debug/token`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    return false;
  }
};