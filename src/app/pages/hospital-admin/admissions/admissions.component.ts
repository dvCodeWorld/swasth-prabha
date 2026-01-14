import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-admissions',
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="admissions-container">
      <h1>Patient Admissions</h1>
      <p>Manage patient admissions and discharges.</p>

      <button mat-raised-button color="primary">
        <mat-icon>person_add</mat-icon>
        New Admission
      </button>
    </div>
  `,
  styles: [
    `
      .admissions-container {
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
export class AdmissionsComponent {}
