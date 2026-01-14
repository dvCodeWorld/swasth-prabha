import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-hospital-doctors',
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="doctors-container">
      <h1>Doctor Management</h1>
      <p>Manage your hospital's doctors, schedules, and availability.</p>

      <button mat-raised-button color="primary">
        <mat-icon>add</mat-icon>
        Add New Doctor
      </button>
    </div>
  `,
  styles: [
    `
      .doctors-container {
        max-width: 1200px;
      }

      h1 {
        color: #1b5e20;
        margin-bottom: 1rem;
      }

      p {
        color: #616161;
        margin-bottom: 2rem;
      }
    `,
  ],
})
export class HospitalDoctorsComponent {}
