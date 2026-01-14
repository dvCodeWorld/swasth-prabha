export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  hospitalId: string;
  hospitalName: string;
  appointmentDate: Date;
  timeSlot: string;
  type: 'Video' | 'Clinic';
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'In Progress';
  symptoms?: string;
  notes?: string;
  consultationFee: number;
  createdAt: Date;
}

export interface AppointmentSlot {
  date: Date;
  timeSlot: string;
  available: boolean;
  doctorId: string;
}
