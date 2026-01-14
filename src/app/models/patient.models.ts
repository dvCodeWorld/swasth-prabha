export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female' | 'Other';
  abhaNumber?: string;
  address: string;
  bloodGroup?: string;
  emergencyContact: string;
  medicalHistory?: string[];
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  type: 'Prescription' | 'Lab Report' | 'Doctor Note' | 'Discharge Summary';
  title: string;
  date: Date;
  doctorName?: string;
  hospitalName?: string;
  content: string;
  attachments?: string[];
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  date: Date;
  medicines: Medicine[];
  diagnosis: string;
  notes?: string;
}

export interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}
