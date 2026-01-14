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
  selector: 'app-hospital-admin-layout',
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
      <mat-sidenav #drawer class="sidenav" mode="side" opened>
        <mat-toolbar color="primary">
          <span>Hospital Admin</span>
        </mat-toolbar>
        <mat-nav-list>
          <a mat-list-item routerLink="/hospital-admin/dashboard" routerLinkActive="active">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/hospital-admin/bed-management" routerLinkActive="active">
            <mat-icon matListItemIcon>hotel</mat-icon>
            <span matListItemTitle>Bed Management</span>
          </a>
          <a mat-list-item routerLink="/hospital-admin/doctors" routerLinkActive="active">
            <mat-icon matListItemIcon>medical_services</mat-icon>
            <span matListItemTitle>Doctors</span>
          </a>
          <a mat-list-item routerLink="/hospital-admin/admissions" routerLinkActive="active">
            <mat-icon matListItemIcon>person_add</mat-icon>
            <span matListItemTitle>Admissions</span>
          </a>
          <a mat-list-item (click)="logout()">
            <mat-icon matListItemIcon>logout</mat-icon>
            <span matListItemTitle>Logout</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <span class="toolbar-title">{{ pageTitle() }}</span>
          <span class="spacer"></span>
          <span class="hospital-name">{{ hospitalName }}</span>
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
        width: 250px;
      }

      .toolbar-title {
        font-size: 1.2rem;
        font-weight: 500;
      }

      .spacer {
        flex: 1 1 auto;
      }

      .hospital-name {
        font-size: 0.9rem;
        opacity: 0.9;
      }

      .content {
        padding: 2rem;
      }

      mat-nav-list a.active {
        background-color: rgba(255, 255, 255, 0.1);
      }
    `,
  ],
})
export class HospitalAdminLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  pageTitle = signal('Dashboard');
  hospitalName = 'City Hospital, Shahdol';

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
    if (url.includes('dashboard')) this.pageTitle.set('Dashboard');
    else if (url.includes('bed-management')) this.pageTitle.set('Bed Management');
    else if (url.includes('doctors')) this.pageTitle.set('Doctors');
    else if (url.includes('admissions')) this.pageTitle.set('Patient Admissions');
  }
}
