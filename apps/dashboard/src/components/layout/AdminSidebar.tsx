import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Home,
  Compass,
  KeyRound,
  FileSpreadsheet,
  ShieldCheck,
  Image,
  CalendarRange,
  X,
  LogOut,
  ExternalLink,
  CalendarDays,
  LayoutTemplate,
  ShieldAlert,
} from 'lucide-react';
import { PORTAL_URL } from '../../config/navigation.ts';
import type { User } from '../../types/auth.types.ts';
import type { DashboardTab } from './DashboardNav.tsx';

export interface AdminSidebarProps {
  currentTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  user: User;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
}

interface NavItem {
  id: DashboardTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ADMIN_NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Inicio', icon: LayoutDashboard },
  { id: 'portal_cms', label: 'Personalizador Portal', icon: LayoutTemplate },
  { id: 'events', label: 'Agenda Cultural', icon: CalendarDays },
  { id: 'attractions', label: 'Atractivos y Senderos', icon: Compass },
  { id: 'emergencies', label: 'Guardias y Farmacias', icon: ShieldAlert },
  { id: 'accommodations', label: 'Prestadores Adheridos', icon: Home },
  { id: 'invitations', label: 'Invitaciones a Prestadores', icon: KeyRound },
  { id: 'reports', label: 'Reportes Turísticos', icon: FileSpreadsheet },
  { id: 'audit', label: 'Auditoría de Actividad', icon: ShieldCheck },
  { id: 'moderation', label: 'Moderación de Fotos', icon: Image },
  { id: 'settings', label: 'Temporadas Oficiales', icon: CalendarRange },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onTabChange,
  user,
  isOpenMobile,
  onCloseMobile,
  onLogout,
}) => {
  const [isHovered, setIsHovered] = useState(false);

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
    if (isOpenMobile) {
      onCloseMobile();
    }
  };

  const initials = `${user.name?.charAt(0) ?? 'U'}${user.lastName?.charAt(0) ?? ''}`.toUpperCase();

  const renderContent = (expanded: boolean) => (
    <div className="flex flex-col h-full justify-between p-3.5 bg-white border-r border-[var(--color-sand-200)] select-none">
      {/* 1. Header & Brand */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-sand-200)]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-emerald-portal-600)] flex items-center justify-center text-white font-extrabold text-sm font-['Outfit'] shadow-xs shrink-0">
              CM
            </div>
            {expanded && (
              <div className="min-w-0 animate-in fade-in duration-200">
                <span className="text-xs font-black tracking-wider uppercase text-[var(--color-sand-900)] font-['Outfit'] block truncate">
                  Turismo Capilla
                </span>
                <span className="text-[10px] text-[var(--color-emerald-portal-600)] font-bold uppercase tracking-wider block truncate">
                  Comisión Municipal
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

        {/* 2. Navigation Links */}
        <nav className="space-y-1" aria-label="Menú de gestión municipal">
          {ADMIN_NAV_ITEMS.map((item) => {
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
                    ? 'bg-[var(--color-emerald-portal-600)] text-white shadow-xs font-bold'
                    : 'text-[var(--color-sand-700)] hover:bg-[var(--color-sand-100)] hover:text-[var(--color-sand-900)]'
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? 'text-white' : 'text-[var(--color-emerald-portal-600)]'
                  }`}
                />
                {expanded && (
                  <span className="text-xs font-bold block truncate leading-tight animate-in fade-in duration-200">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 3. Operator Profile, External Link & Logout */}
      <div className="pt-3 border-t border-[var(--color-sand-200)] mt-auto space-y-2">
        {/* Link al Portal Público */}
        <a
          href={PORTAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          title={!expanded ? 'Ver Portal Turístico' : undefined}
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
              ? 'bg-[var(--color-sand-200)] ring-1 ring-[var(--color-emerald-portal-600)]'
              : 'hover:bg-[var(--color-sand-100)]'
          } ${expanded ? 'p-2' : 'p-1'}`}
        >
          {expanded ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-emerald-portal-600)] text-white font-bold flex items-center justify-center text-xs shrink-0">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[var(--color-sand-900)] truncate">
                  {user.name} {user.lastName}
                </p>
                <p className="text-[10px] text-[var(--color-emerald-portal-600)] font-semibold truncate">
                  Mi Perfil & Seguridad
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div
                title={`${user.name} ${user.lastName} — Mi Perfil`}
                className="w-9 h-9 rounded-lg bg-[var(--color-emerald-portal-600)] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs"
              >
                {initials}
              </div>
            </div>
          )}
        </button>

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

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex" role="dialog" aria-modal="true">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-[#22201E]/60 backdrop-blur-xs transition-opacity duration-300 ease-out"
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
