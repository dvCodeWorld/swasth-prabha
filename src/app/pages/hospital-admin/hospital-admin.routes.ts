import { Routes } from '@angular/router';

export const HOSPITAL_ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./hospital-admin-layout/hospital-admin-layout.component').then(
        (m) => m.HospitalAdminLayoutComponent
      ),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'bed-management',
        loadComponent: () =>
          import('./bed-management/bed-management.component').then((m) => m.BedManagementComponent),
      },
      {
        path: 'doctors',
        loadComponent: () =>
          import('./doctors/doctors.component').then((m) => m.HospitalDoctorsComponent),
      },
      {
        path: 'admissions',
        loadComponent: () =>
          import('./admissions/admissions.component').then((m) => m.AdmissionsComponent),
      },
    ],
  },
];
