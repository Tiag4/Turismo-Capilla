import React, { useState } from 'react';
import { AlertCircle, ArrowLeft, Eye, EyeOff, LogIn } from 'lucide-react';
import { Button } from '../ui/Button.tsx';
import { PasswordRecoveryModal } from './password-recovery/PasswordRecoveryModal.tsx';
import { PORTAL_URL } from '../../config/navigation.ts';
import type { LoginCredentials } from '../../types/auth.types.ts';
import balnearioPhoto from '../../assets/balneario-el-paraiso.jpg';
import officialLogo from '../../assets/logo-capilla-del-monte.png';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    onLogin({ email, password });
  };

  return (
    <div className="min-h-[100dvh] grid grid-cols-1 lg:grid-cols-2 bg-[var(--color-sand-50)]">
      {/* Left Column: Clean Institutional Form Workspace */}
      <main className="flex flex-col px-6 sm:px-12 py-8 sm:py-10">
        <div className="w-full max-w-[440px] mx-auto flex-1 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-4">
            <img
              src={officialLogo}
              alt="Turismo Capilla del Monte"
              className="h-11 w-auto object-contain"
            />

            <a
              href={PORTAL_URL}
              className="inline-flex items-center gap-1.5 min-h-[44px] px-2 -mr-2 text-xs font-semibold text-[var(--color-terracotta-700)] hover:text-[var(--color-terracotta-800)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-terracotta-700)] rounded-lg"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Volver al portal</span>
            </a>
          </div>

          <section
            aria-labelledby="login-heading"
            className="w-full my-auto py-10"
          >
            <div className="space-y-2.5">
              <h1
                id="login-heading"
                className="font-display font-extrabold text-3xl sm:text-[2.125rem] text-[var(--color-sand-900)] tracking-tight leading-tight"
              >
                Acceso al Panel de Gestión
              </h1>
              <p className="text-sm text-[var(--color-sand-700)] leading-relaxed">
                Ingresá con tu cuenta institucional. El sistema detecta automáticamente si sos prestador o parte de la Comisión de Turismo.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="login-email"
                  className="text-xs font-semibold text-[var(--color-sand-800)]"
                >
                  Correo electrónico
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@capilladelmonte.gov.ar"
                  autoComplete="username"
                  spellCheck={false}
                  autoCapitalize="none"
                  autoCorrect="off"
                  enterKeyHint="next"
                  aria-invalid={Boolean(error)}
                  required
                  className="w-full min-h-[48px] rounded-xl border border-[var(--color-sand-300)] bg-white px-3.5 py-2.5 text-base sm:text-sm text-[var(--color-sand-900)] placeholder:text-[var(--color-sand-500)] transition-colors focus:outline-none focus:border-[var(--color-terracotta-600)] focus:ring-2 focus:ring-[var(--color-terracotta-600)]/20"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="login-password"
                    className="text-xs font-semibold text-[var(--color-sand-800)]"
                  >
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsRecoveryOpen(true)}
                    className="min-h-[32px] px-1 text-xs font-semibold text-[var(--color-terracotta-700)] hover:text-[var(--color-terracotta-800)] underline underline-offset-4 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-terracotta-700)] rounded-xs"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingresá tu contraseña"
                    autoComplete="current-password"
                    enterKeyHint="done"
                    aria-invalid={Boolean(error)}
                    required
                    className="w-full min-h-[48px] rounded-xl border border-[var(--color-sand-300)] bg-white pl-3.5 pr-12 py-2.5 text-base sm:text-sm text-[var(--color-sand-900)] placeholder:text-[var(--color-sand-500)] transition-colors focus:outline-none focus:border-[var(--color-terracotta-600)] focus:ring-2 focus:ring-[var(--color-terracotta-600)]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-pressed={showPassword}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    className="absolute right-1 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg text-[var(--color-sand-600)] hover:text-[var(--color-sand-900)] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-terracotta-700)]"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <Eye className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="rounded-xl border border-rose-700/30 bg-white px-3.5 py-2.5 flex items-start gap-2.5 text-xs font-semibold text-rose-800"
                >
                  <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="terracotta"
                size="lg"
                isLoading={isLoading}
                className="w-full min-h-[48px] font-semibold"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                <span>Ingresar al Panel</span>
              </Button>
            </form>
          </section>

          <footer className="pt-6 border-t border-[var(--color-sand-200)]">
            <p className="text-xs text-[var(--color-sand-600)] leading-relaxed">
              Comisión de Turismo de Capilla del Monte · Acceso exclusivo para prestadores adheridos y administración municipal.
            </p>
          </footer>
        </div>
      </main>

      {/* Right Column: Full-Bleed Portrait Photography */}
      <aside
        aria-label="Paisaje turístico de Capilla del Monte"
        className="hidden lg:block relative min-h-[100dvh] overflow-hidden bg-[var(--color-sand-900)]"
      >
        <img
          src={balnearioPhoto}
          alt="Cañadón y arroyo entre paredones rojizos al atardecer en el Balneario El Paraíso, Capilla del Monte"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent"
        />
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <p className="font-display font-bold text-xl tracking-tight">
            Balneario El Paraíso
          </p>
          <p className="text-xs text-white/90 mt-0.5">
            Capilla del Monte · Valle de Punilla, Córdoba
          </p>
        </div>
      </aside>

      <PasswordRecoveryModal
        isOpen={isRecoveryOpen}
        onClose={() => setIsRecoveryOpen(false)}
      />
    </div>
  );
};
