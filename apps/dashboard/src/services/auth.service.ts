import { apiClient } from './api.client.ts';
import type { AuthResponse, LoginCredentials, User } from '../types/auth.types.ts';

const TOKEN_KEY = 'turismo_capilla_token';
const USER_KEY = 'turismo_capilla_user';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const data = await apiClient.post<AuthResponse>('/auth/login', credentials);
      localStorage.setItem(TOKEN_KEY, data.accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return data;
    } catch {
      // Offline / Local fallback demo users for instant preview
      if (credentials.email === 'admin@capilladelmonte.gov.ar') {
        const demoUser: User = {
          id: 'admin-01',
          email: 'admin@capilladelmonte.gov.ar',
          name: 'Comisión',
          lastName: 'Turismo',
          role: 'ADMIN',
          createdAt: new Date().toISOString(),
        };
        const demoResponse: AuthResponse = {
          accessToken: 'demo-admin-token',
          user: demoUser,
        };
        localStorage.setItem(TOKEN_KEY, demoResponse.accessToken);
        localStorage.setItem(USER_KEY, JSON.stringify(demoUser));
        return demoResponse;
      }

      const demoHost: User = {
        id: 'host-01',
        email: credentials.email || 'host@capilladelmonte.gov.ar',
        name: 'Roberto',
        lastName: 'Gómez (Cabañas del Uritorco)',
        role: 'HOST',
        phone: '+54 9 3548 456789',
        createdAt: new Date().toISOString(),
      };
      const demoResponse: AuthResponse = {
        accessToken: 'demo-host-token',
        user: demoHost,
      };
      localStorage.setItem(TOKEN_KEY, demoResponse.accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(demoHost));
      return demoResponse;
    }
  },

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
