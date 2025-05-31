import * as yup from 'yup';
import { InferType } from 'yup';

export const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export const registerPatientSchema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  phone: yup.string().matches(/^\+?[0-9]{10,15}$/, 'Invalid phone number'),
});

export const registerDoctorSchema = registerPatientSchema.concat(
  yup.object().shape({
    degreeNumber: yup.string().required('Degree number is required'),
    specialization: yup.string().required('Specialization is required'),
  })
);
export const appointmentSchema = yup.object({
  doctorId: yup.string().required('Doctor is required'),
  reason: yup.string().required('Reason is required'),
  appointmentTime: yup
    .date()
    .typeError('Appointment time must be a valid date')
    .min(new Date(), 'Appointment time must be in the future')
    .required('Appointment time is required')
});

export const diagnosisSchema = yup.object({
  file: yup
    .mixed<File>()
    .required('File is required')
    .test('is-file', 'Please upload a file', (value) => value instanceof File),
  notes: yup.string().required('Notes are required')
});

export const prescriptionSchema = yup.object({
  patientId: yup.string().required('Patient ID is required'),
  items: yup.array().of(
    yup.object({
      medicineId: yup.string().required('Medicine is required'),
      dosage: yup.string().required('Dosage is required'),
      duration: yup.string().required('Duration is required'),
      instructions: yup.string().required('Instructions are required'),
    })
  ).required('At least one medicine is required'),
});

export type PrescriptionFormData = InferType<typeof prescriptionSchema>;
