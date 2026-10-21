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
  token: string;
  accessToken: string;
  type?: string;
  user: User;
}

export interface UpdateProfilePayload {
  name: string;
  lastName: string;
  phone?: string | null;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
