import React from 'react';
import { AuthProvider, useAuthContext } from './context/AuthContext.tsx';
import { LoginForm } from './components/auth/LoginForm.tsx';
import { HostRegistrationPage } from './components/auth/HostRegistrationPage.tsx';
import { DashboardLayout } from './components/layout/DashboardLayout.tsx';
import { BookingList } from './components/bookings/BookingList.tsx';
import { AccommodationList } from './components/accommodations/AccommodationList.tsx';
import { AccommodationEditorPage } from './components/accommodations/editor/AccommodationEditorPage.tsx';
import { InvitationManager } from './components/invitations/InvitationManager.tsx';
import { InvitationCreatePage } from './components/invitations/editor/InvitationCreatePage.tsx';
import { AdminOverview } from './components/overview/AdminOverview.tsx';
import { BookingCalendar } from './components/calendar/BookingCalendar.tsx';
import { DateBlockEditorPage } from './components/calendar/editor/DateBlockEditorPage.tsx';
import { SeasonalRatesManager } from './components/pricing/SeasonalRatesManager.tsx';
import { HostPerformanceView } from './components/analytics/HostPerformanceView.tsx';
import { OccupancyReportView } from './components/reports/OccupancyReportView.tsx';
import { ActivityLogView } from './components/audit/ActivityLogView.tsx';
import { ContentModerationView } from './components/moderation/ContentModerationView.tsx';
import { TourismCalendarSettings } from './components/settings/TourismCalendarSettings.tsx';
import { SeasonEditorPage } from './components/settings/editor/SeasonEditorPage.tsx';

import { CulturalAgendaManager } from './components/cms/CulturalAgendaManager.tsx';
import { EventEditorPage } from './components/cms/EventEditorPage.tsx';
import { PortalCustomizerPage } from './components/cms/PortalCustomizerPage.tsx';
import { MobilityManagerView } from './components/mobility/MobilityManagerView.tsx';

import { AttractionsManager } from './components/attractions/AttractionsManager.tsx';
import { AttractionEditorPage } from './components/attractions/editor/AttractionEditorPage.tsx';
import { CircuitsManagerView } from './components/circuits/CircuitsManagerView.tsx';
import { CircuitEditorPage } from './components/circuits/editor/CircuitEditorPage.tsx';
import { ProvidersDirectoryView } from './components/providers/ProvidersDirectoryView.tsx';
import { AlertsManagerView } from './components/alerts/AlertsManagerView.tsx';
import { AlertEditorPage } from './components/alerts/editor/AlertEditorPage.tsx';
import { EmergencySanitaryManagerView } from './components/emergencies/EmergencySanitaryManagerView.tsx';
import { PharmacyDutyEditorPage } from './components/emergencies/editor/PharmacyDutyEditorPage.tsx';
import { ProfileView } from './components/profile/ProfileView.tsx';

import { useDashboardRouter } from './hooks/useDashboardRouter.ts';
import { WorkspaceSelectorPage } from './components/auth/WorkspaceSelectorPage.tsx';
import type { UserRole } from './types/auth.types.ts';

const DashboardContent: React.FC = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    updateProfile,
    changePassword,
    activeWorkspace,
    switchWorkspace,
    setActiveWorkspace,
    isDualRole,
  } = useAuthContext();

  const effectiveRole: UserRole =
    user?.role === 'ADMIN' ? (activeWorkspace ?? 'ADMIN') : (user?.role ?? 'HOST');

  const {
    currentTab,
    setCurrentTab,
    accommodationView,
    accommodationEditId,
    navigateToAccommodationCreate,
    navigateToAccommodationEdit,
    navigateToAccommodationList,
    eventView,
    eventEditId,
    navigateToEventCreate,
    navigateToEventEdit,
    navigateToEventList,
    attractionView,
    attractionEditId,
    navigateToAttractionCreate,
    navigateToAttractionEdit,
    navigateToAttractionList,
    circuitView,
    circuitCategory,
    circuitEditId,
    navigateToCircuitCreate,
    navigateToCircuitEdit,
    navigateToCircuitList,
    alertView,
    alertEditId,
    navigateToAlertCreate,
    navigateToAlertEdit,
    navigateToAlertList,
    emergencyView,
    emergencyEditId,
    navigateToEmergencyCreate,
    navigateToEmergencyEdit,
    navigateToEmergencyList,
    invitationView,
    navigateToInvitationCreate,
    navigateToInvitationList,
    seasonView,
    seasonEditId,
    navigateToSeasonCreate,
    navigateToSeasonEdit,
    navigateToSeasonList,
    calendarView,
    navigateToCalendarBlock,
    navigateToCalendar,
  } = useDashboardRouter(isAuthenticated && user && activeWorkspace !== null ? effectiveRole : null);

  const isHostRegistrationRoute =
    typeof window !== 'undefined' &&
    window.location.pathname.replace(/\/+$/, '') === '/registro-prestador';

  if (isHostRegistrationRoute) {
    return <HostRegistrationPage />;
  }

  if (!isAuthenticated || !user) {
    return <LoginForm onLogin={login} isLoading={isLoading} error={error} />;
  }

  if (user.role === 'ADMIN' && activeWorkspace === null) {
    return (
      <WorkspaceSelectorPage
        user={user}
        onSelectWorkspace={(workspace) => {
          switchWorkspace(workspace);
          setCurrentTab(workspace === 'ADMIN' ? 'overview' : 'bookings');
        }}
        onLogout={logout}
      />
    );
  }

  return (
    <DashboardLayout
      user={user}
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      onLogout={logout}
      effectiveRole={effectiveRole}
      isDualRole={isDualRole}
      onSwitchWorkspace={(ws) => {
        switchWorkspace(ws);
        setCurrentTab(ws === 'ADMIN' ? 'overview' : 'bookings');
      }}
      onOpenWorkspaceSelector={() => setActiveWorkspace(null)}
    >
      {currentTab === 'overview' && effectiveRole === 'ADMIN' && (
        <AdminOverview onNavigateTab={setCurrentTab} />
      )}

      {currentTab === 'portal_cms' && effectiveRole === 'ADMIN' && (
        <PortalCustomizerPage
          onNavigateToEvents={() => setCurrentTab('events')}
          onNavigateToAccommodations={() => setCurrentTab('accommodations')}
        />
      )}

      {currentTab === 'mobility' && effectiveRole === 'ADMIN' && (
        <MobilityManagerView />
      )}

      {currentTab === 'events' && effectiveRole === 'ADMIN' && (
        eventView === 'list' ? (
          <CulturalAgendaManager
            onNavigateCreate={navigateToEventCreate}
            onNavigateEdit={navigateToEventEdit}
          />
        ) : (
          <EventEditorPage
            mode={eventView}
            eventId={eventEditId}
            onBack={navigateToEventList}
            onSuccess={navigateToEventList}
          />
        )
      )}

      {currentTab === 'attractions' && effectiveRole === 'ADMIN' && (
        attractionView === 'list' ? (
          <AttractionsManager
            onNavigateCreate={navigateToAttractionCreate}
            onNavigateEdit={navigateToAttractionEdit}
          />
        ) : (
          <AttractionEditorPage
            mode={attractionView}
            attractionId={attractionEditId}
            onBack={navigateToAttractionList}
            onSuccess={navigateToAttractionList}
          />
        )
      )}

      {currentTab === 'circuits' && effectiveRole === 'ADMIN' && (
        circuitView === 'list' ? (
          <CircuitsManagerView
            initialCategory={circuitCategory}
            onNavigateCreate={navigateToCircuitCreate}
            onNavigateEdit={navigateToCircuitEdit}
          />
        ) : (
          <CircuitEditorPage
            mode={circuitView}
            category={circuitCategory}
            circuitId={circuitEditId}
            onBack={() => navigateToCircuitList(circuitCategory)}
            onSuccess={() => navigateToCircuitList(circuitCategory)}
          />
        )
      )}

      {currentTab === 'emergencies' && effectiveRole === 'ADMIN' && (
        emergencyView === 'list' ? (
          <EmergencySanitaryManagerView
            onNavigateCreate={navigateToEmergencyCreate}
            onNavigateEdit={navigateToEmergencyEdit}
          />
        ) : (
          <PharmacyDutyEditorPage
            mode={emergencyView}
            pharmacyId={emergencyEditId}
            onBack={navigateToEmergencyList}
            onSuccess={navigateToEmergencyList}
          />
        )
      )}

      {currentTab === 'alerts' && effectiveRole === 'ADMIN' && (
        alertView === 'list' ? (
          <AlertsManagerView
            onNavigateCreate={navigateToAlertCreate}
            onNavigateEdit={navigateToAlertEdit}
          />
        ) : (
          <AlertEditorPage
            mode={alertView}
            alertId={alertEditId}
            onBack={navigateToAlertList}
            onSuccess={navigateToAlertList}
          />
        )
      )}

      {currentTab === 'bookings' && <BookingList />}

      {currentTab === 'accommodations' && (
        accommodationView === 'list' ? (
          effectiveRole === 'ADMIN' ? (
            <ProvidersDirectoryView
              onNavigateCreate={navigateToAccommodationCreate}
              onNavigateEdit={navigateToAccommodationEdit}
            />
          ) : (
            <AccommodationList
              onNavigateCreate={navigateToAccommodationCreate}
              onNavigateEdit={navigateToAccommodationEdit}
            />
          )
        ) : (
          <AccommodationEditorPage
            mode={accommodationView}
            accommodationId={accommodationEditId}
            onBack={navigateToAccommodationList}
            onSuccess={navigateToAccommodationList}
          />
        )
      )}

      {currentTab === 'invitations' && effectiveRole === 'ADMIN' && (
        invitationView === 'list' ? (
          <InvitationManager onNavigateCreate={navigateToInvitationCreate} />
        ) : (
          <InvitationCreatePage
            onBack={navigateToInvitationList}
            onSuccess={navigateToInvitationList}
          />
        )
      )}

      {currentTab === 'reports' && effectiveRole === 'ADMIN' && <OccupancyReportView />}
      {currentTab === 'audit' && effectiveRole === 'ADMIN' && <ActivityLogView />}
      {currentTab === 'moderation' && effectiveRole === 'ADMIN' && <ContentModerationView />}

      {currentTab === 'settings' && effectiveRole === 'ADMIN' && (
        seasonView === 'list' ? (
          <TourismCalendarSettings
            onNavigateCreate={navigateToSeasonCreate}
            onNavigateEdit={navigateToSeasonEdit}
          />
        ) : (
          <SeasonEditorPage
            mode={seasonView}
            seasonId={seasonEditId}
            onBack={navigateToSeasonList}
            onSuccess={navigateToSeasonList}
          />
        )
      )}

      {currentTab === 'calendar' && (
        calendarView === 'calendar' ? (
          <BookingCalendar onNavigateCreateBlock={navigateToCalendarBlock} />
        ) : (
          <DateBlockEditorPage
            onBack={navigateToCalendar}
            onSuccess={navigateToCalendar}
          />
        )
      )}

      {currentTab === 'pricing' && <SeasonalRatesManager />}
      {currentTab === 'performance' && <HostPerformanceView />}
      {currentTab === 'profile' && (
        <ProfileView
          user={user}
          onUpdateProfile={updateProfile}
          onChangePassword={changePassword}
        />
      )}
    </DashboardLayout>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
};
