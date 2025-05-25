import axios from 'axios';
import { UserResponseDTO, DoctorVerificationDTO } from '../types/userTypes';

const API_BASE_URL = '/api/auth'; // For user-service auth endpoints
const USER_API_BASE = '/api'; // For other user-service endpoints

// Common function to set auth header
const getAuthConfig = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getCurrentUser = async (token: string): Promise<UserResponseDTO> => {
  const response = await axios.get(`${API_BASE_URL}/auth/validate`, getAuthConfig(token));
  return response.data;
};

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