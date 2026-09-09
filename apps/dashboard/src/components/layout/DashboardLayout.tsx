import React, { useState } from 'react';
import { DashboardHeader } from './DashboardHeader.tsx';
import { DashboardNav, type DashboardTab } from './DashboardNav.tsx';
import { HostSidebar } from './HostSidebar.tsx';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-sand-50)] flex flex-col">
      <DashboardHeader
        user={user}
        onLogout={onLogout}
        onSwitchRole={onSwitchRole}
        onToggleMobileMenu={
          user.role === 'HOST' ? () => setIsMobileMenuOpen((prev) => !prev) : undefined
        }
      />

      {user.role === 'ADMIN' ? (
        <>
          <DashboardNav
            currentTab={currentTab}
            onTabChange={onTabChange}
            role={user.role}
          />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </>
      ) : (
        <div className="flex-1 flex w-full">
          <HostSidebar
            currentTab={currentTab}
            onTabChange={onTabChange}
            user={user}
            isOpenMobile={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />
          <main className="flex-1 min-w-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
            {children}
          </main>
        </div>
      )}

      <footer className="bg-white border-t border-[var(--color-sand-200)] py-4 text-center text-xs text-[var(--color-sand-400)]">
        Secretaría y Comisión de Turismo de Capilla del Monte — OTA Oficial
      </footer>
    </div>
  );
};

