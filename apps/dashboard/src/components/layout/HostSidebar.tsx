import React, { useState, useEffect, useCallback } from 'react';
import {
  CalendarCheck,
  Home,
  Calendar,
  Tag,
  BarChart3,
  X,
  LogOut,
  Shield,
  LogIn,
} from 'lucide-react';
import type { User, UserRole } from '../../types/auth.types.ts';
import type { DashboardTab } from './DashboardNav.tsx';

export interface HostSidebarProps {
  currentTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  user: User;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onLogout?: () => void;
  onSwitchRole?: (role: UserRole) => void;
  isAuthenticated?: boolean;
  onLogin?: () => void;
}

interface NavItem {
  id: DashboardTab;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const HOST_NAV_ITEMS: NavItem[] = [
  {
    id: 'bookings',
    label: 'Reservas',
    description: 'Solicitudes y confirmadas',
    icon: CalendarCheck,
  },
  {
    id: 'accommodations',
    label: 'Mis Cabañas',
    description: 'Establecimientos y fotos',
    icon: Home,
  },
  {
    id: 'calendar',
    label: 'Calendario',
    description: 'Ocupación y bloqueos',
    icon: Calendar,
  },
  {
    id: 'pricing',
    label: 'Tarifas y Temporadas',
    description: 'Precios y estadía mínima',
    icon: Tag,
  },
  {
    id: 'performance',
    label: 'Rendimiento',
    description: 'Balance y métricas clave',
    icon: BarChart3,
  },
];

export const HostSidebar: React.FC<HostSidebarProps> = ({
  currentTab,
  onTabChange,
  user,
  isOpenMobile,
  onCloseMobile,
  onLogout,
  onSwitchRole,
  isAuthenticated = true,
  onLogin,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Lock scroll on mobile drawer
  useEffect(() => {
    if (isOpenMobile) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpenMobile]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpenMobile) {
        onCloseMobile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpenMobile, onCloseMobile]);

  const handleSelectTab = useCallback(
    (tabId: DashboardTab) => {
      onTabChange(tabId);
      if (isOpenMobile) {
        onCloseMobile();
      }
    },
    [onTabChange, isOpenMobile, onCloseMobile]
  );

  const initials = `${user.name?.charAt(0) ?? 'U'}${user.lastName?.charAt(0) ?? ''}`.toUpperCase();

  const renderContent = (expanded: boolean) => (
    <div className="flex flex-col h-full justify-between p-3.5 bg-white border-r border-[var(--color-sand-200)] select-none">
      {/* 1. Header & Brand */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-sand-200)]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-terracotta-500)] flex items-center justify-center text-white font-extrabold text-sm font-['Outfit'] shadow-xs shrink-0">
              CM
            </div>
            {expanded && (
              <div className="min-w-0 animate-in fade-in duration-200">
                <span className="text-xs font-black tracking-wider uppercase text-[var(--color-sand-900)] font-['Outfit'] block truncate">
                  Turismo Capilla
                </span>
                <span className="text-[10px] text-[var(--color-terracotta-600)] font-bold uppercase tracking-wider block truncate">
                  Panel Prestador
                </span>
              </div>
            )}
          </div>
          {isOpenMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-[var(--color-sand-400)] hover:text-[var(--color-sand-800)] hover:bg-[var(--color-sand-100)] transition-colors cursor-pointer md:hidden"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 2. Role Switcher (Cabañero / Comisión) inside collapsible sidebar */}
        {expanded && onSwitchRole && (
          <div className="bg-[var(--color-sand-100)] p-1 rounded-xl border border-[var(--color-sand-200)] animate-in fade-in duration-200">
            <div className="grid grid-cols-2 gap-1 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => onSwitchRole('HOST')}
                className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  user.role === 'HOST'
                    ? 'bg-white text-[var(--color-sand-900)] shadow-xs'
                    : 'text-[var(--color-sand-500)] hover:text-[var(--color-sand-800)]'
                }`}
              >
                <Home className="w-3.5 h-3.5 text-[var(--color-terracotta-500)]" />
                <span className="truncate">Cabañero</span>
              </button>
              <button
                type="button"
                onClick={() => onSwitchRole('ADMIN')}
                className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  user.role === 'ADMIN'
                    ? 'bg-white text-[var(--color-sand-900)] shadow-xs'
                    : 'text-[var(--color-sand-500)] hover:text-[var(--color-sand-800)]'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-[var(--color-emerald-portal-600)]" />
                <span className="truncate">Comisión</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. Navigation Items (Reservas, Mis Cabañas, etc.) */}
        <nav className="space-y-1" aria-label="Menú principal del prestador">
          {HOST_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                title={!expanded ? item.label : undefined}
                className={`w-full flex items-center gap-3 rounded-xl transition-all cursor-pointer ${
                  expanded ? 'px-3 py-2.5 text-left' : 'p-2.5 justify-center'
                } ${
                  isActive
                    ? 'bg-[var(--color-terracotta-500)] text-white shadow-xs'
                    : 'text-[var(--color-sand-700)] hover:bg-[var(--color-sand-100)] hover:text-[var(--color-sand-900)]'
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? 'text-white' : 'text-[var(--color-terracotta-500)]'
                  }`}
                />
                {expanded && (
                  <div className="flex-1 min-w-0 animate-in fade-in duration-200">
                    <span className="text-xs font-bold block truncate leading-tight">
                      {item.label}
                    </span>
                    <span
                      className={`text-[10px] block truncate leading-tight mt-0.5 ${
                        isActive ? 'text-white/80' : 'text-[var(--color-sand-400)]'
                      }`}
                    >
                      {item.description}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 4. Host Profile Card & Dynamic Logout / Login */}
      <div className="pt-3 border-t border-[var(--color-sand-200)] mt-auto space-y-2">
        {expanded ? (
          <div className="bg-[var(--color-sand-50)] p-2.5 rounded-xl border border-[var(--color-sand-200)] animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-uritorco-500)] text-white font-bold flex items-center justify-center text-xs shrink-0">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[var(--color-sand-900)] truncate">
                  {user.name} {user.lastName}
                </p>
                <p className="text-[10px] text-[var(--color-sand-400)] truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div
              title={`${user.name} ${user.lastName}`}
              className="w-9 h-9 rounded-lg bg-[var(--color-uritorco-500)] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs cursor-default"
            >
              {initials}
            </div>
          </div>
        )}

        {/* Dynamic Action: Salir o Iniciar Sesión */}
        {isAuthenticated ? (
          onLogout && (
            <button
              onClick={onLogout}
              title={!expanded ? 'Cerrar sesión' : undefined}
              className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer ${
                expanded ? 'px-3' : 'px-1'
              }`}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {expanded && <span>Cerrar Sesión</span>}
            </button>
          )
        ) : (
          onLogin && (
            <button
              onClick={onLogin}
              title={!expanded ? 'Iniciar sesión' : undefined}
              className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-[var(--color-terracotta-600)] hover:bg-[var(--color-sand-100)] transition-colors cursor-pointer ${
                expanded ? 'px-3' : 'px-1'
              }`}
            >
              <LogIn className="w-4 h-4 shrink-0" />
              {expanded && <span>Iniciar Sesión</span>}
            </button>
          )
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Collapsible Hover Sidebar */}
      <div
        className="hidden md:block relative z-40"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <aside
          className={`fixed top-0 bottom-0 left-0 h-screen transition-all duration-300 ease-in-out bg-white ${
            isHovered ? 'w-72 shadow-2xl' : 'w-[72px] shadow-sm'
          }`}
        >
          {renderContent(isHovered)}
        </aside>
      </div>

      {/* Mobile Drawer (Overlay + Slide-in) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex" role="dialog" aria-modal="true">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 ease-out"
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200 ease-out">
            {renderContent(true)}
          </div>
        </div>
      )}
    </>
  );
};
