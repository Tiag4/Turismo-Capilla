import React from 'react';
import { CalendarCheck, Home, KeyRound, BarChart3, Compass, Users, AlertTriangle } from 'lucide-react';
import type { UserRole } from '../../types/auth.types.ts';

export type DashboardTab =
  | 'overview'
  | 'bookings'
  | 'accommodations'
  | 'attractions'
  | 'alerts'
  | 'calendar'
  | 'pricing'
  | 'performance'
  | 'invitations'
  | 'reports'
  | 'audit'
  | 'moderation'
  | 'settings'
  | 'events'
  | 'portal_cms'
  | 'profile';

export interface DashboardNavProps {
  currentTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  role: UserRole;
}

export const DashboardNav: React.FC<DashboardNavProps> = ({
  currentTab,
  onTabChange,
  role,
}) => {
  const tabs = [
    ...(role === 'ADMIN'
      ? [
          { id: 'overview' as DashboardTab, label: 'Panel General', icon: BarChart3 },
          { id: 'attractions' as DashboardTab, label: 'Atractivos y Senderos', icon: Compass },
          { id: 'alerts' as DashboardTab, label: 'Alertas y Seguridad', icon: AlertTriangle },
          { id: 'invitations' as DashboardTab, label: 'Tokens de Invitación', icon: KeyRound },
        ]
      : []),
    { id: 'bookings' as DashboardTab, label: 'Gestión de Reservas', icon: CalendarCheck },
    {
      id: 'accommodations' as DashboardTab,
      label: role === 'ADMIN' ? 'Prestadores Adheridos' : 'Mis Cabañas',
      icon: role === 'ADMIN' ? Users : Home,
    },
  ];

  return (
    <nav className="border-b border-[var(--color-sand-200)] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-2 sm:space-x-8 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-[var(--color-terracotta-500)] text-[var(--color-terracotta-600)]'
                  : 'border-transparent text-[var(--color-sand-400)] hover:text-[var(--color-sand-800)] hover:border-[var(--color-sand-300)]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--color-terracotta-500)]' : 'text-current'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
