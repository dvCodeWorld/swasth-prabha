import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { User, LoginCredentials } from '../models/user.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiService = inject(ApiService);
  private router = inject(Router);

  private currentUserSignal = signal<User | null>(null);
  private isAuthenticatedSignal = signal<boolean>(false);

  currentUser = this.currentUserSignal.asReadonly();
  isAuthenticated = this.isAuthenticatedSignal.asReadonly();

  constructor() {
    this.loadUserFromStorage();
  }

  login(credentials: LoginCredentials): void {
    this.apiService.login(credentials).subscribe({
      next: (response) => {
        this.currentUserSignal.set(response.user);
        this.isAuthenticatedSignal.set(true);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        this.navigateByRole(response.user.role);
      },
      error: (error) => {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials.');
      },
    });
  }

  logout(): void {
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.currentUserSignal.set(user);
      this.isAuthenticatedSignal.set(true);
    }
  }

  private navigateByRole(role: string): void {
    switch (role) {
      case 'Patient':
        this.router.navigate(['/patient']);
        break;
      case 'Hospital Admin':
        this.router.navigate(['/hospital-admin']);
        break;
      case 'Super Admin':
        this.router.navigate(['/super-admin']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }

  mockLogin(role: 'Patient' | 'Hospital Admin' | 'Super Admin'): void {
    const mockUser: User = {
      id: '1',
      name:
        role === 'Patient' ? 'John Doe' : role === 'Hospital Admin' ? 'Dr. Admin' : 'Super Admin',
      email: `${role.toLowerCase().replace(' ', '')}@swasthprabha.com`,
      phone: '9876543210',
      role: role,
      hospitalId: role === 'Hospital Admin' ? 'H001' : undefined,
      createdAt: new Date(),
    };

    this.currentUserSignal.set(mockUser);
    this.isAuthenticatedSignal.set(true);
    localStorage.setItem('user', JSON.stringify(mockUser));
    this.navigateByRole(role);
  }
}
