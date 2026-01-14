import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Appointment } from '../models/appointment.models';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private apiService = inject(ApiService);

  private appointmentsSignal = signal<Appointment[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  appointments = this.appointmentsSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  loadAppointments(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.apiService.getAppointments().subscribe({
      next: (appointments) => {
        this.appointmentsSignal.set(appointments);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set('Failed to load appointments');
        this.loadingSignal.set(false);
        console.error('Error loading appointments:', error);
      },
    });
  }

  loadPatientAppointments(patientId: string): void {
    this.loadingSignal.set(true);
    this.apiService.getAppointmentsByPatient(patientId).subscribe({
      next: (appointments) => {
        this.appointmentsSignal.set(appointments);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set('Failed to load appointments');
        this.loadingSignal.set(false);
      },
    });
  }

  createAppointment(appointment: Omit<Appointment, 'id'>): void {
    this.apiService.createAppointment(appointment).subscribe({
      next: (newAppointment) => {
        this.appointmentsSignal.update((appts) => [...appts, newAppointment]);
      },
      error: (error) => {
        this.errorSignal.set('Failed to create appointment');
        console.error('Error creating appointment:', error);
      },
    });
  }

  updateAppointmentStatus(id: string, status: Appointment['status']): void {
    this.apiService.updateAppointment(id, { status }).subscribe({
      next: (updatedAppointment) => {
        const appointments = this.appointmentsSignal();
        const index = appointments.findIndex((a) => a.id === id);
        if (index !== -1) {
          const updated = [...appointments];
          updated[index] = updatedAppointment;
          this.appointmentsSignal.set(updated);
        }
      },
      error: (error) => {
        this.errorSignal.set('Failed to update appointment');
        console.error('Error updating appointment:', error);
      },
    });
  }

  getUpcomingAppointments(): Appointment[] {
    const now = new Date();
    return this.appointmentsSignal()
      .filter((a) => new Date(a.appointmentDate) >= now && a.status === 'Scheduled')
      .sort(
        (a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
      );
  }
}
