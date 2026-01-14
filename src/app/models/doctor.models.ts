export interface Doctor {
  id: string;
  name: string;
  speciality: string;
  hospitalId: string;
  hospitalName: string;
  experience: number;
  rating: number;
  qualification: string;
  phone: string;
  email: string;
  consultationFee: number;
  availability: DoctorAvailability[];
  profileImage?: string;
}

export interface DoctorAvailability {
  day: string;
  slots: TimeSlot[];
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface OPDTiming {
  doctorId: string;
  day: string;
  startTime: string;
  endTime: string;
  maxPatients: number;
}
