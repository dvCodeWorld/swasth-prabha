import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { HospitalService } from '../../../services/hospital.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-super-admin-dashboard',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatChipsModule,
  ],
  template: `
    <div class="super-admin-container">
      <div class="header">
        <h1>Super Admin Dashboard</h1>
        <button mat-raised-button color="warn" (click)="logout()">
          <mat-icon>logout</mat-icon>
          Logout
        </button>
      </div>

      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-icon>local_hospital</mat-icon>
          <h3>{{ hospitalService.hospitals().length }}</h3>
          <p>Total Hospitals</p>
        </mat-card>

        <mat-card class="stat-card">
          <mat-icon>verified</mat-icon>
          <h3>{{ hospitalService.verifiedHospitals().length }}</h3>
          <p>Verified Hospitals</p>
        </mat-card>

        <mat-card class="stat-card">
          <mat-icon>hotel</mat-icon>
          <h3>{{ hospitalService.availableBedsCount() }}</h3>
          <p>Total Available Beds</p>
        </mat-card>
      </div>

      <mat-card class="hospitals-table-card">
        <h2>Hospital Management</h2>
        <table mat-table [dataSource]="hospitalService.hospitals()" class="hospitals-table">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Hospital Name</th>
            <td mat-cell *matCellDef="let hospital">{{ hospital.name }}</td>
          </ng-container>

          <ng-container matColumnDef="location">
            <th mat-header-cell *matHeaderCellDef>Location</th>
            <td mat-cell *matCellDef="let hospital">{{ hospital.location }}</td>
          </ng-container>

          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let hospital">
              <mat-chip>{{ hospital.type }}</mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="beds">
            <th mat-header-cell *matHeaderCellDef>Beds</th>
            <td mat-cell *matCellDef="let hospital">
              {{ hospital.availableBeds }} / {{ hospital.totalBeds }}
            </td>
          </ng-container>

          <ng-container matColumnDef="verified">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let hospital">
              <mat-chip [class.verified]="hospital.verified">
                {{ hospital.verified ? 'Verified' : 'Pending' }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let hospital">
              <button mat-button color="primary" (click)="toggleVerification(hospital)">
                {{ hospital.verified ? 'Revoke' : 'Verify' }}
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .super-admin-container {
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      h1 {
        color: #1b5e20;
        margin: 0;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
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

      .stat-card h3 {
        margin: 0.5rem 0;
        font-size: 2.5rem;
        color: #1b5e20;
      }

      .stat-card p {
        margin: 0;
        color: #616161;
      }

      .hospitals-table-card {
        padding: 2rem;
      }

      .hospitals-table-card h2 {
        color: #1b5e20;
        margin-bottom: 1.5rem;
      }

      .hospitals-table {
        width: 100%;
      }

      mat-chip.verified {
        background-color: #e8f5e9;
        color: #2e7d32;
      }

      @media (max-width: 768px) {
        .header {
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
        }
      }
    `,
  ],
})
export class SuperAdminDashboardComponent implements OnInit {
  protected hospitalService = inject(HospitalService);
  private authService = inject(AuthService);

  displayedColumns = ['name', 'location', 'type', 'beds', 'verified', 'actions'];

  ngOnInit(): void {
    this.hospitalService.loadHospitals();
  }

  toggleVerification(hospital: any): void {
    this.hospitalService.updateHospital(hospital.id, { verified: !hospital.verified });
  }

  logout(): void {
    this.authService.logout();
  }
}
