import axios from 'axios';
import { AppointmentDTO } from '../types/appointmentTypes';

const API_BASE_URL = '/api/appointment'; // Matches gateway route exactly
const getAuthConfig = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const bookAppointment = async (
  appointmentData: Omit<AppointmentDTO, 'id' | 'status' | 'createdAt'>,
  token: string
): Promise<AppointmentDTO> => {
  const response = await axios.post(API_BASE_URL, appointmentData, getAuthConfig(token));
  return response.data;
};

export const getPatientAppointments = async (
  patientId: string,
  token: string
): Promise<AppointmentDTO[]> => {
  const response = await axios.get(
    `${API_BASE_URL}/patient/${patientId}`,
    getAuthConfig(token)
  );
  return response.data;
};

export const getDoctorAppointments = async (
  doctorId: string,
  token: string
): Promise<AppointmentDTO[]> => {
  const response = await axios.get(
    `${API_BASE_URL}/doctor/${doctorId}`,
    getAuthConfig(token)
  );
  return response.data;
};

export const rescheduleAppointment = async (
  id: string,
  newDateTime: string,
  token: string
): Promise<AppointmentDTO> => {
  const response = await axios.put(
    `${API_BASE_URL}/${id}/reschedule`,
    {},
    {
      ...getAuthConfig(token),
      params: { newDateTime },
    }
  );
  return response.data;
};

export const cancelAppointment = async (id: string, token: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`, getAuthConfig(token));
};

export const getAvailableSlots = async (
  doctorId: string,
  date: string,
  token?: string
): Promise<AppointmentDTO[]> => {
  const config = token ? getAuthConfig(token) : {};
  const response = await axios.get(
    `${API_BASE_URL}/available/${doctorId}`,
    {
      ...config,
      params: { date },
    }
  );
  return response.data;
};