import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { AppointmentService } from '../../../services/appointment.service';
import { AuthService } from '../../../services/auth.service';
import { Appointment } from '../../../models/appointment.models';

@Component({
  selector: 'app-appointments',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTabsModule,
  ],
  template: `
    <div class="appointments-container">
      <mat-tab-group>
        <mat-tab label="Upcoming">
          <div class="appointments-list">
            @for (appointment of upcomingAppointments; track appointment.id) {
            <mat-card class="appointment-card">
              <div class="appointment-header">
                <div class="doctor-info">
                  <mat-icon>person</mat-icon>
                  <div>
                    <h3>{{ appointment.doctorName }}</h3>
                    <p>{{ appointment.hospitalName }}</p>
                  </div>
                </div>
                <mat-chip [class]="'status-' + appointment.status.toLowerCase()">
                  {{ appointment.status }}
                </mat-chip>
              </div>

              <div class="appointment-details">
                <div class="detail">
                  <mat-icon>calendar_today</mat-icon>
                  <span>{{ formatDate(appointment.appointmentDate) }}</span>
                </div>
                <div class="detail">
                  <mat-icon>schedule</mat-icon>
                  <span>{{ appointment.timeSlot }}</span>
                </div>
                <div class="detail">
                  <mat-icon>{{
                    appointment.type === 'Video' ? 'videocam' : 'local_hospital'
                  }}</mat-icon>
                  <span>{{ appointment.type }} Consultation</span>
                </div>
                <div class="detail">
                  <mat-icon>payments</mat-icon>
                  <span>₹{{ appointment.consultationFee }}</span>
                </div>
              </div>

              @if (appointment.symptoms) {
              <div class="symptoms"><strong>Symptoms:</strong> {{ appointment.symptoms }}</div>
              }

              <div class="actions">
                @if (appointment.type === 'Video' && appointment.status === 'Scheduled') {
                <button mat-raised-button color="primary">
                  <mat-icon>videocam</mat-icon>
                  Join Video Call
                </button>
                }
                <button mat-button (click)="cancelAppointment(appointment)">
                  <mat-icon>cancel</mat-icon>
                  Cancel
                </button>
              </div>
            </mat-card>
            } @empty {
            <div class="empty-state">
              <mat-icon>event_busy</mat-icon>
              <p>No upcoming appointments</p>
            </div>
            }
          </div>
        </mat-tab>

        <mat-tab label="Past">
          <div class="appointments-list">
            @for (appointment of pastAppointments; track appointment.id) {
            <mat-card class="appointment-card">
              <div class="appointment-header">
                <div class="doctor-info">
                  <mat-icon>person</mat-icon>
                  <div>
                    <h3>{{ appointment.doctorName }}</h3>
                    <p>{{ appointment.hospitalName }}</p>
                  </div>
                </div>
                <mat-chip [class]="'status-' + appointment.status.toLowerCase()">
                  {{ appointment.status }}
                </mat-chip>
              </div>

              <div class="appointment-details">
                <div class="detail">
                  <mat-icon>calendar_today</mat-icon>
                  <span>{{ formatDate(appointment.appointmentDate) }}</span>
                </div>
                <div class="detail">
                  <mat-icon>schedule</mat-icon>
                  <span>{{ appointment.timeSlot }}</span>
                </div>
              </div>

              <div class="actions">
                <button mat-button>
                  <mat-icon>refresh</mat-icon>
                  Book Again
                </button>
                <button mat-button>
                  <mat-icon>description</mat-icon>
                  View Prescription
                </button>
              </div>
            </mat-card>
            } @empty {
            <div class="empty-state">
              <mat-icon>history</mat-icon>
              <p>No past appointments</p>
            </div>
            }
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .appointments-container {
        padding: 1rem;
      }

      .appointments-list {
        padding: 1rem 0;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .appointment-card {
        padding: 1.5rem;
      }

      .appointment-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
      }

      .doctor-info {
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      .doctor-info mat-icon {
        font-size: 2.5rem;
        width: 2.5rem;
        height: 2.5rem;
        color: #2e7d32;
        background: #e8f5e9;
        border-radius: 50%;
        padding: 0.5rem;
      }

      .doctor-info h3 {
        margin: 0;
        color: #1b5e20;
      }

      .doctor-info p {
        margin: 0.25rem 0 0 0;
        color: #616161;
        font-size: 0.9rem;
      }

      mat-chip.status-scheduled {
        background-color: #e3f2fd;
        color: #1976d2;
      }

      mat-chip.status-completed {
        background-color: #e8f5e9;
        color: #2e7d32;
      }

      mat-chip.status-cancelled {
        background-color: #ffebee;
        color: #c62828;
      }

      .appointment-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
      }

      .detail {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #424242;
      }

      .detail mat-icon {
        font-size: 1.2rem;
        width: 1.2rem;
        height: 1.2rem;
        color: #2e7d32;
      }

      .symptoms {
        padding: 1rem;
        background: #f5f5f5;
        border-radius: 4px;
        margin: 1rem 0;
        color: #424242;
      }

      .actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        margin-top: 1rem;
      }

      .empty-state {
        text-align: center;
        padding: 3rem;
        color: #616161;
      }

      .empty-state mat-icon {
        font-size: 4rem;
        width: 4rem;
        height: 4rem;
        margin-bottom: 1rem;
      }

      @media (max-width: 768px) {
        .appointment-details {
          grid-template-columns: 1fr;
        }

        .actions {
          flex-direction: column;
        }

        .actions button {
          width: 100%;
        }
      }
    `,
  ],
})
export class AppointmentsComponent implements OnInit {
  private appointmentService = inject(AppointmentService);
  private authService = inject(AuthService);

  upcomingAppointments: Appointment[] = [];
  pastAppointments: Appointment[] = [];

  ngOnInit(): void {
    this.loadAppointments();
  }

  private loadAppointments(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.appointmentService.loadPatientAppointments(user.id);
      const allAppointments = this.appointmentService.appointments();
      const now = new Date();

      this.upcomingAppointments = allAppointments.filter(
        (a) => new Date(a.appointmentDate) >= now && a.status !== 'Cancelled'
      );

      this.pastAppointments = allAppointments.filter(
        (a) =>
          new Date(a.appointmentDate) < now || a.status === 'Completed' || a.status === 'Cancelled'
      );
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  cancelAppointment(appointment: Appointment): void {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.appointmentService.updateAppointmentStatus(appointment.id, 'Cancelled');
      this.loadAppointments();
    }
  }
}
