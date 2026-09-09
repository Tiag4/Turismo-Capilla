import React from 'react';
import { LogOut, Shield, Home, Menu } from 'lucide-react';
import type { User, UserRole } from '../../types/auth.types.ts';
import { Button } from '../ui/Button.tsx';

export interface DashboardHeaderProps {
  user: User;
  onLogout: () => void;
  onSwitchRole: (role: UserRole) => void;
  onOpenMobileMenu?: () => void;
  hideBrandOnDesktop?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  onLogout,
  onSwitchRole,
  onOpenMobileMenu,
  hideBrandOnDesktop = false,
}) => {
  return (
    <header className="bg-white border-b border-[var(--color-sand-200)] sticky top-0 z-30 shadow-xs">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Side: Brand (or Mobile Hamburger if sidebar is present on desktop) */}
        <div className="flex items-center gap-3">
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="p-2 -ml-2 rounded-lg text-[var(--color-sand-800)] hover:bg-[var(--color-sand-100)] md:hidden cursor-pointer"
              aria-label="Abrir menú lateral"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* If hideBrandOnDesktop, only show brand on mobile because sidebar already has it on desktop */}
          <div className={`items-center gap-3 ${hideBrandOnDesktop ? 'flex md:hidden' : 'flex'}`}>
            <div className="w-9 h-9 rounded-xl bg-[var(--color-emerald-portal-600)] flex items-center justify-center text-white shadow-xs">
              <span className="font-bold text-base font-['Outfit']">CM</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold tracking-tight text-[var(--color-sand-900)] font-['Outfit'] uppercase">
                  Turismo Capilla
                </span>
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md text-white ${
                    user.role === 'ADMIN'
                      ? 'bg-[var(--color-emerald-portal-600)]'
                      : 'bg-[var(--color-terracotta-500)]'
                  }`}
                >
                  {user.role === 'ADMIN' ? 'Comisión' : 'Prestador'}
                </span>
              </div>
              <p className="text-[11px] text-[var(--color-sand-400)] font-medium">
                Pueblo Uritorco — Sistema Oficial
              </p>
            </div>
          </div>

          {/* On Desktop when sidebar is active, show clean institutional location tag */}
          {hideBrandOnDesktop && (
            <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-[var(--color-sand-800)]">
              <span className="w-2 h-2 rounded-full bg-[var(--color-emerald-portal-600)]" />
              <span>Secretaría y Comisión de Turismo de Capilla del Monte</span>
            </div>
          )}
        </div>

        {/* Right Side: User Controls & Fast Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Fast Role Switcher */}
          <div className="hidden sm:flex items-center bg-[var(--color-sand-100)] p-1 rounded-xl border border-[var(--color-sand-200)] text-xs font-semibold">
            <button
              onClick={() => onSwitchRole('HOST')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                user.role === 'HOST'
                  ? 'bg-white text-[var(--color-sand-900)] shadow-xs'
                  : 'text-[var(--color-sand-400)] hover:text-[var(--color-sand-800)]'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Cabañero</span>
            </button>
            <button
              onClick={() => onSwitchRole('ADMIN')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                user.role === 'ADMIN'
                  ? 'bg-white text-[var(--color-sand-900)] shadow-xs'
                  : 'text-[var(--color-sand-400)] hover:text-[var(--color-sand-800)]'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Comisión</span>
            </button>
          </div>

          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-bold text-[var(--color-sand-900)]">
              {user.name} {user.lastName}
            </span>
            <span className="text-[10px] text-[var(--color-sand-400)]">
              {user.email}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            title="Cerrar sesión"
            className="text-[var(--color-sand-800)]"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Salir</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
