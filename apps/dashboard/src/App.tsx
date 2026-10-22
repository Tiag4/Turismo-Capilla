import React from 'react';
import { useAuth } from './hooks/useAuth.ts';
import { LoginForm } from './components/auth/LoginForm.tsx';
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

import { AttractionsManager } from './components/attractions/AttractionsManager.tsx';
import { AttractionEditorPage } from './components/attractions/editor/AttractionEditorPage.tsx';
import { ProvidersDirectoryView } from './components/providers/ProvidersDirectoryView.tsx';
import { AlertsManagerView } from './components/alerts/AlertsManagerView.tsx';
import { AlertEditorPage } from './components/alerts/editor/AlertEditorPage.tsx';
import { EmergencySanitaryManagerView } from './components/emergencies/EmergencySanitaryManagerView.tsx';
import { PharmacyDutyEditorPage } from './components/emergencies/editor/PharmacyDutyEditorPage.tsx';
import { ProfileView } from './components/profile/ProfileView.tsx';

import { useDashboardRouter } from './hooks/useDashboardRouter.ts';

export const App: React.FC = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    updateProfile,
    changePassword,
  } = useAuth();

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
  } = useDashboardRouter(user?.role ?? 'HOST');

  if (!isAuthenticated || !user) {
    return <LoginForm onLogin={login} isLoading={isLoading} error={error} />;
  }

  return (
    <DashboardLayout
      user={user}
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      onLogout={logout}
    >
      {currentTab === 'overview' && user.role === 'ADMIN' && (
        <AdminOverview onNavigateTab={setCurrentTab} />
      )}

      {currentTab === 'portal_cms' && user.role === 'ADMIN' && (
        <PortalCustomizerPage
          onNavigateToEvents={() => setCurrentTab('events')}
          onNavigateToAccommodations={() => setCurrentTab('accommodations')}
        />
      )}

      {currentTab === 'events' && user.role === 'ADMIN' && (
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

      {currentTab === 'attractions' && user.role === 'ADMIN' && (
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

      {currentTab === 'emergencies' && user.role === 'ADMIN' && (
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

      {currentTab === 'alerts' && user.role === 'ADMIN' && (
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
          user.role === 'ADMIN' ? (
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

      {currentTab === 'invitations' && user.role === 'ADMIN' && (
        invitationView === 'list' ? (
          <InvitationManager onNavigateCreate={navigateToInvitationCreate} />
        ) : (
          <InvitationCreatePage
            onBack={navigateToInvitationList}
            onSuccess={navigateToInvitationList}
          />
        )
      )}

      {currentTab === 'reports' && user.role === 'ADMIN' && <OccupancyReportView />}
      {currentTab === 'audit' && user.role === 'ADMIN' && <ActivityLogView />}
      {currentTab === 'moderation' && user.role === 'ADMIN' && <ContentModerationView />}

      {currentTab === 'settings' && user.role === 'ADMIN' && (
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
