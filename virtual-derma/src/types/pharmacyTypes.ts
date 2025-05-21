export interface MedicineDTO {
  id: string;
  name: string;
  description: string;
  manufacturer: string;
  price: number;
  stock: number;
  category?: string;
  dosageForm?: string;
}

export interface PrescriptionItemDTO {
  medicineId: string;
  medicineName?: string;
  dosage: string;
  duration: string;
  instructions: string;
}

export interface PrescriptionDTO {
  id: string;
  patientId: string;
  doctorId: string;
  dateCreated: string | Date;
  status: string;
  items: PrescriptionItemDTO[];
  patientName?: string;
  doctorName?: string;
}