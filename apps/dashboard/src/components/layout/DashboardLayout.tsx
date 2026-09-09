import React, { useState } from 'react';
import { DashboardHeader } from './DashboardHeader.tsx';
import { DashboardNav, type DashboardTab } from './DashboardNav.tsx';
import { AdminSidebar } from './AdminSidebar.tsx';
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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isAdmin = user.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      {/* Admin Sidebar navigation shell */}
      {isAdmin && (
        <AdminSidebar
          currentTab={currentTab}
          onTabChange={onTabChange}
          user={user}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onLogout={onLogout}
          onSwitchRole={onSwitchRole}
        />
      )}

      {/* Top Header */}
      <DashboardHeader
        user={user}
        onLogout={onLogout}
        onSwitchRole={onSwitchRole}
        onOpenMobileMenu={isAdmin ? () => setIsMobileSidebarOpen(true) : undefined}
      />

      {/* Fallback top nav for Host role until Tiago implements HostSidebar (TDR-05) */}
      {!isAdmin && (
        <DashboardNav
          currentTab={currentTab}
          onTabChange={onTabChange}
          role={user.role}
        />
      )}

      {/* Main Content Area: Offset by md:pl-64 when Admin Sidebar is fixed */}
      <main className={`flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isAdmin ? 'md:pl-72 max-w-none' : 'max-w-7xl'}`}>
        {children}
      </main>

      {/* Footer */}
      <footer className={`bg-white border-t border-[var(--color-sand-200)] py-4 text-center text-xs text-[var(--color-sand-400)] ${isAdmin ? 'md:pl-64' : ''}`}>
        Secretaría y Comisión de Turismo de Capilla del Monte — OTA Oficial
      </footer>
    </div>
  );
};
