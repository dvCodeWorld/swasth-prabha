import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-landing',
  imports: [MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <div class="landing-container">
      <header class="header">
        <div class="logo">
          <mat-icon class="logo-icon">health_and_safety</mat-icon>
          <h1>Swasthprabha</h1>
        </div>
        <p class="tagline">Digital Healthcare Platform for Shahdol</p>
      </header>

      <main class="main-content">
        <section class="hero">
          <h2>Your Health, Our Priority</h2>
          <p>Find doctors, book appointments, check bed availability - all in one place</p>
        </section>

        <section class="role-selection">
          <h3>Select Your Role</h3>
          <div class="role-cards">
            <mat-card class="role-card" (click)="selectRole('Patient')">
              <mat-card-header>
                <mat-icon>person</mat-icon>
              </mat-card-header>
              <mat-card-content>
                <h4>Patient</h4>
                <p>Find doctors, book appointments, view medical records</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="role-card" (click)="selectRole('Hospital Admin')">
              <mat-card-header>
                <mat-icon>local_hospital</mat-icon>
              </mat-card-header>
              <mat-card-content>
                <h4>Hospital Admin</h4>
                <p>Manage beds, doctors, and patient admissions</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="role-card" (click)="selectRole('Super Admin')">
              <mat-card-header>
                <mat-icon>admin_panel_settings</mat-icon>
              </mat-card-header>
              <mat-card-content>
                <h4>Super Admin</h4>
                <p>Verify hospitals, monitor system, audit data</p>
              </mat-card-content>
            </mat-card>
          </div>
        </section>

        <section class="features">
          <h3>Key Features</h3>
          <div class="feature-grid">
            <div class="feature">
              <mat-icon>search</mat-icon>
              <h4>Find Doctors</h4>
              <p>Search by speciality, location, and availability</p>
            </div>
            <div class="feature">
              <mat-icon>hotel</mat-icon>
              <h4>Live Bed Availability</h4>
              <p>Real-time updates on hospital bed status</p>
            </div>
            <div class="feature">
              <mat-icon>calendar_today</mat-icon>
              <h4>Book Appointments</h4>
              <p>Schedule video or clinic consultations</p>
            </div>
            <div class="feature">
              <mat-icon>description</mat-icon>
              <h4>Medical Records</h4>
              <p>Access prescriptions and lab reports</p>
            </div>
          </div>
        </section>
      </main>

      <footer class="footer">
        <p>&copy; 2026 Swasth Prabha - Healthcare for Shahdol</p>
      </footer>
    </div>
  `,
  styles: [
    `
      .landing-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
        display: flex;
        flex-direction: column;
      }

      .header {
        background: #2e7d32;
        color: white;
        padding: 2rem;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .logo {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 0.5rem;
      }

      .logo-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
      }

      .header h1 {
        margin: 0;
        font-size: 2.5rem;
        font-weight: 600;
      }

      .tagline {
        margin: 0;
        font-size: 1.1rem;
        opacity: 0.9;
      }

      .main-content {
        flex: 1;
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
      }

      .hero {
        text-align: center;
        margin-bottom: 3rem;
      }

      .hero h2 {
        font-size: 2rem;
        color: #1b5e20;
        margin-bottom: 0.5rem;
      }

      .hero p {
        font-size: 1.2rem;
        color: #424242;
      }

      .role-selection {
        margin-bottom: 3rem;
      }

      .role-selection h3 {
        text-align: center;
        color: #1b5e20;
        margin-bottom: 1.5rem;
        font-size: 1.5rem;
      }

      .role-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .role-card {
        cursor: pointer;
        transition:
          transform 0.2s,
          box-shadow 0.2s;
        text-align: center;
        padding: 1.5rem;
      }

      .role-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
      }

      .role-card mat-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        color: #2e7d32;
        margin-bottom: 1rem;
      }

      .role-card h4 {
        color: #1b5e20;
        margin-bottom: 0.5rem;
      }

      .role-card p {
        color: #616161;
        font-size: 0.9rem;
      }

      .features {
        margin-top: 3rem;
      }

      .features h3 {
        text-align: center;
        color: #1b5e20;
        margin-bottom: 1.5rem;
        font-size: 1.5rem;
      }

      .feature-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
      }

      .feature {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .feature mat-icon {
        font-size: 2.5rem;
        width: 2.5rem;
        height: 2.5rem;
        color: #2e7d32;
        margin-bottom: 0.5rem;
      }

      .feature h4 {
        color: #1b5e20;
        margin-bottom: 0.5rem;
      }

      .feature p {
        color: #616161;
        font-size: 0.9rem;
      }

      .footer {
        background: #1b5e20;
        color: white;
        text-align: center;
        padding: 1.5rem;
        margin-top: auto;
      }

      .footer p {
        margin: 0;
      }

      @media (max-width: 768px) {
        .header h1 {
          font-size: 1.8rem;
        }

        .hero h2 {
          font-size: 1.5rem;
        }

        .role-cards {
          grid-template-columns: 1fr;
        }

        .feature-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class LandingComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  selectRole(role: 'Patient' | 'Hospital Admin' | 'Super Admin'): void {
    this.authService.mockLogin(role);
  }
}
