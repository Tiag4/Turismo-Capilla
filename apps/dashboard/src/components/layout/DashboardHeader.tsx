import React, { useState } from 'react';
import { Menu, LogIn, ChevronDown } from 'lucide-react';
import type { User, UserRole } from '../../types/auth.types.ts';
import type { DashboardTab } from './DashboardNav.tsx';
import { UserMenuDropdown } from './UserMenuDropdown.tsx';
import { Button } from '../ui/Button.tsx';

export interface DashboardHeaderProps {
  user?: User | null;
  isAuthenticated?: boolean;
  onLogin?: () => void;
  onLogout: () => void;
  onSwitchRole: (role: UserRole) => void;
  onOpenMobileMenu?: () => void;
  onToggleMobileMenu?: () => void;
  hideBrandOnDesktop?: boolean;
  currentTab?: DashboardTab;
  onTabChange?: (tab: DashboardTab) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  isAuthenticated = true,
  onLogin,
  onLogout,
  onSwitchRole,
  onOpenMobileMenu,
  onToggleMobileMenu,
  hideBrandOnDesktop = false,
  currentTab,
  onTabChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleToggle = onOpenMobileMenu || onToggleMobileMenu;
  const isAuth = Boolean(user && isAuthenticated);

  const initials = isAuth && user
    ? `${user.name?.[0] ?? 'U'}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : 'TC';

  return (
    <header className="bg-white border-b border-[var(--color-sand-200)] sticky top-0 z-30 shadow-xs">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Side: Brand & Section Identity */}
        <div className="flex items-center gap-3">
          {handleToggle && (
            <button
              onClick={handleToggle}
              className="p-2 -ml-2 rounded-xl text-[var(--color-sand-800)] hover:bg-[var(--color-sand-100)] md:hidden transition-colors cursor-pointer"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="w-5 h-5 text-[var(--color-terracotta-600)]" />
            </button>
          )}

          {/* Brand container */}
          <div className={`items-center gap-3 ${hideBrandOnDesktop ? 'flex md:hidden' : 'flex'}`}>
            <div className="w-9 h-9 rounded-xl bg-[var(--color-emerald-portal-600)] flex items-center justify-center text-white shadow-xs shrink-0">
              <span className="font-extrabold text-base font-['Outfit']">CM</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold tracking-tight text-[var(--color-sand-900)] font-['Outfit'] uppercase">
                  Turismo Capilla
                </span>
                {isAuth && user && (
                  <span className="hidden sm:inline text-xs font-semibold text-[var(--color-sand-500)]">
                    · {user.role === 'ADMIN' ? 'Comisión Municipal' : 'Panel Prestadores'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[var(--color-sand-400)] font-medium leading-none mt-0.5">
                Pueblo Uritorco — Sistema de Gestión Oficial
              </p>
            </div>
          </div>

          {/* Desktop institutional badge when sidebar is active */}
          {hideBrandOnDesktop && (
            <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-[var(--color-sand-800)]">
              <span className="w-2 h-2 rounded-full bg-[var(--color-emerald-portal-600)] shrink-0" />
              <span>Secretaría y Comisión de Turismo de Capilla del Monte</span>
            </div>
          )}
        </div>

        {/* Right Side: User Profile Dropdown or Login CTA */}
        <div className="relative flex items-center gap-3">
          {isAuth && user ? (
            <>
              {/* Profile Dropdown Trigger */}
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border transition-all cursor-pointer ${
                  isDropdownOpen
                    ? 'bg-[var(--color-sand-100)] border-[var(--color-sand-300)] shadow-xs'
                    : 'bg-white border-[var(--color-sand-200)] hover:bg-[var(--color-sand-50)] hover:border-[var(--color-sand-300)]'
                }`}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                aria-label="Abrir panel de usuario y módulos"
              >
                {/* Initials Avatar */}
                <div className="w-8 h-8 rounded-lg bg-[var(--color-terracotta-500)] text-white font-extrabold flex items-center justify-center text-xs font-['Outfit'] shadow-xs shrink-0">
                  {initials}
                </div>

                {/* Identity summary */}
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-[var(--color-sand-900)] leading-tight truncate max-w-[130px]">
                    {user.name} {user.lastName}
                  </span>
                  <span className="text-[10px] text-[var(--color-sand-500)] font-medium leading-tight">
                    {user.role === 'ADMIN' ? 'Comisión Oficial' : 'Cabañero'}
                  </span>
                </div>

                <ChevronDown
                  className={`w-4 h-4 text-[var(--color-sand-400)] transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180 text-[var(--color-sand-800)]' : ''
                  }`}
                />
              </button>

              {/* Dropdown Panel */}
              <UserMenuDropdown
                user={user}
                currentTab={currentTab}
                onTabChange={onTabChange}
                onSwitchRole={onSwitchRole}
                onLogout={onLogout}
                isOpen={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
              />
            </>
          ) : (
            <Button
              variant="terracotta"
              size="sm"
              onClick={onLogin}
              className="flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Iniciar Sesión</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
