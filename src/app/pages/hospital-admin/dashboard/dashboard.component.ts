import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { HospitalService } from '../../../services/hospital.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="dashboard-container">
      <h1>Hospital Dashboard</h1>

      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-icon>hotel</mat-icon>
          <h3>{{ hospital?.totalBeds || 0 }}</h3>
          <p>Total Beds</p>
        </mat-card>

        <mat-card class="stat-card available">
          <mat-icon>check_circle</mat-icon>
          <h3>{{ hospital?.availableBeds || 0 }}</h3>
          <p>Available Beds</p>
        </mat-card>

        <mat-card class="stat-card">
          <mat-icon>local_hospital</mat-icon>
          <h3>{{ hospital?.icuBeds || 0 }}</h3>
          <p>ICU Beds</p>
        </mat-card>

        <mat-card class="stat-card">
          <mat-icon>child_care</mat-icon>
          <h3>{{ hospital?.sncuBeds || 0 }}</h3>
          <p>SNCU Beds</p>
        </mat-card>
      </div>

      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <mat-card class="action-card" routerLink="/hospital-admin/bed-management">
            <mat-icon>hotel</mat-icon>
            <h3>Update Bed Status</h3>
            <p>Manage bed availability</p>
          </mat-card>

          <mat-card class="action-card" routerLink="/hospital-admin/admissions">
            <mat-icon>person_add</mat-icon>
            <h3>New Admission</h3>
            <p>Admit a patient</p>
          </mat-card>

          <mat-card class="action-card" routerLink="/hospital-admin/doctors">
            <mat-icon>medical_services</mat-icon>
            <h3>Manage Doctors</h3>
            <p>Add or update doctors</p>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        max-width: 1200px;
      }

      h1 {
        color: #1b5e20;
        margin-bottom: 2rem;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 3rem;
      }

      .stat-card {
        text-align: center;
        padding: 2rem;
      }

      .stat-card mat-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        color: #2e7d32;
        margin-bottom: 1rem;
      }

      .stat-card.available mat-icon {
        color: #4caf50;
      }

      .stat-card h3 {
        margin: 0.5rem 0;
        font-size: 2.5rem;
        color: #1b5e20;
      }

      .stat-card p {
        margin: 0;
        color: #616161;
      }

      .quick-actions h2 {
        color: #1b5e20;
        margin-bottom: 1.5rem;
      }

      .actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
      }

      .action-card {
        padding: 2rem;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        text-align: center;
      }

      .action-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
      }

      .action-card mat-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        color: #2e7d32;
        margin-bottom: 1rem;
      }

      .action-card h3 {
        margin: 0.5rem 0;
        color: #1b5e20;
      }

      .action-card p {
        margin: 0;
        color: #616161;
        font-size: 0.9rem;
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  private hospitalService = inject(HospitalService);
  hospital: any;

  ngOnInit(): void {
    this.hospitalService.loadHospitals();
    this.hospital = this.hospitalService.hospitals()[0];
  }
}
