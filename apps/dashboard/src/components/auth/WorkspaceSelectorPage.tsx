import React from 'react';
import { Shield, Home, ChevronRight, LogOut } from 'lucide-react';
import type { User } from '../../types/auth.types.ts';

export interface WorkspaceSelectorPageProps {
  user: User;
  onSelectWorkspace: (workspace: 'ADMIN' | 'HOST') => void;
  onLogout: () => void;
}

export const WorkspaceSelectorPage: React.FC<WorkspaceSelectorPageProps> = ({
  user,
  onSelectWorkspace,
  onLogout,
}) => {
  return (
    <div className="min-h-screen bg-[var(--color-sand-50)] flex flex-col items-center justify-between p-6">
      {/* Top minimal bar */}
      <header className="w-full max-w-md flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-emerald-portal-600)] text-white flex items-center justify-center font-extrabold text-xs font-['Outfit'] shadow-2xs">
            CM
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-sand-800)] font-['Outfit']">
            Turismo Capilla del Monte
          </span>
        </div>

        <button
          type="button"
          onClick={onLogout}
          aria-label="Cerrar sesión"
          className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-sand-600)] hover:text-rose-700 py-1 px-2.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Cerrar sesión</span>
        </button>
      </header>

      {/* Center content — clean, unboxed flow integrated into sand-50 background */}
      <main className="w-full max-w-md my-auto py-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-[var(--color-sand-900)] font-['Outfit'] tracking-tight">
            Elegí tu espacio de trabajo
          </h1>
          <p className="text-xs md:text-sm text-[var(--color-sand-600)]">
            Hola, <span className="font-semibold text-[var(--color-sand-800)]">{user.name}</span>. Seleccioná el panel con el que querés operar:
          </p>
        </div>

        <div className="space-y-2.5" role="group" aria-label="Espacios de trabajo disponibles">
          {/* Opción 1: Administración */}
          <button
            type="button"
            onClick={() => onSelectWorkspace('ADMIN')}
            aria-label="Ingresar a Administración del Portal"
            className="w-full text-left p-3.5 rounded-xl bg-white border border-[var(--color-sand-200)] hover:border-[var(--color-emerald-portal-600)] hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-emerald-portal-600)] focus-visible:ring-offset-2"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-sand-100)] text-[var(--color-emerald-portal-600)] flex items-center justify-center shrink-0 group-hover:bg-[var(--color-emerald-portal-600)] group-hover:text-white transition-colors">
                <Shield className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-[var(--color-sand-900)] font-['Outfit'] truncate">
                  Administración del Portal
                </div>
                <div className="text-xs text-[var(--color-sand-600)] truncate">
                  Cámara de Turismo y Gestión Municipal
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--color-sand-400)] group-hover:text-[var(--color-emerald-portal-600)] group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          {/* Opción 2: Cabañero */}
          <button
            type="button"
            onClick={() => onSelectWorkspace('HOST')}
            aria-label="Ingresar a Gestión de Alojamiento"
            className="w-full text-left p-3.5 rounded-xl bg-white border border-[var(--color-sand-200)] hover:border-[var(--color-terracotta-500)] hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-500)] focus-visible:ring-offset-2"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-sand-100)] text-[var(--color-terracotta-500)] flex items-center justify-center shrink-0 group-hover:bg-[var(--color-terracotta-500)] group-hover:text-white transition-colors">
                <Home className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-[var(--color-sand-900)] font-['Outfit'] truncate">
                  Gestión de Alojamiento
                </div>
                <div className="text-xs text-[var(--color-sand-600)] truncate">
                  Mis cabañas, reservas y disponibilidad
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--color-sand-400)] group-hover:text-[var(--color-terracotta-500)] group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>
        </div>

        <p className="text-[11px] text-[var(--color-sand-500)] pt-1">
          Podés alternar entre ambos paneles en cualquier momento desde la barra lateral.
        </p>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-md text-center text-[11px] text-[var(--color-sand-500)] py-2">
        Plataforma Oficial de Turismo · Capilla del Monte
      </footer>
    </div>
  );
};
