import React, { useEffect, useRef } from 'react';
import {
  LogOut,
  Home,
  User as UserIcon,
  CalendarCheck,
  Calendar,
  Tag,
  BarChart3,
  KeyRound,
  FileSpreadsheet,
  ShieldCheck,
  Image,
  CalendarRange,
  ChevronRight,
} from 'lucide-react';
import type { User } from '../../types/auth.types.ts';
import type { DashboardTab } from './DashboardNav.tsx';

export interface UserMenuDropdownProps {
  user: User;
  currentTab?: DashboardTab;
  onTabChange?: (tab: DashboardTab) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

interface NavShortcut {
  id: DashboardTab;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

const HOST_SHORTCUTS: NavShortcut[] = [
  { id: 'bookings', label: 'Reservas', desc: 'Solicitudes y confirmadas', icon: CalendarCheck },
  { id: 'accommodations', label: 'Mis Cabañas', desc: 'Establecimientos y fotos', icon: Home },
  { id: 'calendar', label: 'Calendario', desc: 'Ocupación y bloqueos', icon: Calendar },
  { id: 'pricing', label: 'Tarifas y Temporadas', desc: 'Precios y estadía mínima', icon: Tag },
  { id: 'performance', label: 'Rendimiento', desc: 'Balance y métricas clave', icon: BarChart3 },
];

const ADMIN_SHORTCUTS: NavShortcut[] = [
  { id: 'overview', label: 'Centro de Control', desc: 'Métricas del destino', icon: BarChart3 },
  { id: 'bookings', label: 'Reservas', desc: 'Gestión integral', icon: CalendarCheck },
  { id: 'accommodations', label: 'Prestadores Adheridos', desc: 'Catálogo oficial', icon: Home },
  { id: 'invitations', label: 'Tokens de Invitación', desc: 'Acceso y habilitación', icon: KeyRound },
  { id: 'reports', label: 'Reportes Turísticos', desc: 'Estadísticas oficiales', icon: FileSpreadsheet },
  { id: 'audit', label: 'Auditoría', desc: 'Trazabilidad y seguridad', icon: ShieldCheck },
  { id: 'moderation', label: 'Moderación de Fotos', desc: 'Revisión visual', icon: Image },
  { id: 'settings', label: 'Temporadas Oficiales', desc: 'Calendario y tarifas sugeridas', icon: CalendarRange },
];

export const UserMenuDropdown: React.FC<UserMenuDropdownProps> = ({
  user,
  currentTab,
  onTabChange,
  onLogout,
  isOpen,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = user.role === 'ADMIN' ? ADMIN_SHORTCUTS : HOST_SHORTCUTS;
  const initials = `${user.name?.[0] ?? 'U'}${user.lastName?.[0] ?? ''}`.toUpperCase();

  const handleSelectNav = (tabId: DashboardTab) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-xl border border-[var(--color-sand-200)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
      role="menu"
      aria-label="Panel de usuario y navegación"
    >
      {/* 1. User Identity Header */}
      <div className="p-4 bg-[var(--color-sand-50)] border-b border-[var(--color-sand-200)]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[var(--color-terracotta-500)] text-white font-extrabold flex items-center justify-center text-sm font-['Outfit'] shadow-xs shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-bold text-[var(--color-sand-900)] block truncate">
              {user.name} {user.lastName}
            </span>
            <span className="text-[11px] text-[var(--color-sand-500)] block truncate">
              {user.email}
            </span>
            <div className="mt-1">
              <span
                className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md text-white ${
                  user.role === 'ADMIN'
                    ? 'bg-[var(--color-emerald-portal-600)]'
                    : 'bg-[var(--color-terracotta-500)]'
                }`}
              >
                {user.role === 'ADMIN' ? 'Comisión Municipal' : 'Cabañero / Prestador'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Profile & Security Action */}
      <div className="p-2 border-b border-[var(--color-sand-200)]">
        <button
          type="button"
          onClick={() => handleSelectNav('profile')}
          className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
            currentTab === 'profile'
              ? 'bg-[var(--color-sand-100)] text-[var(--color-sand-900)] font-bold'
              : 'text-[var(--color-sand-800)] hover:bg-[var(--color-sand-50)]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[var(--color-sand-100)] text-[var(--color-sand-700)] flex items-center justify-center">
              <UserIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold block leading-tight">Mi Perfil y Seguridad</span>
              <span className="text-[10px] text-[var(--color-sand-500)] block leading-tight">Datos personales y clave</span>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--color-sand-400)]" />
        </button>
      </div>

      {/* 3. Navigation Shortcuts */}
      <div className="p-2 border-b border-[var(--color-sand-200)] max-h-56 overflow-y-auto">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-sand-400)] block px-2 py-1">
          Módulos de Gestión
        </span>
        <div className="space-y-1">
          {shortcuts.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectNav(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[var(--color-sand-100)] text-[var(--color-sand-900)] font-bold'
                    : 'text-[var(--color-sand-700)] hover:bg-[var(--color-sand-50)] hover:text-[var(--color-sand-900)]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive
                        ? 'text-[var(--color-terracotta-600)]'
                        : 'text-[var(--color-sand-400)]'
                    }`}
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-semibold block truncate leading-tight">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-[var(--color-sand-400)] block truncate leading-tight">
                      {item.desc}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[var(--color-sand-300)] shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Action Footer: Logout */}
      <div className="p-2 bg-[var(--color-sand-50)]">
        <button
          type="button"
          onClick={() => {
            onClose();
            onLogout();
          }}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-rose-700 hover:bg-rose-50 hover:text-rose-800 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};
