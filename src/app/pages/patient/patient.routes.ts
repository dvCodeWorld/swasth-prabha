import { Routes } from '@angular/router';

export const PATIENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./patient-layout/patient-layout.component').then((m) => m.PatientLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'bed-availability',
        loadComponent: () =>
          import('./bed-availability/bed-availability.component').then(
            (m) => m.BedAvailabilityComponent
          ),
      },
      {
        path: 'doctors',
        loadComponent: () => import('./doctors/doctors.component').then((m) => m.DoctorsComponent),
      },
      {
        path: 'book-appointment/:doctorId',
        loadComponent: () =>
          import('./book-appointment/book-appointment.component').then(
            (m) => m.BookAppointmentComponent
          ),
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('./appointments/appointments.component').then((m) => m.AppointmentsComponent),
      },
      {
        path: 'medical-records',
        loadComponent: () =>
          import('./medical-records/medical-records.component').then(
            (m) => m.MedicalRecordsComponent
          ),
      },
    ],
  },
];
