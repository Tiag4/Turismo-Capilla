import React, { useEffect } from 'react';
import {
  BarChart3,
  Home,
  KeyRound,
  FileSpreadsheet,
  ShieldCheck,
  Image,
  Settings,
  X,
  LogOut,
  Repeat,
} from 'lucide-react';
import type { User, UserRole } from '../../types/auth.types.ts';
import type { DashboardTab } from './DashboardNav.tsx';

export interface AdminSidebarProps {
  currentTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  user: User;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
  onSwitchRole: (role: UserRole) => void;
}

interface NavItem {
  id: DashboardTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ADMIN_NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Centro de Control', icon: BarChart3 },
  { id: 'accommodations', label: 'Prestadores Adheridos', icon: Home },
  { id: 'invitations', label: 'Tokens de Invitación', icon: KeyRound },
  { id: 'reports', label: 'Reportes Turísticos', icon: FileSpreadsheet },
  { id: 'audit', label: 'Auditoría de Actividad', icon: ShieldCheck },
  { id: 'moderation', label: 'Moderación de Fotos', icon: Image },
  { id: 'settings', label: 'Configuración Oficial', icon: Settings },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onTabChange,
  user,
  isOpenMobile,
  onCloseMobile,
  onLogout,
  onSwitchRole,
}) => {
  // Mandatory body scroll lock when mobile sidebar drawer is open
  useEffect(() => {
    if (isOpenMobile) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpenMobile]);

  const handleSelectTab = (tab: DashboardTab) => {
    onTabChange(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay with transition */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-[#22201E]/60 backdrop-blur-xs md:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container: Fixed on desktop, Drawer on mobile */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-[var(--color-sand-200)] flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Brand */}
        <div>
          <div className="h-16 px-5 border-b border-[var(--color-sand-200)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--color-emerald-portal-600)] flex items-center justify-center text-white shadow-xs">
                <span className="font-extrabold text-sm font-['Outfit']">CM</span>
              </div>
              <div>
                <span className="text-sm font-extrabold tracking-tight text-[var(--color-sand-900)] font-['Outfit'] uppercase block">
                  Turismo Capilla
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-[var(--color-emerald-portal-600)] px-2 py-0.5 rounded-sm inline-block">
                  Comisión Municipal
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-[var(--color-sand-400)] hover:bg-[var(--color-sand-100)] md:hidden cursor-pointer"
              aria-label="Cerrar menú lateral"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-4 flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-sand-400)] px-3 mb-1.5 block">
              Gestión Municipal
            </span>
            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left cursor-pointer ${
                    isActive
                      ? 'bg-[var(--color-emerald-portal-600)] text-white shadow-xs font-bold'
                      : 'text-[var(--color-sand-800)] hover:bg-[var(--color-sand-100)] hover:text-[var(--color-sand-900)]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[var(--color-emerald-portal-600)]'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer with Operator Profile & Role Switcher */}
        <div className="p-4 border-t border-[var(--color-sand-200)] bg-[var(--color-sand-50)] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <span className="text-xs font-bold text-[var(--color-sand-900)] block truncate">
                {user.name} {user.lastName}
              </span>
              <span className="text-[10px] text-[var(--color-sand-400)] block truncate">
                {user.email}
              </span>
            </div>
            <button
              onClick={onLogout}
              title="Cerrar sesión"
              className="p-1.5 rounded-lg text-[var(--color-sand-400)] hover:text-rose-700 hover:bg-white transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Quick role toggle button */}
          <button
            onClick={() => onSwitchRole('HOST')}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-[11px] font-semibold text-[var(--color-sand-800)] bg-white border border-[var(--color-sand-300)] rounded-xl hover:bg-[var(--color-sand-100)] transition-colors cursor-pointer"
          >
            <Repeat className="w-3.5 h-3.5 text-[var(--color-terracotta-500)]" />
            <span>Ver Panel Cabañero</span>
          </button>
        </div>
      </aside>
    </>
  );
};
