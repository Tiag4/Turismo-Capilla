import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth.ts';
import { LoginForm } from './components/auth/LoginForm.tsx';
import { DashboardLayout } from './components/layout/DashboardLayout.tsx';
import { type DashboardTab } from './components/layout/DashboardNav.tsx';
import { BookingList } from './components/bookings/BookingList.tsx';
import { AccommodationList } from './components/accommodations/AccommodationList.tsx';
import { InvitationManager } from './components/invitations/InvitationManager.tsx';
import { AdminOverview } from './components/overview/AdminOverview.tsx';
import { BookingCalendar } from './components/calendar/BookingCalendar.tsx';
import { SeasonalRatesManager } from './components/pricing/SeasonalRatesManager.tsx';

export const App: React.FC = () => {
  const { user, isAuthenticated, isLoading, error, login, logout, switchRole } = useAuth();
  const [currentTab, setCurrentTab] = useState<DashboardTab>('bookings');

  if (!isAuthenticated || !user) {
    return <LoginForm onLogin={login} isLoading={isLoading} error={error} />;
  }

  return (
    <DashboardLayout
      user={user}
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      onLogout={logout}
      onSwitchRole={(role) => {
        switchRole(role);
        if (role === 'HOST' && (currentTab === 'invitations' || currentTab === 'overview')) {
          setCurrentTab('bookings');
        }
      }}
    >
      {currentTab === 'overview' && user.role === 'ADMIN' && (
        <AdminOverview onNavigateTab={setCurrentTab} />
      )}
      {currentTab === 'bookings' && <BookingList />}
      {currentTab === 'accommodations' && <AccommodationList />}
      {currentTab === 'invitations' && user.role === 'ADMIN' && <InvitationManager />}
      {currentTab === 'calendar' && <BookingCalendar />}
      {currentTab === 'pricing' && <SeasonalRatesManager />}
      {currentTab === 'performance' && (
        <div className="bg-white rounded-2xl p-8 border border-[var(--color-sand-200)] text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-terracotta-50)] text-[var(--color-terracotta-500)] flex items-center justify-center mx-auto">
            <span className="text-xl">📊</span>
          </div>
          <h3 className="text-base font-bold text-[var(--color-sand-900)] font-['Outfit']">
            Rendimiento y Balance
          </h3>
          <p className="text-xs text-[var(--color-sand-400)] max-w-md mx-auto">
            Indicadores clave de rendimiento, tasa de ocupación mensual y balance financiero.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
};
