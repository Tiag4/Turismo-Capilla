import { apiClient } from './api.client.ts';
import type { AuthResponse, LoginCredentials, User, UpdateProfilePayload, ChangePasswordPayload } from '../types/auth.types.ts';

const TOKEN_KEY = 'turismo_capilla_token';
const USER_KEY = 'turismo_capilla_user';

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join('')
    );
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function isSessionTokenValid(token: string | null): boolean {
  if (!token) return false;

  const payload = decodeJwtPayload(token);
  if (!payload) return false;

  if (typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now()) {
    return false;
  }

  return true;
}

function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Sin fallback local: una credencial inválida o una API caída debe fallar,
    // nunca abrir una sesión ficticia.
    const data = await apiClient.post<AuthResponse>('/auth/login', credentials);
    const jwt = data.token || data.accessToken || '';

    if (!isSessionTokenValid(jwt)) {
      throw new Error('La respuesta del servidor no contiene un token de sesión válido');
    }

    localStorage.setItem(TOKEN_KEY, jwt);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));

    return {
      ...data,
      accessToken: jwt,
      token: jwt,
    };
  },

  getCurrentUser(): User | null {
    if (!isSessionTokenValid(localStorage.getItem(TOKEN_KEY))) {
      clearSession();
      return null;
    }

    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as User;
    } catch {
      clearSession();
      return null;
    }
  },

  getToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!isSessionTokenValid(token)) {
      if (token) clearSession();
      return null;
    }

    return token;
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    // Sin fallback local: si el backend rechaza el cambio, la UI debe enterarse.
    const updatedUser = await apiClient.put<User>('/auth/profile', payload);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  },

  async changePassword(payload: ChangePasswordPayload): Promise<{ message: string }> {
    return await apiClient.post<{ message: string }>('/auth/change-password', payload);
  },

  logout(): void {
    clearSession();
  },
};
