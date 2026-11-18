import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service.ts';
import type {
  LoginCredentials,
  User,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from '../types/auth.types.ts';

export type ActiveWorkspace = 'ADMIN' | 'HOST';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isHost: boolean;
  isDualRole: boolean;
  activeWorkspace: ActiveWorkspace | null;
  setActiveWorkspace: (workspace: ActiveWorkspace | null) => void;
  switchWorkspace: (workspace: ActiveWorkspace) => void;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => void;
  updateProfile: (payload: UpdateProfilePayload) => Promise<User>;
  changePassword: (payload: ChangePasswordPayload) => Promise<{ message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser());
  const [token, setToken] = useState<string | null>(() => authService.getToken());
  const [activeWorkspace, setActiveWorkspace] = useState<ActiveWorkspace | null>(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) return null;
    if (currentUser.role === 'HOST') return 'HOST';
    if (typeof window !== 'undefined') {
      const stored = (sessionStorage.getItem('turismo_active_workspace') ||
        localStorage.getItem('turismo_active_workspace')) as ActiveWorkspace | null;
      if (stored === 'ADMIN' || stored === 'HOST') return stored;
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const switchWorkspace = useCallback((workspace: ActiveWorkspace) => {
    setActiveWorkspace(workspace);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('turismo_active_workspace', workspace);
      localStorage.setItem('turismo_active_workspace', workspace);
    }
  }, []);

  // Si el backend responde 401 en cualquier request, la sesión local deja de ser válida.
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
      setActiveWorkspace(null);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('turismo_active_workspace');
        localStorage.removeItem('turismo_active_workspace');
      }
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setToken(response.accessToken);
      if (response.user.role === 'ADMIN') {
        setActiveWorkspace(null);
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('turismo_active_workspace');
          localStorage.removeItem('turismo_active_workspace');
        }
      } else {
        setActiveWorkspace('HOST');
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('turismo_active_workspace', 'HOST');
          localStorage.setItem('turismo_active_workspace', 'HOST');
        }
      }
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
    setActiveWorkspace(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('turismo_active_workspace');
      localStorage.removeItem('turismo_active_workspace');
    }
  }, []);

  const updateProfile = useCallback(async (payload: UpdateProfilePayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await authService.updateProfile(payload);
      setUser(updated);
      return updated;
    } catch (err: any) {
      const msg = err.message || 'Error al actualizar el perfil';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (payload: ChangePasswordPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.changePassword(payload);
      return res;
    } catch (err: any) {
      const msg = err.message || 'Error al cambiar la contraseña';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isAdmin: user?.role === 'ADMIN',
    isHost: user?.role === 'HOST',
    isDualRole: user?.role === 'ADMIN',
    activeWorkspace,
    setActiveWorkspace,
    switchWorkspace,
    isLoading,
    error,
    login,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}
