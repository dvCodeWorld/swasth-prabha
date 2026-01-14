export interface Hospital {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  type: 'Government' | 'Private';
  verified: boolean;
  totalBeds: number;
  availableBeds: number;
  icuBeds: number;
  icuAvailable: number;
  sncuBeds: number;
  sncuAvailable: number;
  emergencyBeds: number;
  emergencyAvailable: number;
  latitude: number;
  longitude: number;
  departments: string[];
  adminId?: string;
}

export interface BedUpdate {
  hospitalId: string;
  totalBeds: number;
  availableBeds: number;
  icuBeds: number;
  icuAvailable: number;
  sncuBeds: number;
  sncuAvailable: number;
  emergencyBeds: number;
  emergencyAvailable: number;
  timestamp: Date;
}

export interface PatientAdmission {
  id: string;
  hospitalId: string;
  patientName: string;
  patientPhone: string;
  bedType: 'General' | 'ICU' | 'SNCU' | 'Emergency';
  admissionDate: Date;
  dischargeDate?: Date;
  status: 'Admitted' | 'Discharged';
}
