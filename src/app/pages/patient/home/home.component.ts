import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HospitalService } from '../../../services/hospital.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="home-container">
      <div class="location-header">
        <mat-icon>location_on</mat-icon>
        <div>
          <h2>Shahdol</h2>
          <p>Madhya Pradesh, India</p>
        </div>
      </div>

      <div class="quick-stats">
        <mat-card class="stat-card">
          <mat-icon>hotel</mat-icon>
          <h3>{{ hospitalService.availableBedsCount() }}</h3>
          <p>Available Beds</p>
        </mat-card>
        <mat-card class="stat-card">
          <mat-icon>local_hospital</mat-icon>
          <h3>{{ hospitalService.verifiedHospitals().length }}</h3>
          <p>Hospitals</p>
        </mat-card>
      </div>

      <div class="services-grid">
        <mat-card class="service-card" (click)="navigate('/patient/doctors')">
          <mat-icon>medical_services</mat-icon>
          <h3>Find Doctor</h3>
          <p>Search by speciality</p>
        </mat-card>

        <mat-card class="service-card" (click)="navigate('/patient/appointments')">
          <mat-icon>calendar_today</mat-icon>
          <h3>Book Appointment</h3>
          <p>Video or clinic visit</p>
        </mat-card>

        <mat-card class="service-card" (click)="navigate('/patient/medical-records')">
          <mat-icon>description</mat-icon>
          <h3>Lab Tests</h3>
          <p>View reports</p>
        </mat-card>

        <mat-card class="service-card">
          <mat-icon>healing</mat-icon>
          <h3>Surgeries</h3>
          <p>Find specialists</p>
        </mat-card>

        <mat-card class="service-card" (click)="navigate('/patient/bed-availability')">
          <mat-icon>hotel</mat-icon>
          <h3>Hospital Beds</h3>
          <p>Live availability</p>
        </mat-card>

        <mat-card class="service-card">
          <mat-icon>verified_user</mat-icon>
          <h3>Ayushman Check</h3>
          <p>Verify eligibility</p>
        </mat-card>
      </div>

      <div class="emergency-section">
        <mat-card class="emergency-card">
          <mat-icon>emergency</mat-icon>
          <div>
            <h3>Emergency Services</h3>
            <p>24/7 Ambulance & Emergency Care</p>
            <button mat-raised-button color="warn">Call 108</button>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .home-container {
        padding: 1rem;
      }

      .location-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
        padding: 1rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .location-header mat-icon {
        font-size: 2rem;
        width: 2rem;
        height: 2rem;
        color: #2e7d32;
      }

      .location-header h2 {
        margin: 0;
        color: #1b5e20;
        font-size: 1.5rem;
      }

      .location-header p {
        margin: 0;
        color: #616161;
        font-size: 0.9rem;
      }

      .quick-stats {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .stat-card {
        text-align: center;
        padding: 1.5rem;
        cursor: default;
      }

      .stat-card mat-icon {
        font-size: 2.5rem;
        width: 2.5rem;
        height: 2.5rem;
        color: #2e7d32;
        margin-bottom: 0.5rem;
      }

      .stat-card h3 {
        margin: 0.5rem 0;
        font-size: 2rem;
        color: #1b5e20;
      }

      .stat-card p {
        margin: 0;
        color: #616161;
        font-size: 0.9rem;
      }

      .services-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .service-card {
        text-align: center;
        padding: 1.5rem;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
      }

      .service-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
      }

      .service-card mat-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        color: #2e7d32;
        margin-bottom: 0.5rem;
      }

      .service-card h3 {
        margin: 0.5rem 0;
        color: #1b5e20;
        font-size: 1.1rem;
      }

      .service-card p {
        margin: 0;
        color: #616161;
        font-size: 0.85rem;
      }

      .emergency-section {
        margin-top: 2rem;
      }

      .emergency-card {
        background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .emergency-card mat-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        color: #c62828;
      }

      .emergency-card h3 {
        margin: 0 0 0.5rem 0;
        color: #b71c1c;
      }

      .emergency-card p {
        margin: 0 0 1rem 0;
        color: #424242;
      }

      @media (max-width: 768px) {
        .services-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (max-width: 480px) {
        .quick-stats {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  protected hospitalService = inject(HospitalService);
  private router = inject(Router);

  ngOnInit(): void {
    this.hospitalService.loadHospitals();
    this.hospitalService.startPolling(10000);
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}
