import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { DoctorService } from '../../../services/doctor.service';
import { Doctor } from '../../../models/doctor.models';

@Component({
  selector: 'app-doctors',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
  ],
  template: `
    <div class="doctors-container">
      <div class="search-section">
        <mat-form-field class="search-field">
          <mat-label>Search doctors by name or speciality</mat-label>
          <input
            matInput
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearch()"
            placeholder="e.g., Cardiologist"
          />
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>

      <div class="specialities">
        <h3>Popular Specialities</h3>
        <mat-chip-set>
          @for (spec of specialities; track spec) {
          <mat-chip (click)="filterBySpeciality(spec)">{{ spec }}</mat-chip>
          }
        </mat-chip-set>
      </div>

      @if (doctorService.loading()) {
      <div class="loading">Loading doctors...</div>
      }

      <div class="doctors-list">
        @for (doctor of filteredDoctors(); track doctor.id) {
        <mat-card class="doctor-card">
          <div class="doctor-header">
            <div class="doctor-avatar">
              <mat-icon>person</mat-icon>
            </div>
            <div class="doctor-info">
              <h3>{{ doctor.name }}</h3>
              <p class="speciality">{{ doctor.speciality }}</p>
              <p class="qualification">{{ doctor.qualification }}</p>
              <div class="rating">
                <mat-icon>star</mat-icon>
                <span>{{ doctor.rating }}</span>
                <span class="experience">• {{ doctor.experience }} years exp</span>
              </div>
            </div>
          </div>

          <div class="doctor-details">
            <div class="detail-item">
              <mat-icon>local_hospital</mat-icon>
              <span>{{ doctor.hospitalName }}</span>
            </div>
            <div class="detail-item">
              <mat-icon>payments</mat-icon>
              <span>₹{{ doctor.consultationFee }} consultation fee</span>
            </div>
          </div>

          <div class="availability">
            <mat-icon>schedule</mat-icon>
            <span>Available Today</span>
          </div>

          <div class="actions">
            <button mat-button (click)="callDoctor(doctor)">
              <mat-icon>phone</mat-icon>
              Call
            </button>
            <button mat-raised-button color="primary" (click)="bookAppointment(doctor)">
              <mat-icon>calendar_today</mat-icon>
              Book Appointment
            </button>
          </div>
        </mat-card>
        } @empty {
        <div class="no-results">
          <mat-icon>search_off</mat-icon>
          <p>No doctors found</p>
        </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .doctors-container {
        padding: 1rem;
      }

      .search-section {
        margin-bottom: 1.5rem;
      }

      .search-field {
        width: 100%;
      }

      .specialities {
        margin-bottom: 2rem;
      }

      .specialities h3 {
        color: #1b5e20;
        margin-bottom: 1rem;
      }

      mat-chip {
        cursor: pointer;
      }

      .loading {
        text-align: center;
        padding: 2rem;
        color: #616161;
      }

      .doctors-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .doctor-card {
        padding: 1.5rem;
      }

      .doctor-header {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .doctor-avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .doctor-avatar mat-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        color: #2e7d32;
      }

      .doctor-info {
        flex: 1;
      }

      .doctor-info h3 {
        margin: 0 0 0.25rem 0;
        color: #1b5e20;
        font-size: 1.3rem;
      }

      .speciality {
        margin: 0.25rem 0;
        color: #2e7d32;
        font-weight: 500;
      }

      .qualification {
        margin: 0.25rem 0;
        color: #616161;
        font-size: 0.9rem;
      }

      .rating {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        margin-top: 0.5rem;
        color: #f57c00;
      }

      .rating mat-icon {
        font-size: 1.2rem;
        width: 1.2rem;
        height: 1.2rem;
      }

      .rating span {
        font-weight: 600;
      }

      .experience {
        color: #616161;
        font-weight: 400;
      }

      .doctor-details {
        margin: 1rem 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .detail-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #424242;
      }

      .detail-item mat-icon {
        font-size: 1.2rem;
        width: 1.2rem;
        height: 1.2rem;
        color: #2e7d32;
      }

      .availability {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        background: #e8f5e9;
        border-radius: 4px;
        color: #2e7d32;
        margin: 1rem 0;
      }

      .availability mat-icon {
        font-size: 1.2rem;
        width: 1.2rem;
        height: 1.2rem;
      }

      .actions {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
      }

      .actions button {
        flex: 1;
      }

      .no-results {
        text-align: center;
        padding: 3rem;
        color: #616161;
      }

      .no-results mat-icon {
        font-size: 4rem;
        width: 4rem;
        height: 4rem;
        margin-bottom: 1rem;
      }

      @media (max-width: 768px) {
        .doctor-header {
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .actions {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class DoctorsComponent implements OnInit {
  protected doctorService = inject(DoctorService);
  private router = inject(Router);

  searchQuery = signal('');
  filteredDoctors = signal<Doctor[]>([]);

  specialities = [
    'Cardiologist',
    'Pediatrician',
    'Orthopedic',
    'Dermatologist',
    'Gynecologist',
    'General Physician',
  ];

  ngOnInit(): void {
    this.doctorService.loadDoctors();
    this.filteredDoctors.set(this.doctorService.doctors());
  }

  onSearch(): void {
    const query = this.searchQuery();
    if (query) {
      this.filteredDoctors.set(this.doctorService.searchDoctors(query));
    } else {
      this.filteredDoctors.set(this.doctorService.doctors());
    }
  }

  filterBySpeciality(speciality: string): void {
    this.filteredDoctors.set(this.doctorService.getDoctorsBySpeciality(speciality));
  }

  bookAppointment(doctor: Doctor): void {
    this.router.navigate(['/patient/book-appointment', doctor.id]);
  }

  callDoctor(doctor: Doctor): void {
    window.location.href = `tel:${doctor.phone}`;
  }
}
