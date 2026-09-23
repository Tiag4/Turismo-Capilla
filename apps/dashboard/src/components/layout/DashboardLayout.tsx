import React, { useState } from 'react';
import { Menu } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-[var(--color-sand-50)] flex">
      {/* 1. Left Collapsible Hover Sidebar (Desktop Rail w-[72px] expanding on hover to w-72, Drawer on mobile) */}
      {isAdmin ? (
        <AdminSidebar
          currentTab={currentTab}
          onTabChange={onTabChange}
          user={user}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onLogout={onLogout}
          onSwitchRole={onSwitchRole}
        />
      ) : (
        <HostSidebar
          currentTab={currentTab}
          onTabChange={onTabChange}
          user={user}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onLogout={onLogout}
          onSwitchRole={onSwitchRole}
        />
      )}

      {/* 2. Main Content Container: Clean full-height without top bar, offset for collapsed rail on desktop */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-[72px] transition-all">
        {/* Mobile Header Bar (hidden on desktop where the hover rail takes full control) */}
        <header className="h-14 bg-white border-b border-[var(--color-sand-200)] flex items-center justify-between px-4 md:hidden sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1.5 -ml-1 rounded-lg text-[var(--color-sand-800)] hover:bg-[var(--color-sand-100)] cursor-pointer"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="w-5 h-5 text-[var(--color-terracotta-600)]" />
            </button>
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold font-['Outfit'] ${
                  isAdmin ? 'bg-[var(--color-emerald-portal-600)]' : 'bg-[var(--color-terracotta-500)]'
                }`}
              >
                CM
              </div>
              <span className="text-xs font-extrabold uppercase tracking-tight text-[var(--color-sand-900)] font-['Outfit']">
                Turismo Capilla
              </span>
            </div>
          </div>

          <div
            className={`w-7 h-7 rounded-lg text-white text-[11px] font-bold flex items-center justify-center ${
              isAdmin ? 'bg-[var(--color-emerald-portal-600)]' : 'bg-[var(--color-uritorco-500)]'
            }`}
          >
            {user.name.charAt(0)}{user.lastName.charAt(0)}
          </div>
        </header>

        {/* Main Section */}
        <main className="flex-1 min-w-0 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto">
          {children}
        </main>

        {/* Minimal Institutional Footer */}
        <footer className="bg-white border-t border-[var(--color-sand-200)] py-3 text-center text-xs text-[var(--color-sand-400)]">
          Secretaría y Comisión de Turismo de Capilla del Monte — OTA Oficial
        </footer>
      </div>
    </div>
  );
};
