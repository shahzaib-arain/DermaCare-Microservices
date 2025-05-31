
import apiClient from './apiClient';
import { PrescriptionDTO, MedicineDTO, PrescriptionItemDTO } from '../types/pharmacyTypes';

const API_BASE_URL = '/dermacare-service/api/pharmacy';

export const createPrescription = async (
  prescriptionData: Omit<PrescriptionDTO, 'id' | 'dateCreated'>
): Promise<PrescriptionDTO> => {
  const response = await apiClient.post(`${API_BASE_URL}/prescription`, prescriptionData);
  return response.data;
};

export const getPrescription = async (id: string): Promise<PrescriptionDTO> => {
  const response = await apiClient.get(`${API_BASE_URL}/prescription/${id}`);
  return response.data;
};

export const getPatientPrescriptions = async (email: string): Promise<PrescriptionDTO[]> => {
  const response = await apiClient.get(`${API_BASE_URL}/prescription/patient/${email}`);
  return response.data;
};

export const getAllMedicines = async (): Promise<MedicineDTO[]> => {
  const response = await apiClient.get(`${API_BASE_URL}/medicines`);
  return response.data;
};

export const addMedicine = async (
  medicineData: Omit<MedicineDTO, 'id'>
): Promise<MedicineDTO> => {
  const response = await apiClient.post(`${API_BASE_URL}/medicines`, medicineData);
  return response.data;
};
