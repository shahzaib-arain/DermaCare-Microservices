import { Key } from 'react';

export interface MedicineDTO {
  medicineId: Key | null | undefined;
  id: string;
  name: string;
  description: string;
  manufacturer: string;
  price: number;
  stock: number;
  category?: string;
  dosageForm?: string;
}
