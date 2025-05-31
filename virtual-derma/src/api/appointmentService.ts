import apiClient from './apiClient';
import { AppointmentDTO } from '../types/appointmentTypes';

const API_BASE_URL = '/dermacare-service/api/appointment';

// Removed getAuthConfig and all token parameters

export const bookAppointment = async (
  appointmentData: Omit<AppointmentDTO, 'id' | 'status' | 'createdAt'>
): Promise<AppointmentDTO> => {
  const response = await apiClient.post(API_BASE_URL, appointmentData);
  return response.data;
};

export const getPatientAppointments = async (
  patientEmail: string
): Promise<AppointmentDTO[]> => {
  const response = await apiClient.get(`${API_BASE_URL}/patient/${patientEmail}`);
  return response.data;
};

export const getDoctorAppointments = async (
  doctorEmail: string
): Promise<AppointmentDTO[]> => {
  const response = await apiClient.get(`${API_BASE_URL}/doctor/${doctorEmail}`);
  return response.data;
};


export const rescheduleAppointment = async (
  id: string,
  newDateTime: string
): Promise<AppointmentDTO> => {
  const response = await apiClient.put(
    `${API_BASE_URL}/${id}/reschedule`,
    {},
    {
      params: { newDateTime },
    }
  );
  return response.data;
};

export const cancelAppointment = async (
  id: string
): Promise<void> => {
  await apiClient.delete(`${API_BASE_URL}/${id}`);
};

export const getAvailableSlots = async (
  doctorId: string,
  date: string
): Promise<AppointmentDTO[]> => {
  const response = await apiClient.get(`${API_BASE_URL}/available/${doctorId}`, {
    params: { date },
  });
  return response.data;
};

export const updateAppointmentStatus = async (
  id: string,
  status: 'BOOKED' | 'COMPLETED' | 'CANCELLED'
): Promise<AppointmentDTO> => {
  const response = await apiClient.put(`${API_BASE_URL}/${id}/status`, { status });
  return response.data;
};