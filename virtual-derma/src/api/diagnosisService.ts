import axios from 'axios';
import { DiagnosisDTO } from '../types/diagnosisTypes';

const API_BASE_URL = 'http://localhost:9092/dermacare-service/api/diagnosis';

const getAuthConfig = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data',
  },
});

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

export const getDiagnosis = async (
  id: string,
  token: string
): Promise<DiagnosisDTO> => {
  const response = await axios.get(
    `${API_BASE_URL}/${id}`,
    getAuthConfig(token)
  );
  return response.data;
};

export const getDiagnosesByPatient = async (
  patientId: string,
  token: string
): Promise<DiagnosisDTO[]> => {
  const response = await axios.get(
    `${API_BASE_URL}/patient/${patientId}`,
    getAuthConfig(token)
  );
  return response.data;
};

export const analyzeDiagnosis = async (
  id: string,
  diagnosis: string,
  recommendations: string,
  token: string
): Promise<DiagnosisDTO> => {
  const response = await axios.post(
    `${API_BASE_URL}/analyze/${id}`,
    {},
    {
      ...getAuthConfig(token),
      params: { diagnosis, recommendations },
    }
  );
  return response.data;
};