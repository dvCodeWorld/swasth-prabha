export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Patient' | 'Hospital Admin' | 'Super Admin';
  hospitalId?: string;
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
