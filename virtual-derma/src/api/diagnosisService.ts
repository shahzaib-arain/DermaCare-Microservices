import axios from 'axios';
import { DiagnosisDTO } from '../types/diagnosisTypes';

const API_BASE_URL = 'http://localhost:9092/dermacare-service/api/diagnosis';

const getAuthConfig = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data',
  },
});

// Upload image by patient (POST form data)
export const uploadImage = async (
  file: File,
  notes: string,
  token: string
): Promise<DiagnosisDTO> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('notes', notes);

  const response = await axios.post(
    `${API_BASE_URL}/upload`,
    formData,
    getAuthConfig(token)
  );
  return response.data;
};

// Get diagnosis by ID, roles: any (patient, admin, doctor)
export const getDiagnosis = async (
  id: string,
  token: string
): Promise<DiagnosisDTO> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(
    `${API_BASE_URL}/${id}`,
    config
  );
  return response.data;
};

// Get diagnoses by patient email, roles: any (doctor, admin, patient)
export const getDiagnosesByPatient = async (
  patientEmail: string,
  token: string
): Promise<DiagnosisDTO[]> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(
    `${API_BASE_URL}/patient/${encodeURIComponent(patientEmail)}`,
    config
  );
  return response.data;
};

// Doctor analyzes diagnosis (POST form data), roles: doctor
export const analyzeDiagnosis = async (
  id: string,
  diagnosis: string,
  recommendations: string,
  token: string
): Promise<DiagnosisDTO> => {
  const formData = new FormData();
  formData.append('diagnosis', diagnosis);
  formData.append('recommendations', recommendations);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };

  const response = await axios.post(
    `${API_BASE_URL}/analyze/${id}`,
    formData,
    config
  );
  return response.data;
};
