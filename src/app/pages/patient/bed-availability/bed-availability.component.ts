import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.models';

@Component({
  selector: 'app-bed-availability',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  template: `
    <div class="bed-availability-container">
      <div class="filters">
        <mat-form-field>
          <mat-label>Filter by Type</mat-label>
          <mat-select [(value)]="filterType" (selectionChange)="applyFilters()">
            <mat-option value="All">All Hospitals</mat-option>
            <mat-option value="Government">Government</mat-option>
            <mat-option value="Private">Private</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-chip-set>
          <mat-chip [class.selected]="showOnlyAvailable()" (click)="toggleAvailability()">
            <mat-icon>filter_list</mat-icon>
            Only Available
          </mat-chip>
        </mat-chip-set>
      </div>

      @if (hospitalService.loading()) {
      <div class="loading">Loading hospitals...</div>
      } @if (hospitalService.error()) {
      <div class="error">{{ hospitalService.error() }}</div>
      }

      <div class="hospitals-list">
        @for (hospital of filteredHospitals(); track hospital.id) {
        <mat-card class="hospital-card">
          <div class="hospital-header">
            <div>
              <h3>{{ hospital.name }}</h3>
              <p class="location">
                <mat-icon>location_on</mat-icon>
                {{ hospital.location }}
              </p>
              <mat-chip [class.verified]="hospital.verified">
                @if (hospital.verified) {
                <mat-icon>verified</mat-icon>
                }
                {{ hospital.type }}
              </mat-chip>
            </div>
          </div>

          <div class="bed-stats">
            <div class="bed-category">
              <div class="bed-header">
                <mat-icon>hotel</mat-icon>
                <span>General Beds</span>
              </div>
              <div class="bed-count">
                <span class="available">{{ hospital.availableBeds }}</span>
                <span class="total">/ {{ hospital.totalBeds }}</span>
              </div>
              <div class="progress-bar">
                <div
                  class="progress"
                  [style.width.%]="getPercentage(hospital.availableBeds, hospital.totalBeds)"
                ></div>
              </div>
            </div>

            <div class="bed-category">
              <div class="bed-header">
                <mat-icon>local_hospital</mat-icon>
                <span>ICU Beds</span>
              </div>
              <div class="bed-count">
                <span class="available">{{ hospital.icuAvailable }}</span>
                <span class="total">/ {{ hospital.icuBeds }}</span>
              </div>
              <div class="progress-bar">
                <div
                  class="progress icu"
                  [style.width.%]="getPercentage(hospital.icuAvailable, hospital.icuBeds)"
                ></div>
              </div>
            </div>

            <div class="bed-category">
              <div class="bed-header">
                <mat-icon>child_care</mat-icon>
                <span>SNCU Beds</span>
              </div>
              <div class="bed-count">
                <span class="available">{{ hospital.sncuAvailable }}</span>
                <span class="total">/ {{ hospital.sncuBeds }}</span>
              </div>
              <div class="progress-bar">
                <div
                  class="progress sncu"
                  [style.width.%]="getPercentage(hospital.sncuAvailable, hospital.sncuBeds)"
                ></div>
              </div>
            </div>

            <div class="bed-category">
              <div class="bed-header">
                <mat-icon>emergency</mat-icon>
                <span>Emergency Beds</span>
              </div>
              <div class="bed-count">
                <span class="available">{{ hospital.emergencyAvailable }}</span>
                <span class="total">/ {{ hospital.emergencyBeds }}</span>
              </div>
              <div class="progress-bar">
                <div
                  class="progress emergency"
                  [style.width.%]="
                    getPercentage(hospital.emergencyAvailable, hospital.emergencyBeds)
                  "
                ></div>
              </div>
            </div>
          </div>

          <div class="hospital-actions">
            <button mat-button>
              <mat-icon>phone</mat-icon>
              {{ hospital.phone }}
            </button>
            <button mat-raised-button color="primary">
              <mat-icon>directions</mat-icon>
              Get Directions
            </button>
          </div>
        </mat-card>
        } @empty {
        <div class="no-results">
          <mat-icon>search_off</mat-icon>
          <p>No hospitals found matching your criteria</p>
        </div>
        }
      </div>

      <div class="last-updated">
        <mat-icon>update</mat-icon>
        <span>Auto-refreshing every 10 seconds</span>
      </div>
    </div>
  `,
  styles: [
    `
      .bed-availability-container {
        padding: 1rem;
      }

      .filters {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
        align-items: center;
      }

      mat-form-field {
        flex: 1;
        min-width: 200px;
      }

      mat-chip {
        cursor: pointer;
      }

      mat-chip.selected {
        background-color: #2e7d32;
        color: white;
      }

      .loading,
      .error {
        text-align: center;
        padding: 2rem;
        color: #616161;
      }

      .error {
        color: #c62828;
      }

      .hospitals-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .hospital-card {
        padding: 1.5rem;
      }

      .hospital-header h3 {
        margin: 0 0 0.5rem 0;
        color: #1b5e20;
        font-size: 1.3rem;
      }

      .location {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        margin: 0.5rem 0;
        color: #616161;
        font-size: 0.9rem;
      }

      .location mat-icon {
        font-size: 1.2rem;
        width: 1.2rem;
        height: 1.2rem;
      }

      mat-chip.verified {
        background-color: #e8f5e9;
        color: #2e7d32;
      }

      mat-chip mat-icon {
        font-size: 1rem;
        width: 1rem;
        height: 1rem;
      }

      .bed-stats {
        margin: 1.5rem 0;
        display: grid;
        gap: 1rem;
      }

      .bed-category {
        padding: 1rem;
        background: #f5f5f5;
        border-radius: 8px;
      }

      .bed-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        color: #424242;
        font-weight: 500;
      }

      .bed-header mat-icon {
        font-size: 1.5rem;
        width: 1.5rem;
        height: 1.5rem;
        color: #2e7d32;
      }

      .bed-count {
        display: flex;
        align-items: baseline;
        gap: 0.25rem;
        margin-bottom: 0.5rem;
      }

      .bed-count .available {
        font-size: 1.8rem;
        font-weight: 600;
        color: #2e7d32;
      }

      .bed-count .total {
        font-size: 1.2rem;
        color: #616161;
      }

      .progress-bar {
        height: 8px;
        background: #e0e0e0;
        border-radius: 4px;
        overflow: hidden;
      }

      .progress {
        height: 100%;
        background: #4caf50;
        transition: width 0.3s ease;
      }

      .progress.icu {
        background: #ff9800;
      }

      .progress.sncu {
        background: #2196f3;
      }

      .progress.emergency {
        background: #f44336;
      }

      .hospital-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        margin-top: 1rem;
      }

      .hospital-actions button {
        flex: 1;
        min-width: 150px;
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

      .last-updated {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 2rem;
        padding: 1rem;
        background: #e8f5e9;
        border-radius: 8px;
        color: #2e7d32;
      }

      .last-updated mat-icon {
        animation: rotate 2s linear infinite;
      }

      @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      @media (max-width: 768px) {
        .bed-stats {
          grid-template-columns: 1fr;
        }

        .hospital-actions {
          flex-direction: column;
        }

        .hospital-actions button {
          width: 100%;
        }
      }
    `,
  ],
})
export class BedAvailabilityComponent implements OnInit {
  protected hospitalService = inject(HospitalService);

  filterType = signal<'All' | 'Government' | 'Private'>('All');
  showOnlyAvailable = signal(false);
  filteredHospitals = signal<Hospital[]>([]);

  ngOnInit(): void {
    this.hospitalService.loadHospitals();
    this.hospitalService.startPolling(10000);
    this.applyFilters();
  }

  applyFilters(): void {
    let hospitals = this.hospitalService.hospitals();

    if (this.filterType() !== 'All') {
      hospitals = hospitals.filter((h) => h.type === this.filterType());
    }

    if (this.showOnlyAvailable()) {
      hospitals = hospitals.filter((h) => h.availableBeds > 0);
    }

    this.filteredHospitals.set(hospitals);
  }

  toggleAvailability(): void {
    this.showOnlyAvailable.update((v) => !v);
    this.applyFilters();
  }

  getPercentage(available: number, total: number): number {
    if (total === 0) return 0;
    return (available / total) * 100;
  }
}
