import { Injectable, inject, signal, computed } from '@angular/core';
import { ApiService } from './api.service';
import { Hospital, BedUpdate } from '../models/hospital.models';
import { interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HospitalService {
  private apiService = inject(ApiService);

  private hospitalsSignal = signal<Hospital[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  hospitals = this.hospitalsSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  verifiedHospitals = computed(() => this.hospitalsSignal().filter((h) => h.verified));

  availableBedsCount = computed(() =>
    this.hospitalsSignal().reduce((sum, h) => sum + h.availableBeds, 0)
  );

  loadHospitals(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.apiService.getHospitals().subscribe({
      next: (hospitals) => {
        this.hospitalsSignal.set(hospitals);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set('Failed to load hospitals');
        this.loadingSignal.set(false);
        console.error('Error loading hospitals:', error);
      },
    });
  }

  startPolling(intervalMs: number = 5000): void {
    interval(intervalMs)
      .pipe(switchMap(() => this.apiService.getHospitals()))
      .subscribe({
        next: (hospitals) => {
          this.hospitalsSignal.set(hospitals);
        },
        error: (error) => {
          console.error('Polling error:', error);
        },
      });
  }

  updateBedAvailability(hospitalId: string, bedUpdate: Partial<BedUpdate>): void {
    this.apiService.updateBedAvailability(hospitalId, bedUpdate).subscribe({
      next: (updatedHospital) => {
        const hospitals = this.hospitalsSignal();
        const index = hospitals.findIndex((h) => h.id === hospitalId);
        if (index !== -1) {
          const updated = [...hospitals];
          updated[index] = updatedHospital;
          this.hospitalsSignal.set(updated);
        }
      },
      error: (error) => {
        this.errorSignal.set('Failed to update bed availability');
        console.error('Error updating beds:', error);
      },
    });
  }

  getHospitalById(id: string): Hospital | undefined {
    return this.hospitalsSignal().find((h) => h.id === id);
  }

  filterByAvailability(hasAvailableBeds: boolean): Hospital[] {
    return this.hospitalsSignal().filter((h) => (hasAvailableBeds ? h.availableBeds > 0 : true));
  }

  filterByType(type: 'Government' | 'Private' | 'All'): Hospital[] {
    if (type === 'All') return this.hospitalsSignal();
    return this.hospitalsSignal().filter((h) => h.type === type);
  }

  updateHospital(id: string, updates: Partial<Hospital>): void {
    this.apiService.updateHospital(id, updates).subscribe({
      next: (updatedHospital) => {
        const hospitals = this.hospitalsSignal();
        const index = hospitals.findIndex((h) => h.id === id);
        if (index !== -1) {
          const updated = [...hospitals];
          updated[index] = updatedHospital;
          this.hospitalsSignal.set(updated);
        }
      },
      error: (error) => {
        this.errorSignal.set('Failed to update hospital');
        console.error('Error updating hospital:', error);
      },
    });
  }
}
