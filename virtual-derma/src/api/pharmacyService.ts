import axios from 'axios';
import {
  PrescriptionDTO,
  MedicineDTO,
  PrescriptionItemDTO,
} from '../types/pharmacyTypes';

const API_BASE_URL = 'http://localhost:9092/dermacare-service/api/pharmacy';

const getAuthConfig = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const createPrescription = async (
  prescriptionData: Omit<PrescriptionDTO, 'id' | 'dateCreated'>,
  token: string
): Promise<PrescriptionDTO> => {
  const response = await axios.post(
    `${API_BASE_URL}/prescription`,
    prescriptionData,
    getAuthConfig(token)
  );
  return response.data;
};

export const getPrescription = async (
  id: string,
  token: string
): Promise<PrescriptionDTO> => {
  const response = await axios.get(
    `${API_BASE_URL}/prescription/${id}`,
    getAuthConfig(token)
  );
  return response.data;
};

export const getPatientPrescriptions = async (
  patientId: string,
  token: string
): Promise<PrescriptionDTO[]> => {
  const response = await axios.get(
    `${API_BASE_URL}/prescription/patient/${patientId}`,
    getAuthConfig(token)
  );
  return response.data;
};

export const orderMedicines = async (
  prescriptionId: string,
  token: string
): Promise<string> => {
  const response = await axios.post(
    `${API_BASE_URL}/order/${prescriptionId}`,
    {},
    getAuthConfig(token)
  );
  return response.data;
};

export const getAllMedicines = async (token?: string): Promise<MedicineDTO[]> => {
  const config = token ? getAuthConfig(token) : {};
  const response = await axios.get(`${API_BASE_URL}/medicines`, config);
  return response.data;
};

export const addMedicine = async (
  medicineData: MedicineDTO,
  token: string
): Promise<MedicineDTO> => {
  const response = await axios.post(
    `${API_BASE_URL}/medicines`,
    medicineData,
    getAuthConfig(token)
  );
  return response.data;
};