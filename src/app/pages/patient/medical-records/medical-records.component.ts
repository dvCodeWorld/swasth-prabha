import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MedicalRecord } from '../../../models/patient.models';

@Component({
  selector: 'app-medical-records',
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule],
  template: `
    <div class="medical-records-container">
      <div class="timeline">
        @for (record of records(); track record.id) {
        <div class="timeline-item">
          <div class="timeline-marker">
            <mat-icon>{{ getIcon(record.type) }}</mat-icon>
          </div>
          <mat-card class="record-card">
            <div class="record-header">
              <div>
                <h3>{{ record.title }}</h3>
                <p class="date">{{ formatDate(record.date) }}</p>
              </div>
              <mat-chip [class]="'type-' + record.type.toLowerCase().replace(' ', '-')">
                {{ record.type }}
              </mat-chip>
            </div>

            @if (record.doctorName) {
            <div class="record-detail">
              <mat-icon>person</mat-icon>
              <span>{{ record.doctorName }}</span>
            </div>
            } @if (record.hospitalName) {
            <div class="record-detail">
              <mat-icon>local_hospital</mat-icon>
              <span>{{ record.hospitalName }}</span>
            </div>
            }

            <div class="record-content">
              {{ record.content }}
            </div>

            <div class="actions">
              <button mat-button>
                <mat-icon>download</mat-icon>
                Download
              </button>
              <button mat-button>
                <mat-icon>share</mat-icon>
                Share
              </button>
            </div>
          </mat-card>
        </div>
        } @empty {
        <div class="empty-state">
          <mat-icon>folder_open</mat-icon>
          <p>No medical records found</p>
          <p class="hint">Your prescriptions and reports will appear here</p>
        </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .medical-records-container {
        padding: 1rem;
        max-width: 800px;
        margin: 0 auto;
      }

      .timeline {
        position: relative;
        padding-left: 3rem;
      }

      .timeline::before {
        content: '';
        position: absolute;
        left: 1.5rem;
        top: 0;
        bottom: 0;
        width: 2px;
        background: #e0e0e0;
      }

      .timeline-item {
        position: relative;
        margin-bottom: 2rem;
      }

      .timeline-marker {
        position: absolute;
        left: -2.5rem;
        top: 0;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        background: #2e7d32;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 0 4px white, 0 0 0 6px #e0e0e0;
      }

      .timeline-marker mat-icon {
        color: white;
        font-size: 1.5rem;
        width: 1.5rem;
        height: 1.5rem;
      }

      .record-card {
        padding: 1.5rem;
      }

      .record-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
      }

      .record-header h3 {
        margin: 0;
        color: #1b5e20;
      }

      .date {
        margin: 0.25rem 0 0 0;
        color: #616161;
        font-size: 0.9rem;
      }

      mat-chip.type-prescription {
        background-color: #e3f2fd;
        color: #1976d2;
      }

      mat-chip.type-lab-report {
        background-color: #fff3e0;
        color: #f57c00;
      }

      mat-chip.type-doctor-note {
        background-color: #f3e5f5;
        color: #7b1fa2;
      }

      mat-chip.type-discharge-summary {
        background-color: #e8f5e9;
        color: #2e7d32;
      }

      .record-detail {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0.5rem 0;
        color: #424242;
      }

      .record-detail mat-icon {
        font-size: 1.2rem;
        width: 1.2rem;
        height: 1.2rem;
        color: #2e7d32;
      }

      .record-content {
        margin: 1rem 0;
        padding: 1rem;
        background: #f5f5f5;
        border-radius: 4px;
        color: #424242;
        line-height: 1.6;
      }

      .actions {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
      }

      .empty-state {
        text-align: center;
        padding: 4rem 2rem;
        color: #616161;
      }

      .empty-state mat-icon {
        font-size: 5rem;
        width: 5rem;
        height: 5rem;
        margin-bottom: 1rem;
      }

      .hint {
        font-size: 0.9rem;
        margin-top: 0.5rem;
      }

      @media (max-width: 768px) {
        .timeline {
          padding-left: 2rem;
        }

        .timeline::before {
          left: 1rem;
        }

        .timeline-marker {
          left: -1.5rem;
          width: 2rem;
          height: 2rem;
        }

        .timeline-marker mat-icon {
          font-size: 1.2rem;
          width: 1.2rem;
          height: 1.2rem;
        }
      }
    `,
  ],
})
export class MedicalRecordsComponent {
  records = signal<MedicalRecord[]>([
    {
      id: '1',
      patientId: '1',
      type: 'Prescription',
      title: 'General Checkup Prescription',
      date: new Date('2026-01-10'),
      doctorName: 'Dr. Rajesh Kumar',
      hospitalName: 'City Hospital, Shahdol',
      content:
        'Paracetamol 500mg - 1 tablet twice daily for 3 days. Rest and plenty of fluids recommended.',
    },
    {
      id: '2',
      patientId: '1',
      type: 'Lab Report',
      title: 'Blood Test Report',
      date: new Date('2026-01-05'),
      hospitalName: 'Diagnostic Center, Shahdol',
      content:
        'Complete Blood Count (CBC) - All parameters within normal range. Hemoglobin: 13.5 g/dL',
    },
  ]);

  getIcon(type: string): string {
    const icons: Record<string, string> = {
      Prescription: 'medication',
      'Lab Report': 'science',
      'Doctor Note': 'note',
      'Discharge Summary': 'assignment',
    };
    return icons[type] || 'description';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
}
