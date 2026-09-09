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
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Admin Sidebar navigation shell (fixed w-64 on desktop) */}
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

      {/* Main Right Area: strictly shifted to the right of the sidebar via md:pl-64 */}
      <div className={`flex flex-col min-h-screen ${isAdmin ? 'md:pl-64' : ''}`}>
        {/* Top Header */}
        <DashboardHeader
          user={user}
          onLogout={onLogout}
          onSwitchRole={onSwitchRole}
          onOpenMobileMenu={isAdmin ? () => setIsMobileSidebarOpen(true) : undefined}
          hideBrandOnDesktop={isAdmin}
        />

        {/* Fallback top nav for Host role until Tiago implements HostSidebar (TDR-05) */}
        {!isAdmin && (
          <DashboardNav
            currentTab={currentTab}
            onTabChange={onTabChange}
            role={user.role}
          />
        )}

        {/* Main Content Area: completely clear of the sidebar, full visible width */}
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-[var(--color-sand-200)] py-4 text-center text-xs text-[var(--color-sand-400)]">
          Secretaría y Comisión de Turismo de Capilla del Monte — OTA Oficial
        </footer>
      </div>
    </div>
  );
};
