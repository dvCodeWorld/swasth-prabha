import { Injectable, inject, signal, computed } from '@angular/core';
import { ApiService } from './api.service';
import { Doctor } from '../models/doctor.models';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private apiService = inject(ApiService);

  private doctorsSignal = signal<Doctor[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  doctors = this.doctorsSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  topRatedDoctors = computed(() =>
    this.doctorsSignal()
      .filter((d) => d.rating >= 4.0)
      .sort((a, b) => b.rating - a.rating)
  );

  loadDoctors(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.apiService.getDoctors().subscribe({
      next: (doctors) => {
        this.doctorsSignal.set(doctors);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set('Failed to load doctors');
        this.loadingSignal.set(false);
        console.error('Error loading doctors:', error);
      },
    });
  }

  getDoctorsBySpeciality(speciality: string): Doctor[] {
    return this.doctorsSignal().filter((d) =>
      d.speciality.toLowerCase().includes(speciality.toLowerCase())
    );
  }

  getDoctorsByHospital(hospitalId: string): Doctor[] {
    return this.doctorsSignal().filter((d) => d.hospitalId === hospitalId);
  }

  searchDoctors(query: string): Doctor[] {
    const lowerQuery = query.toLowerCase();
    return this.doctorsSignal().filter(
      (d) =>
        d.name.toLowerCase().includes(lowerQuery) ||
        d.speciality.toLowerCase().includes(lowerQuery) ||
        d.hospitalName.toLowerCase().includes(lowerQuery)
    );
  }

  createDoctor(doctor: Omit<Doctor, 'id'>): void {
    this.apiService.createDoctor(doctor).subscribe({
      next: (newDoctor) => {
        this.doctorsSignal.update((doctors) => [...doctors, newDoctor]);
      },
      error: (error) => {
        this.errorSignal.set('Failed to create doctor');
        console.error('Error creating doctor:', error);
      },
    });
  }

  updateDoctor(id: string, updates: Partial<Doctor>): void {
    this.apiService.updateDoctor(id, updates).subscribe({
      next: (updatedDoctor) => {
        const doctors = this.doctorsSignal();
        const index = doctors.findIndex((d) => d.id === id);
        if (index !== -1) {
          const updated = [...doctors];
          updated[index] = updatedDoctor;
          this.doctorsSignal.set(updated);
        }
      },
      error: (error) => {
        this.errorSignal.set('Failed to update doctor');
        console.error('Error updating doctor:', error);
      },
    });
  }
}
