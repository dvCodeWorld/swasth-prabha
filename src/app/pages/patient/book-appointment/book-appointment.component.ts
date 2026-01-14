import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { DoctorService } from '../../../services/doctor.service';
import { AppointmentService } from '../../../services/appointment.service';
import { AuthService } from '../../../services/auth.service';
import { Doctor } from '../../../models/doctor.models';

@Component({
  selector: 'app-book-appointment',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
  ],
  template: `
    <div class="book-appointment-container">
      @if (doctor()) {
      <mat-card class="doctor-summary">
        <div class="doctor-header">
          <mat-icon>person</mat-icon>
          <div>
            <h3>{{ doctor()!.name }}</h3>
            <p>{{ doctor()!.speciality }}</p>
            <p class="hospital">{{ doctor()!.hospitalName }}</p>
          </div>
        </div>
      </mat-card>

      <mat-card class="appointment-form-card">
        <h2>Book Appointment</h2>

        <form [formGroup]="appointmentForm" (ngSubmit)="submitAppointment()">
          <mat-form-field>
            <mat-label>Appointment Type</mat-label>
            <mat-select formControlName="type">
              <mat-option value="Video">Video Consultation</mat-option>
              <mat-option value="Clinic">Clinic Visit</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Select Date</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="date" [min]="minDate" />
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Time Slot</mat-label>
            <mat-select formControlName="timeSlot">
              @for (slot of timeSlots; track slot) {
              <mat-option [value]="slot">{{ slot }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Patient Name</mat-label>
            <input matInput formControlName="patientName" placeholder="Enter patient name" />
          </mat-form-field>

          <mat-form-field>
            <mat-label>Phone Number</mat-label>
            <input matInput formControlName="phone" placeholder="10-digit mobile number" />
          </mat-form-field>

          <mat-form-field>
            <mat-label>Symptoms (Optional)</mat-label>
            <textarea
              matInput
              formControlName="symptoms"
              rows="3"
              placeholder="Describe your symptoms"
            ></textarea>
          </mat-form-field>

          <div class="fee-section">
            <div class="fee-item">
              <span>Consultation Fee</span>
              <span class="amount">₹{{ doctor()!.consultationFee }}</span>
            </div>
            <div class="fee-item total">
              <span>Total Amount</span>
              <span class="amount">₹{{ doctor()!.consultationFee }}</span>
            </div>
          </div>

          <div class="actions">
            <button mat-button type="button" (click)="goBack()">Cancel</button>
            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="!appointmentForm.valid"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </mat-card>
      } @else {
      <div class="loading">Loading doctor details...</div>
      }
    </div>
  `,
  styles: [
    `
      .book-appointment-container {
        padding: 1rem;
        max-width: 600px;
        margin: 0 auto;
      }

      .doctor-summary {
        margin-bottom: 1.5rem;
        padding: 1.5rem;
      }

      .doctor-header {
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      .doctor-header mat-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        color: #2e7d32;
        background: #e8f5e9;
        border-radius: 50%;
        padding: 0.5rem;
      }

      .doctor-header h3 {
        margin: 0;
        color: #1b5e20;
      }

      .doctor-header p {
        margin: 0.25rem 0;
        color: #616161;
      }

      .hospital {
        font-size: 0.9rem;
      }

      .appointment-form-card {
        padding: 1.5rem;
      }

      .appointment-form-card h2 {
        margin: 0 0 1.5rem 0;
        color: #1b5e20;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      mat-form-field {
        width: 100%;
      }

      .fee-section {
        margin: 1.5rem 0;
        padding: 1rem;
        background: #f5f5f5;
        border-radius: 8px;
      }

      .fee-item {
        display: flex;
        justify-content: space-between;
        margin: 0.5rem 0;
      }

      .fee-item.total {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 2px solid #e0e0e0;
        font-weight: 600;
        font-size: 1.1rem;
      }

      .amount {
        color: #2e7d32;
        font-weight: 600;
      }

      .actions {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
      }

      .actions button {
        flex: 1;
      }

      .loading {
        text-align: center;
        padding: 3rem;
        color: #616161;
      }
    `,
  ],
})
export class BookAppointmentComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private doctorService = inject(DoctorService);
  private appointmentService = inject(AppointmentService);
  private authService = inject(AuthService);

  doctor = signal<Doctor | null>(null);
  appointmentForm!: FormGroup;
  minDate = new Date();

  timeSlots = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
    '04:30 PM',
    '05:00 PM',
    '05:30 PM',
    '06:00 PM',
  ];

  ngOnInit(): void {
    this.initForm();
    this.loadDoctor();
  }

  private initForm(): void {
    const user = this.authService.currentUser();
    this.appointmentForm = this.fb.group({
      type: ['Video', Validators.required],
      date: [null, Validators.required],
      timeSlot: ['', Validators.required],
      patientName: [user?.name || '', Validators.required],
      phone: [user?.phone || '', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      symptoms: [''],
    });
  }

  private loadDoctor(): void {
    const doctorId = this.route.snapshot.paramMap.get('doctorId');
    if (doctorId) {
      this.doctorService.loadDoctors();
      const foundDoctor = this.doctorService.doctors().find((d) => d.id === doctorId);
      if (foundDoctor) {
        this.doctor.set(foundDoctor);
      }
    }
  }

  submitAppointment(): void {
    if (this.appointmentForm.valid && this.doctor()) {
      const formValue = this.appointmentForm.value;
      const user = this.authService.currentUser();

      const appointment = {
        patientId: user?.id || '1',
        patientName: formValue.patientName,
        patientPhone: formValue.phone,
        doctorId: this.doctor()!.id,
        doctorName: this.doctor()!.name,
        hospitalId: this.doctor()!.hospitalId,
        hospitalName: this.doctor()!.hospitalName,
        appointmentDate: formValue.date,
        timeSlot: formValue.timeSlot,
        type: formValue.type,
        status: 'Scheduled' as const,
        symptoms: formValue.symptoms,
        consultationFee: this.doctor()!.consultationFee,
        createdAt: new Date(),
      };

      this.appointmentService.createAppointment(appointment);
      alert('Appointment booked successfully!');
      this.router.navigate(['/patient/appointments']);
    }
  }

  goBack(): void {
    this.router.navigate(['/patient/doctors']);
  }
}
