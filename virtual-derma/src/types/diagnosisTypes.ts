export interface DiagnosisDTO {
  id: string;
  patientId: string;
  doctorId?: string;
  imageUrl?: string;
  notes: string;
  diagnosis?: string;
  recommendations?: string;
  status: string;
  createdAt: string | Date;
  analyzedAt?: string | Date;
  patientName?: string;
  doctorName?: string;
}