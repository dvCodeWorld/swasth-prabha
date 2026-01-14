import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HospitalService } from '../../../services/hospital.service';

@Component({
  selector: 'app-bed-management',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <div class="bed-management-container">
      <h1>Bed Management</h1>

      <mat-card class="bed-form-card">
        <h2>Update Bed Availability</h2>
        <form [formGroup]="bedForm" (ngSubmit)="updateBeds()">
          <div class="form-grid">
            <div class="bed-section">
              <h3><mat-icon>hotel</mat-icon> General Beds</h3>
              <mat-form-field>
                <mat-label>Total Beds</mat-label>
                <input matInput type="number" formControlName="totalBeds" />
              </mat-form-field>
              <mat-form-field>
                <mat-label>Available Beds</mat-label>
                <input matInput type="number" formControlName="availableBeds" />
              </mat-form-field>
            </div>

            <div class="bed-section">
              <h3><mat-icon>local_hospital</mat-icon> ICU Beds</h3>
              <mat-form-field>
                <mat-label>Total ICU Beds</mat-label>
                <input matInput type="number" formControlName="icuBeds" />
              </mat-form-field>
              <mat-form-field>
                <mat-label>Available ICU Beds</mat-label>
                <input matInput type="number" formControlName="icuAvailable" />
              </mat-form-field>
            </div>

            <div class="bed-section">
              <h3><mat-icon>child_care</mat-icon> SNCU Beds</h3>
              <mat-form-field>
                <mat-label>Total SNCU Beds</mat-label>
                <input matInput type="number" formControlName="sncuBeds" />
              </mat-form-field>
              <mat-form-field>
                <mat-label>Available SNCU Beds</mat-label>
                <input matInput type="number" formControlName="sncuAvailable" />
              </mat-form-field>
            </div>

            <div class="bed-section">
              <h3><mat-icon>emergency</mat-icon> Emergency Beds</h3>
              <mat-form-field>
                <mat-label>Total Emergency Beds</mat-label>
                <input matInput type="number" formControlName="emergencyBeds" />
              </mat-form-field>
              <mat-form-field>
                <mat-label>Available Emergency Beds</mat-label>
                <input matInput type="number" formControlName="emergencyAvailable" />
              </mat-form-field>
            </div>
          </div>

          <div class="actions">
            <button mat-raised-button color="primary" type="submit">
              <mat-icon>save</mat-icon>
              Update Bed Status
            </button>
          </div>
        </form>
      </mat-card>

      <div class="success-message" *ngIf="showSuccess()">
        <mat-icon>check_circle</mat-icon>
        Bed availability updated successfully!
      </div>
    </div>
  `,
  styles: [
    `
      .bed-management-container {
        max-width: 1200px;
      }

      h1 {
        color: #1b5e20;
        margin-bottom: 2rem;
      }

      .bed-form-card {
        padding: 2rem;
      }

      .bed-form-card h2 {
        color: #1b5e20;
        margin-bottom: 2rem;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
      }

      .bed-section h3 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #2e7d32;
        margin-bottom: 1rem;
      }

      .bed-section mat-icon {
        font-size: 1.5rem;
        width: 1.5rem;
        height: 1.5rem;
      }

      mat-form-field {
        width: 100%;
        margin-bottom: 1rem;
      }

      .actions {
        text-align: right;
      }

      .success-message {
        margin-top: 1.5rem;
        padding: 1rem;
        background: #e8f5e9;
        color: #2e7d32;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .success-message mat-icon {
        color: #4caf50;
      }
    `,
  ],
})
export class BedManagementComponent implements OnInit {
  private fb = inject(FormBuilder);
  private hospitalService = inject(HospitalService);

  bedForm!: FormGroup;
  showSuccess = signal(false);

  ngOnInit(): void {
    this.hospitalService.loadHospitals();
    const hospital = this.hospitalService.hospitals()[0];

    this.bedForm = this.fb.group({
      totalBeds: [hospital?.totalBeds || 0],
      availableBeds: [hospital?.availableBeds || 0],
      icuBeds: [hospital?.icuBeds || 0],
      icuAvailable: [hospital?.icuAvailable || 0],
      sncuBeds: [hospital?.sncuBeds || 0],
      sncuAvailable: [hospital?.sncuAvailable || 0],
      emergencyBeds: [hospital?.emergencyBeds || 0],
      emergencyAvailable: [hospital?.emergencyAvailable || 0],
    });
  }

  updateBeds(): void {
    const hospital = this.hospitalService.hospitals()[0];
    if (hospital) {
      this.hospitalService.updateBedAvailability(hospital.id, this.bedForm.value);
      this.showSuccess.set(true);
      setTimeout(() => this.showSuccess.set(false), 3000);
    }
  }
}
