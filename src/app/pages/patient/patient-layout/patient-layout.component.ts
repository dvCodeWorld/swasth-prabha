import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-patient-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #drawer class="sidenav" [class.mat-elevation-z4]="true" mode="over">
        <mat-toolbar color="primary">
          <span>Swasth Prabha</span>
        </mat-toolbar>
        <mat-nav-list>
          <a
            mat-list-item
            routerLink="/patient/home"
            routerLinkActive="active"
            (click)="drawer.close()"
          >
            <mat-icon matListItemIcon>home</mat-icon>
            <span matListItemTitle>Home</span>
          </a>
          <a
            mat-list-item
            routerLink="/patient/bed-availability"
            routerLinkActive="active"
            (click)="drawer.close()"
          >
            <mat-icon matListItemIcon>hotel</mat-icon>
            <span matListItemTitle>Bed Availability</span>
          </a>
          <a
            mat-list-item
            routerLink="/patient/doctors"
            routerLinkActive="active"
            (click)="drawer.close()"
          >
            <mat-icon matListItemIcon>medical_services</mat-icon>
            <span matListItemTitle>Find Doctors</span>
          </a>
          <a
            mat-list-item
            routerLink="/patient/appointments"
            routerLinkActive="active"
            (click)="drawer.close()"
          >
            <mat-icon matListItemIcon>calendar_today</mat-icon>
            <span matListItemTitle>My Appointments</span>
          </a>
          <a
            mat-list-item
            routerLink="/patient/medical-records"
            routerLinkActive="active"
            (click)="drawer.close()"
          >
            <mat-icon matListItemIcon>description</mat-icon>
            <span matListItemTitle>Medical Records</span>
          </a>
          <a mat-list-item (click)="logout(); drawer.close()">
            <mat-icon matListItemIcon>logout</mat-icon>
            <span matListItemTitle>Logout</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary" class="toolbar">
          <button mat-icon-button (click)="drawer.toggle()">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="toolbar-title">{{ pageTitle() }}</span>
          <span class="spacer"></span>
          <button mat-icon-button>
            <mat-icon>notifications</mat-icon>
          </button>
        </mat-toolbar>

        <div class="content">
          <router-outlet />
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      .sidenav-container {
        height: 100vh;
      }

      .sidenav {
        width: 280px;
      }

      .toolbar {
        position: sticky;
        top: 0;
        z-index: 100;
      }

      .toolbar-title {
        font-size: 1.2rem;
        font-weight: 500;
      }

      .spacer {
        flex: 1 1 auto;
      }

      .content {
        padding: 1rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      mat-nav-list a.active {
        background-color: rgba(255, 255, 255, 0.1);
      }

      @media (max-width: 768px) {
        .content {
          padding: 0.5rem;
        }
      }
    `,
  ],
})
export class PatientLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  pageTitle = signal('Home');

  constructor() {
    this.router.events.subscribe(() => {
      this.updatePageTitle();
    });
  }

  logout(): void {
    this.authService.logout();
  }

  private updatePageTitle(): void {
    const url = this.router.url;
    if (url.includes('home')) this.pageTitle.set('Home');
    else if (url.includes('bed-availability')) this.pageTitle.set('Bed Availability');
    else if (url.includes('doctors')) this.pageTitle.set('Find Doctors');
    else if (url.includes('appointments')) this.pageTitle.set('My Appointments');
    else if (url.includes('medical-records')) this.pageTitle.set('Medical Records');
    else if (url.includes('book-appointment')) this.pageTitle.set('Book Appointment');
  }
}
