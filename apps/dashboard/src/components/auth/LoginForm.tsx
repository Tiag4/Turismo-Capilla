import React, { useState } from 'react';
import { Lock, Shield, Home } from 'lucide-react';
import { Button } from '../ui/Button.tsx';
import { Input } from '../ui/Input.tsx';
import type { LoginCredentials } from '../../types/auth.types.ts';

export interface LoginFormProps {
  onLogin: (credentials: LoginCredentials) => Promise<unknown>;
  isLoading: boolean;
  error: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  isLoading,
  error,
}) => {
  const [email, setEmail] = useState('admin@capilladelmonte.gov.ar');
  const [password, setPassword] = useState('AdminCapilla2026!');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    onLogin({ email, password });
  };

  const handleQuickFill = (role: 'ADMIN' | 'HOST') => {
    if (role === 'ADMIN') {
      setEmail('admin@capilladelmonte.gov.ar');
      setPassword('AdminCapilla2026!');
    } else {
      setEmail('host@capilladelmonte.gov.ar');
      setPassword('HostCapilla2026!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAF8F5]">
      <div className="w-full max-w-md bg-white border border-[var(--color-sand-200)] rounded-3xl p-8 shadow-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-emerald-portal-600)] flex items-center justify-center text-white mx-auto shadow-xs mb-4">
            <span className="font-extrabold text-xl font-['Outfit']">CM</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-sand-900)] font-['Outfit']">
            Panel de Gestión Oficial
          </h1>
          <p className="mt-1 text-xs text-[var(--color-sand-400)] font-medium">
            Turismo Capilla del Monte — Acceso Prestadores y Comisión
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Correo Electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="prestador@capilladelmonte.gov.ar"
            required
          />

          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="terracotta"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2"
          >
            <Lock className="w-4 h-4" />
            <span>Ingresar al Sistema</span>
          </Button>
        </form>

        {/* Quick Demo Access Helpers */}
        <div className="mt-8 pt-6 border-t border-[var(--color-sand-200)]">
          <span className="block text-center text-[11px] uppercase font-bold tracking-wider text-[var(--color-sand-400)] mb-3">
            Acceso Rápido de Demostración
          </span>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickFill('ADMIN')}
              className="w-full text-xs"
            >
              <Shield className="w-3.5 h-3.5 text-[var(--color-emerald-portal-600)]" />
              <span>Comisión (Admin)</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickFill('HOST')}
              className="w-full text-xs"
            >
              <Home className="w-3.5 h-3.5 text-[var(--color-terracotta-500)]" />
              <span>Cabañero (Host)</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
