import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth.ts';
import { LoginForm } from './components/auth/LoginForm.tsx';
import { DashboardLayout } from './components/layout/DashboardLayout.tsx';
import { type DashboardTab } from './components/layout/DashboardNav.tsx';
import { BookingList } from './components/bookings/BookingList.tsx';
import { AccommodationList } from './components/accommodations/AccommodationList.tsx';
import { InvitationManager } from './components/invitations/InvitationManager.tsx';
import { AdminOverview } from './components/overview/AdminOverview.tsx';
import { OccupancyReportView } from './components/reports/OccupancyReportView.tsx';
import { ActivityLogView } from './components/audit/ActivityLogView.tsx';

import { AdminSectionPlaceholder } from './components/layout/AdminSectionPlaceholder.tsx';

export const App: React.FC = () => {
  const { user, isAuthenticated, isLoading, error, login, logout, switchRole } = useAuth();
  const [currentTab, setCurrentTab] = useState<DashboardTab>('overview');

  if (!isAuthenticated || !user) {
    return <LoginForm onLogin={login} isLoading={isLoading} error={error} />;
  }

  const isPlaceholderTab = ['moderation', 'settings'].includes(currentTab);

  return (
    <DashboardLayout
      user={user}
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      onLogout={logout}
      onSwitchRole={(role) => {
        switchRole(role);
        if (role === 'HOST' && currentTab !== 'bookings' && currentTab !== 'accommodations') {
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
      {currentTab === 'reports' && user.role === 'ADMIN' && <OccupancyReportView />}
      {currentTab === 'audit' && user.role === 'ADMIN' && <ActivityLogView />}
      {isPlaceholderTab && user.role === 'ADMIN' && <AdminSectionPlaceholder tab={currentTab} />}
    </DashboardLayout>
  );
};
