import React, { useState, useEffect, useCallback } from 'react';
import {
  CalendarCheck,
  Home,
  Calendar,
  Tag,
  BarChart3,
  X,
  LogOut,
  LogIn,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { PORTAL_URL } from '../../config/navigation.ts';
import type { User } from '../../types/auth.types.ts';
import type { DashboardTab } from './DashboardNav.tsx';
import { useAnimatedPresence } from '../../hooks/useAnimatedPresence.ts';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock.ts';

export interface HostSidebarProps {
  currentTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  user: User;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onLogout?: () => void;
  isAuthenticated?: boolean;
  onLogin?: () => void;
  isDualRole?: boolean;
  onSwitchWorkspace?: (ws: 'ADMIN' | 'HOST') => void;
  onOpenWorkspaceSelector?: () => void;
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
  isAuthenticated = true,
  onLogin,
  isDualRole,
  onSwitchWorkspace,
  onOpenWorkspaceSelector,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { shouldRender: shouldRenderMobile, isVisible: isMobileVisible } = useAnimatedPresence(isOpenMobile, 220);
  useBodyScrollLock(shouldRenderMobile);

  // Lock scroll on mobile drawer
  useEffect(() => {
    if (isOpenMobile) {


      return () => {

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
    <div className="flex flex-col h-full p-3.5 bg-white border-r border-[var(--color-sand-200)] select-none">
      {/* 1. Header & Brand (shrink-0) */}
      <div className="shrink-0 flex items-center justify-between pb-3 border-b border-[var(--color-sand-200)]">
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
        {shouldRenderMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-[var(--color-sand-400)] hover:text-[var(--color-sand-800)] hover:bg-[var(--color-sand-100)] transition-colors cursor-pointer md:hidden"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 2. Middle Scrollable Area (flex-1 overflow-y-auto min-h-0) */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 py-3 space-y-3 scrollbar-thin">
        {/* 2.1 Dual Role Switcher (Admin acting as Host) */}
        {isDualRole && expanded && (
          <div className="p-2.5 rounded-xl bg-[var(--color-sand-100)] border border-[var(--color-sand-200)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[var(--color-sand-600)] uppercase tracking-wider">
                Espacio Activo
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[var(--color-terracotta-500)] text-white">
                Modo Cabañero
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                onSwitchWorkspace?.('ADMIN');
                if (isOpenMobile) onCloseMobile();
              }}
              className="w-full flex items-center justify-center gap-2 py-1.5 px-2.5 rounded-lg text-xs font-bold bg-[var(--color-emerald-portal-600)] hover:bg-[var(--color-emerald-portal-700)] text-white transition-colors cursor-pointer shadow-2xs"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Volver a Administración</span>
            </button>
          </div>
        )}

        {isDualRole && !expanded && (
          <div className="flex justify-center pb-2 border-b border-[var(--color-sand-200)]">
            <button
              type="button"
              onClick={() => onSwitchWorkspace?.('ADMIN')}
              title="Volver a Administración del Portal"
              className="w-10 h-10 rounded-xl bg-[var(--color-sand-100)] hover:bg-[var(--color-emerald-portal-50)] text-[var(--color-emerald-portal-600)] border border-[var(--color-sand-200)] flex items-center justify-center transition-colors cursor-pointer"
            >
              <Shield className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* 2.2 Navigation Items (Reservas, Mis Cabañas, etc.) */}
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
                    ? 'bg-[var(--color-terracotta-500)] text-white shadow-xs font-bold'
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

      {/* 3. Host Profile Card, External Link & Dynamic Logout / Login (shrink-0) */}
      <div className="shrink-0 pt-3 border-t border-[var(--color-sand-200)] space-y-2">
        {/* Link al Portal Público */}
        <a
          href={PORTAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          title={!expanded ? 'Ver Portal Turístico Público' : undefined}
          className={`w-full flex items-center gap-2.5 py-2 rounded-xl text-xs font-semibold text-[var(--color-sand-700)] hover:text-[var(--color-sand-900)] hover:bg-[var(--color-sand-100)] transition-colors cursor-pointer group ${
            expanded ? 'px-3' : 'justify-center px-1'
          }`}
        >
          <ExternalLink className="w-4 h-4 shrink-0 text-[var(--color-sand-500)] group-hover:text-[var(--color-sand-800)]" />
          {expanded && (
            <div className="flex items-center justify-between flex-1 min-w-0">
              <span className="truncate">Ver Portal Público</span>
              <span className="text-[10px] text-[var(--color-sand-400)] font-normal uppercase tracking-wider ml-1">Sitio</span>
            </div>
          )}
        </a>

        {/* User Card with click to Profile */}
        <button
          type="button"
          onClick={() => handleSelectTab('profile')}
          title={!expanded ? 'Ver Mi Perfil y Seguridad' : undefined}
          className={`w-full text-left transition-colors cursor-pointer rounded-xl ${
            currentTab === 'profile'
              ? 'bg-[var(--color-sand-200)] ring-1 ring-[var(--color-terracotta-500)]'
              : 'hover:bg-[var(--color-sand-100)]'
          } ${expanded ? 'p-2' : 'p-1'}`}
        >
          {expanded ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-terracotta-500)] text-white font-bold flex items-center justify-center text-xs shrink-0">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[var(--color-sand-900)] truncate">
                  {user.name} {user.lastName}
                </p>
                <p className="text-[10px] text-[var(--color-terracotta-600)] font-semibold truncate">
                  Mi Perfil & Seguridad
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div
                title={`${user.name} ${user.lastName} — Mi Perfil`}
                className="w-9 h-9 rounded-lg bg-[var(--color-terracotta-500)] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs"
              >
                {initials}
              </div>
            </div>
          )}
        </button>

        {isDualRole && expanded && onOpenWorkspaceSelector && (
          <button
            type="button"
            onClick={() => {
              onOpenWorkspaceSelector();
              if (isOpenMobile) onCloseMobile();
            }}
            className="w-full text-center text-[11px] text-[var(--color-sand-500)] hover:text-[var(--color-terracotta-600)] py-1 font-semibold transition-colors cursor-pointer"
          >
            Cambiar espacio de trabajo
          </button>
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
          aria-expanded={isHovered}
          className={`fixed top-0 bottom-0 left-0 h-screen transition-all duration-300 ease-in-out bg-white ${
            isHovered ? 'w-72 shadow-2xl' : 'w-[72px] shadow-sm'
          }`}
        >
          {renderContent(isHovered)}
        </aside>
      </div>

      {/* Mobile Drawer (Overlay + Slide-in) */}
      {shouldRenderMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex" role="dialog" aria-modal="true">
          <div
            onClick={onCloseMobile}
            className={`fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-220 ease-out ${isMobileVisible ? 'opacity-100' : 'opacity-0'}`}
            aria-hidden="true"
          />
          <div className={`relative w-72 max-w-[85vw] h-full shadow-2xl z-10 transition-transform duration-220 ease-out ${isMobileVisible ? 'translate-x-0' : '-translate-x-full'}`}>
            {renderContent(true)}
          </div>
        </div>
      )}
    </>
  );
};
