import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hospital, BedUpdate, PatientAdmission } from '../models/hospital.models';
import { Doctor } from '../models/doctor.models';
import { Patient, MedicalRecord } from '../models/patient.models';
import { Appointment } from '../models/appointment.models';
import { User, LoginCredentials, AuthResponse } from '../models/user.models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://62.72.57.68:3000';

  getHospitals(): Observable<Hospital[]> {
    return this.http.get<Hospital[]>(`${this.baseUrl}/hospitals`);
  }

  getHospitalById(id: string): Observable<Hospital> {
    return this.http.get<Hospital>(`${this.baseUrl}/hospitals/${id}`);
  }

  updateHospital(id: string, hospital: Partial<Hospital>): Observable<Hospital> {
    return this.http.patch<Hospital>(`${this.baseUrl}/hospitals/${id}`, hospital);
  }

  updateBedAvailability(id: string, bedUpdate: Partial<BedUpdate>): Observable<Hospital> {
    return this.http.patch<Hospital>(`${this.baseUrl}/hospitals/${id}`, bedUpdate);
  }

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.baseUrl}/doctors`);
  }

  getDoctorById(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.baseUrl}/doctors/${id}`);
  }

  getDoctorsByHospital(hospitalId: string): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.baseUrl}/doctors?hospitalId=${hospitalId}`);
  }

  createDoctor(doctor: Omit<Doctor, 'id'>): Observable<Doctor> {
    return this.http.post<Doctor>(`${this.baseUrl}/doctors`, doctor);
  }

  updateDoctor(id: string, doctor: Partial<Doctor>): Observable<Doctor> {
    return this.http.patch<Doctor>(`${this.baseUrl}/doctors/${id}`, doctor);
  }

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.baseUrl}/patients`);
  }

  getPatientById(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.baseUrl}/patients/${id}`);
  }

  createPatient(patient: Omit<Patient, 'id'>): Observable<Patient> {
    return this.http.post<Patient>(`${this.baseUrl}/patients`, patient);
  }

  getMedicalRecords(patientId: string): Observable<MedicalRecord[]> {
    return this.http.get<MedicalRecord[]>(`${this.baseUrl}/medicalRecords?patientId=${patientId}`);
  }

  createMedicalRecord(record: Omit<MedicalRecord, 'id'>): Observable<MedicalRecord> {
    return this.http.post<MedicalRecord>(`${this.baseUrl}/medicalRecords`, record);
  }

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.baseUrl}/appointments`);
  }

  getAppointmentsByPatient(patientId: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.baseUrl}/appointments?patientId=${patientId}`);
  }

  getAppointmentsByDoctor(doctorId: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.baseUrl}/appointments?doctorId=${doctorId}`);
  }

  createAppointment(appointment: Omit<Appointment, 'id'>): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.baseUrl}/appointments`, appointment);
  }

  updateAppointment(id: string, appointment: Partial<Appointment>): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.baseUrl}/appointments/${id}`, appointment);
  }

  getAdmissions(hospitalId: string): Observable<PatientAdmission[]> {
    return this.http.get<PatientAdmission[]>(`${this.baseUrl}/admissions?hospitalId=${hospitalId}`);
  }

  createAdmission(admission: Omit<PatientAdmission, 'id'>): Observable<PatientAdmission> {
    return this.http.post<PatientAdmission>(`${this.baseUrl}/admissions`, admission);
  }

  updateAdmission(id: string, admission: Partial<PatientAdmission>): Observable<PatientAdmission> {
    return this.http.patch<PatientAdmission>(`${this.baseUrl}/admissions/${id}`, admission);
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }
}
