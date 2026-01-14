import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'patient',
    loadChildren: () => import('./pages/patient/patient.routes').then((m) => m.PATIENT_ROUTES),
  },
  {
    path: 'hospital-admin',
    loadChildren: () =>
      import('./pages/hospital-admin/hospital-admin.routes').then((m) => m.HOSPITAL_ADMIN_ROUTES),
  },
  {
    path: 'super-admin',
    loadChildren: () =>
      import('./pages/super-admin/super-admin.routes').then((m) => m.SUPER_ADMIN_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
