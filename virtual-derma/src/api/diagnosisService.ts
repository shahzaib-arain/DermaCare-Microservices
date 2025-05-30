import apiClient from './apiClient';
import { DiagnosisDTO } from '../types/diagnosisTypes';

const API_BASE_URL = '/dermacare-service/api/diagnosis';

export const uploadImage = async (
  file: File,
  notes: string
): Promise<DiagnosisDTO> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('notes', notes);

  const response = await apiClient.post(`${API_BASE_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getDiagnosis = async (id: string): Promise<DiagnosisDTO> => {
  const response = await apiClient.get(`${API_BASE_URL}/${id}`);
  return response.data;
};

export const getDiagnosesByPatient = async (
  patientEmail: string
): Promise<DiagnosisDTO[]> => {
  const response = await apiClient.get(
    `${API_BASE_URL}/patient/${encodeURIComponent(patientEmail)}`
  );
  return response.data;
};

export const analyzeDiagnosis = async (
  id: string,
  diagnosis: string,
  recommendations: string
): Promise<DiagnosisDTO> => {
  const formData = new FormData();
  formData.append('diagnosis', diagnosis);
  formData.append('recommendations', recommendations);

  const response = await apiClient.post(
    `${API_BASE_URL}/analyze/${id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};