export type UserRole = 'ADMIN' | 'HOST' | 'TOURIST';

export interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  role: UserRole;
  phone?: string | null;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
