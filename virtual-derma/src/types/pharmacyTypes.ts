// src/types/pharmacyTypes.ts
export interface MedicineDTO {
  type: string;
  id: string;  // Changed from medicineId to id for consistency
  name: string;
  dosage: string;
  manufacturer?: string;
  price?: number;
  description?: string;
  stock?: number;
  category?: string;
}

export interface PrescriptionItemDTO {
  id?: string;
  medicineId: string;
  medicineName?: string;
  dosage: string;
  quantity: number;
  instructions?: string;
  duration?: string;  // Added duration to match form
}

export interface PrescriptionDTO {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  dateCreated: string;
  status: 'ACTIVE' | 'FULFILLED' | 'EXPIRED' | 'CANCELLED';
  items: PrescriptionItemDTO[];
  notes?: string;
}