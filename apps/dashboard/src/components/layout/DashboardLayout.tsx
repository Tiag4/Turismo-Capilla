import React from 'react';
import { DashboardHeader } from './DashboardHeader.tsx';
import { DashboardNav, type DashboardTab } from './DashboardNav.tsx';
import type { User, UserRole } from '../../types/auth.types.ts';

export interface DashboardLayoutProps {
  user: User;
  currentTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onLogout: () => void;
  onSwitchRole: (role: UserRole) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  user,
  currentTab,
  onTabChange,
  onLogout,
  onSwitchRole,
  children,
}) => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <DashboardHeader
        user={user}
        onLogout={onLogout}
        onSwitchRole={onSwitchRole}
      />
      <DashboardNav
        currentTab={currentTab}
        onTabChange={onTabChange}
        role={user.role}
      />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white border-t border-[var(--color-sand-200)] py-4 text-center text-xs text-[var(--color-sand-400)]">
        Secretaría y Comisión de Turismo de Capilla del Monte — OTA Oficial
      </footer>
    </div>
  );
};
