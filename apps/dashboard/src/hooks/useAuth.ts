import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service.ts';
import type { LoginCredentials, User, UserRole } from '../types/auth.types.ts';

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser());
  const [token, setToken] = useState<string | null>(() => authService.getToken());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check initial user
    const current = authService.getCurrentUser();
    if (current && !user) {
      setUser(current);
      setToken(authService.getToken());
    }
  }, [user]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setToken(response.accessToken);
      return response.user;
    } catch (err: any) {
      const msg = err.message || 'Error al iniciar sesión';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setToken(null);
  }, []);

  const switchRole = useCallback((newRole: UserRole) => {
    if (!user) return;
    const updatedUser: User = {
      ...user,
      role: newRole,
      name: newRole === 'ADMIN' ? 'Comisión' : 'Roberto',
      lastName: newRole === 'ADMIN' ? 'Turismo' : 'Gómez (Cabañas)',
    };
    setUser(updatedUser);
    localStorage.setItem('turismo_capilla_user', JSON.stringify(updatedUser));
  }, [user]);

  return {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isAdmin: user?.role === 'ADMIN',
    isHost: user?.role === 'HOST',
    isLoading,
    error,
    login,
    logout,
    switchRole,
  };
}
