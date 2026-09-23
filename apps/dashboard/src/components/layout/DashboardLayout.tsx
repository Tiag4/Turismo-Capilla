import React, { useState } from 'react';
import { DashboardHeader } from './DashboardHeader.tsx';
import { HostSidebar } from './HostSidebar.tsx';
import { AdminSidebar } from './AdminSidebar.tsx';
import type { DashboardTab } from './DashboardNav.tsx';
import type { User, UserRole } from '../../types/auth.types.ts';

export interface DashboardLayoutProps {
  currentTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  user: User;
  onLogout: () => void;
  onSwitchRole: (role: UserRole) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentTab,
  onTabChange,
  user,
  onLogout,
  onSwitchRole,
  children,
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isAdmin = user.role === 'ADMIN';

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF8F5]">
        {/* Admin Sidebar navigation shell (fixed w-64 on desktop) */}
        <AdminSidebar
          currentTab={currentTab}
          onTabChange={onTabChange}
          user={user}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onLogout={onLogout}
          onSwitchRole={onSwitchRole}
        />

        {/* Main Right Area: shifted to the right via md:pl-64 */}
        <div className="flex flex-col min-h-screen md:pl-64">
          <DashboardHeader
            user={user}
            onLogout={onLogout}
            onSwitchRole={onSwitchRole}
            onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
            hideBrandOnDesktop={true}
          />
          <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="bg-white border-t border-[var(--color-sand-200)] py-4 text-center text-xs text-[var(--color-sand-400)]">
            Secretaría y Comisión de Turismo de Capilla del Monte — OTA Oficial
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-sand-50)] flex flex-col">
      <DashboardHeader
        user={user}
        onLogout={onLogout}
        onSwitchRole={onSwitchRole}
        onToggleMobileMenu={() => setIsMobileSidebarOpen(true)}
        hideBrandOnDesktop={false}
      />
      <div className="flex-1 flex w-full">
        <HostSidebar
          currentTab={currentTab}
          onTabChange={onTabChange}
          user={user}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />
        <main className="flex-1 min-w-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
          {children}
        </main>
      </div>
      <footer className="bg-white border-t border-[var(--color-sand-200)] py-4 text-center text-xs text-[var(--color-sand-400)]">
        Secretaría y Comisión de Turismo de Capilla del Monte — OTA Oficial
      </footer>
    </div>
  );
};
