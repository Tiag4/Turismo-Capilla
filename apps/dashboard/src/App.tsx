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
import { HostPerformanceView } from './components/analytics/HostPerformanceView.tsx';

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
      {currentTab === 'performance' && <HostPerformanceView />}
    </DashboardLayout>
  );
};
