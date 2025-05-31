export interface MedicineDTO {
  id: string;
  name: string;
  description: string;
  manufacturer: string;
  price: number;
  stock: number;
  category: string;
  dosageForm: string;
  type?: string; // Changed from ReactNode to string if that's what you need
  createdAt?: string;
  updatedAt?: string;
}

export interface PrescriptionItemDTO {
  medicineId: string;
  medicineName?: string;
  dosage: string;
  duration: string;
  instructions: string;
  quantity?: number;
}

export type PrescriptionStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface PrescriptionDTO {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  patientName?: string;
  status: PrescriptionStatus;
  dateCreated: string;
  items: PrescriptionItemDTO[];
  notes?: string;
}