# Swasth Prabha - Digital Healthcare Platform

A comprehensive Angular 21 PWA for healthcare management in Shahdol, Madhya Pradesh. This platform connects patients, hospitals, and administrators for seamless healthcare delivery.

## Features

### Patient Module

- 🏥 Real-time hospital bed availability (General, ICU, SNCU, Emergency)
- 👨‍⚕️ Doctor discovery by speciality and location
- 📅 Appointment booking (Video & Clinic consultations)
- 📋 Medical records timeline view
- 💊 Prescription management

### Hospital Admin Module

- 🛏️ Live bed status management
- 👥 Doctor roster management
- 📊 Patient admission tracking
- 📈 Dashboard analytics

### Super Admin Module

- ✅ Hospital verification system
- 📊 System-wide monitoring
- 🏥 Multi-hospital oversight

## Tech Stack

- **Framework**: Angular 21 with standalone components
- **State Management**: Signals
- **UI Library**: Angular Material 21
- **Styling**: SCSS with custom Wellness Green theme
- **Backend**: JSON Server (mock API)
- **PWA**: Service Workers enabled
- **Forms**: Reactive Forms
- **HTTP**: HttpClient with RxJS

## Prerequisites

- Node.js 18+ and npm 11+
- Angular CLI 21+

## Installation

1. **Clone the repository**

   ```bash
   cd swasth-prabha
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the mock backend**

   ```bash
   npm run backend
   ```

   This starts JSON Server on `http://localhost:3000`

4. **Start the development server**

   ```bash
   npm start
   ```

   Navigate to `http://localhost:4200`

5. **Run both concurrently**
   ```bash
   npm run dev
   ```

## Project Structure

```
src/app/
├── models/              # Data models and interfaces
│   ├── hospital.models.ts
│   ├── doctor.models.ts
│   ├── patient.models.ts
│   ├── appointment.models.ts
│   └── user.models.ts
├── services/            # Business logic and API calls
│   ├── api.service.ts
│   ├── hospital.service.ts
│   ├── doctor.service.ts
│   ├── appointment.service.ts
│   └── auth.service.ts
└── pages/               # Feature modules
    ├── landing/         # Role selection page
    ├── patient/         # Patient-facing features
    ├── hospital-admin/  # Hospital management
    └── super-admin/     # System administration
```

## User Roles & Access

### Patient

- **Email**: patient@test.com
- **Features**: Find doctors, book appointments, view medical records

### Hospital Admin

- **Email**: admin@hospital.com
- **Features**: Manage beds, doctors, and patient admissions

### Super Admin

- **Email**: super@admin.com
- **Features**: Verify hospitals, monitor system, audit data

## API Endpoints

The JSON Server provides REST endpoints:

- `GET /hospitals` - List all hospitals
- `GET /doctors` - List all doctors
- `GET /appointments` - List all appointments
- `POST /appointments` - Create appointment
- `PATCH /hospitals/:id` - Update hospital data

## Key Features Implementation

### Signals-based State Management

All services use Angular signals for reactive state:

```typescript
hospitals = signal<Hospital[]>([]);
loading = signal(false);
error = signal<string | null>(null);
```

### Real-time Bed Availability

Polling mechanism updates bed status every 10 seconds:

```typescript
startPolling(interval: number): void {
  this.pollingSubscription = interval(interval).subscribe(() => {
    this.loadHospitals();
  });
}
```

### Mobile-First Design

- Responsive layouts with CSS Grid and Flexbox
- Touch-friendly UI components
- Optimized for small screens

## Scripts

- `npm start` - Start Angular dev server
- `npm run backend` - Start JSON Server
- `npm run dev` - Run both servers concurrently
- `npm run build` - Build for production
- `npm test` - Run unit tests

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.3.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
