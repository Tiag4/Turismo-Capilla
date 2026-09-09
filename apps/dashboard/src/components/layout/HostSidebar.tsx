import React, { useEffect, useCallback } from 'react';
import {
  CalendarCheck,
  Home,
  Calendar,
  Tag,
  BarChart3,
  X,
  ShieldCheck,
} from 'lucide-react';
import type { User } from '../../types/auth.types.ts';
import type { DashboardTab } from './DashboardNav.tsx';

export interface HostSidebarProps {
  currentTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  user: User;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
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
}) => {
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

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4 bg-white border-r border-[var(--color-sand-200)]">
      {/* Header & Brand */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--color-sand-200)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-terracotta-500)] flex items-center justify-center text-white font-extrabold text-base font-['Outfit'] shadow-xs">
              CM
            </div>
            <div>
              <span className="text-xs font-black tracking-wider uppercase text-[var(--color-sand-900)] font-['Outfit'] block">
                Turismo Capilla
              </span>
              <span className="text-[10px] text-[var(--color-terracotta-600)] font-bold uppercase tracking-wider block">
                Panel del Prestador
              </span>
            </div>
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

        {/* Navigation Items */}
        <nav className="space-y-1.5" aria-label="Menú principal del prestador">
          {HOST_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[var(--color-terracotta-500)] text-white shadow-xs'
                    : 'text-[var(--color-sand-800)] hover:bg-[var(--color-sand-100)] hover:text-[var(--color-sand-900)]'
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? 'text-white' : 'text-[var(--color-terracotta-500)]'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold block truncate">
                    {item.label}
                  </span>
                  <span
                    className={`text-[10px] block truncate ${
                      isActive ? 'text-white/80' : 'text-[var(--color-sand-400)]'
                    }`}
                  >
                    {item.description}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Host Profile Info Card */}
      <div className="pt-4 border-t border-[var(--color-sand-200)] mt-auto">
        <div className="bg-[var(--color-sand-50)] p-3 rounded-xl border border-[var(--color-sand-200)] space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-uritorco-500)] text-white font-bold flex items-center justify-center text-xs shrink-0">
              {user.name.charAt(0)}
              {user.lastName.charAt(0)}
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
          <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-emerald-portal-600)] font-bold bg-white px-2 py-1 rounded-md border border-[var(--color-sand-200)]">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Prestador Oficial Habilitado</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent w-64) */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 min-h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Overlay + Slide-in) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 ease-out"
            aria-hidden="true"
          />
          {/* Drawer content */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200 ease-out">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
