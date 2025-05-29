import { Key } from "react";
export enum Role {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT',
}

export interface UserResponseDTO {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  verified: boolean;
  createdAt: string | Date;
  degreeNumber?: string;
  specialization?: string;
  doctorVerified?: boolean;
}

export interface DoctorVerificationDTO {
  id: Key | null | undefined;
  doctorId: string;
  fullName: string;
  email: string;
  phone: string;
  degreeNumber: string;
  specialization: string;
  verified: boolean;
  degreeFilePath?: string;
}