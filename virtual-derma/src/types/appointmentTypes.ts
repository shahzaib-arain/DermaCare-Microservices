export enum AppointmentStatus {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  RESCHEDULED = 'RESCHEDULED',
  NO_SHOW = 'NO_SHOW',
}

export interface AppointmentDTO {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentTime: string | Date;
  durationMinutes: number;
  reason: string;
  status: AppointmentStatus;
  createdAt: string | Date;
  updatedAt?: string | Date;
  patientName?: string;
  doctorName?: string;
}