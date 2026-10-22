import { useState, useEffect, useCallback } from 'react';
import type { DashboardTab } from '../components/layout/DashboardNav.tsx';
import type { UserRole } from '../types/auth.types.ts';
import type { RouteDetail } from './dashboardRouter.types.ts';
import { TAB_ROUTE_MAP, sanitizeTabForRole } from './dashboardRouter.types.ts';
import { parseRouteFromPath } from './parseDashboardRoute.ts';

export * from './dashboardRouter.types.ts';
export * from './parseDashboardRoute.ts';

export const useDashboardRouter = (role: UserRole) => {
  const [routeState, setRouteState] = useState<RouteDetail>(() => {
    return parseRouteFromPath(typeof window !== 'undefined' ? window.location.pathname : '/', role);
  });

  const pushRoute = useCallback((nextState: RouteDetail, targetRoute: string, replace = false) => {
    setRouteState(nextState);
    if (typeof window !== 'undefined' && window.location.pathname !== targetRoute) {
      if (replace) {
        window.history.replaceState(nextState, '', targetRoute);
      } else {
        window.history.pushState(nextState, '', targetRoute);
      }
    }
  }, []);

  const navigateToTab = useCallback((tab: DashboardTab, replace = false) => {
    const safeTab = sanitizeTabForRole(tab, role);
    const targetRoute = TAB_ROUTE_MAP[safeTab] || (role === 'ADMIN' ? '/panel-general' : '/reservas');
    const nextState: RouteDetail = {
      tab: safeTab,
      accommodationView: 'list',
      eventView: 'list',
      attractionView: 'list',
      alertView: 'list',
      emergencyView: 'list',
      seasonView: 'list',
      invitationView: 'list',
      calendarView: 'calendar',
    };
    pushRoute(nextState, targetRoute, replace);
  }, [role, pushRoute]);

  // Accommodations
  const navigateToAccommodationCreate = useCallback(() => {
    pushRoute({ ...routeState, tab: 'accommodations', accommodationView: 'create' }, '/mis-cabanas/nuevo');
  }, [routeState, pushRoute]);

  const navigateToAccommodationEdit = useCallback((id: string) => {
    pushRoute({ ...routeState, tab: 'accommodations', accommodationView: 'edit', accommodationEditId: id }, `/mis-cabanas/${id}/editar`);
  }, [routeState, pushRoute]);

  const navigateToAccommodationList = useCallback(() => {
    pushRoute({ ...routeState, tab: 'accommodations', accommodationView: 'list', accommodationEditId: undefined }, '/mis-cabanas');
  }, [routeState, pushRoute]);

  // Events
  const navigateToEventCreate = useCallback(() => {
    pushRoute({ ...routeState, tab: 'events', eventView: 'create' }, '/agenda-cultural/nuevo');
  }, [routeState, pushRoute]);

  const navigateToEventEdit = useCallback((id: string) => {
    pushRoute({ ...routeState, tab: 'events', eventView: 'edit', eventEditId: id }, `/agenda-cultural/${id}/editar`);
  }, [routeState, pushRoute]);

  const navigateToEventList = useCallback(() => {
    pushRoute({ ...routeState, tab: 'events', eventView: 'list', eventEditId: undefined }, '/agenda-cultural');
  }, [routeState, pushRoute]);

  // Attractions
  const navigateToAttractionCreate = useCallback(() => {
    pushRoute({ ...routeState, tab: 'attractions', attractionView: 'create' }, '/atractivos/nuevo');
  }, [routeState, pushRoute]);

  const navigateToAttractionEdit = useCallback((id: string) => {
    pushRoute({ ...routeState, tab: 'attractions', attractionView: 'edit', attractionEditId: id }, `/atractivos/${id}/editar`);
  }, [routeState, pushRoute]);

  const navigateToAttractionList = useCallback(() => {
    pushRoute({ ...routeState, tab: 'attractions', attractionView: 'list', attractionEditId: undefined }, '/atractivos');
  }, [routeState, pushRoute]);

  // Alerts
  const navigateToAlertCreate = useCallback(() => {
    pushRoute({ ...routeState, tab: 'alerts', alertView: 'create' }, '/alertas/nueva');
  }, [routeState, pushRoute]);

  const navigateToAlertEdit = useCallback((id: string) => {
    pushRoute({ ...routeState, tab: 'alerts', alertView: 'edit', alertEditId: id }, `/alertas/${id}/editar`);
  }, [routeState, pushRoute]);

  const navigateToAlertList = useCallback(() => {
    pushRoute({ ...routeState, tab: 'alerts', alertView: 'list', alertEditId: undefined }, '/alertas');
  }, [routeState, pushRoute]);

  // Emergencies / Guardias
  const navigateToEmergencyCreate = useCallback(() => {
    pushRoute({ ...routeState, tab: 'emergencies', emergencyView: 'create' }, '/guardias-farmacias/nueva');
  }, [routeState, pushRoute]);

  const navigateToEmergencyEdit = useCallback((id: string) => {
    pushRoute({ ...routeState, tab: 'emergencies', emergencyView: 'edit', emergencyEditId: id }, `/guardias-farmacias/${id}/editar`);
  }, [routeState, pushRoute]);

  const navigateToEmergencyList = useCallback(() => {
    pushRoute({ ...routeState, tab: 'emergencies', emergencyView: 'list', emergencyEditId: undefined }, '/guardias-farmacias');
  }, [routeState, pushRoute]);

  // Invitations
  const navigateToInvitationCreate = useCallback(() => {
    pushRoute({ ...routeState, tab: 'invitations', invitationView: 'create' }, '/invitaciones/nueva');
  }, [routeState, pushRoute]);

  const navigateToInvitationList = useCallback(() => {
    pushRoute({ ...routeState, tab: 'invitations', invitationView: 'list' }, '/invitaciones');
  }, [routeState, pushRoute]);

  // Seasons
  const navigateToSeasonCreate = useCallback(() => {
    pushRoute({ ...routeState, tab: 'settings', seasonView: 'create' }, '/configuracion/temporadas/nueva');
  }, [routeState, pushRoute]);

  const navigateToSeasonEdit = useCallback((id: string) => {
    pushRoute({ ...routeState, tab: 'settings', seasonView: 'edit', seasonEditId: id }, `/configuracion/temporadas/${id}/editar`);
  }, [routeState, pushRoute]);

  const navigateToSeasonList = useCallback(() => {
    pushRoute({ ...routeState, tab: 'settings', seasonView: 'list', seasonEditId: undefined }, '/configuracion');
  }, [routeState, pushRoute]);

  // Calendar Date Block
  const navigateToCalendarBlock = useCallback(() => {
    pushRoute({ ...routeState, tab: 'calendar', calendarView: 'createBlock' }, '/calendario/bloquear-fechas');
  }, [routeState, pushRoute]);

  const navigateToCalendar = useCallback(() => {
    pushRoute({ ...routeState, tab: 'calendar', calendarView: 'calendar' }, '/calendario');
  }, [routeState, pushRoute]);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseRouteFromPath(window.location.pathname, role);
      setRouteState(parsed);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [role]);

  // Sync initial URL on mount if at root
  useEffect(() => {
    const currentPath = window.location.pathname.replace(/\/+$/, '');
    if (!currentPath || currentPath === '' || currentPath === '/') {
      const defaultRoute = TAB_ROUTE_MAP[routeState.tab];
      window.history.replaceState(routeState, '', defaultRoute);
    }
  }, [routeState]);

  return {
    currentTab: routeState.tab,
    setCurrentTab: navigateToTab,
    accommodationView: routeState.accommodationView,
    accommodationEditId: routeState.accommodationEditId,
    navigateToAccommodationCreate,
    navigateToAccommodationEdit,
    navigateToAccommodationList,
    eventView: routeState.eventView,
    eventEditId: routeState.eventEditId,
    navigateToEventCreate,
    navigateToEventEdit,
    navigateToEventList,
    attractionView: routeState.attractionView,
    attractionEditId: routeState.attractionEditId,
    navigateToAttractionCreate,
    navigateToAttractionEdit,
    navigateToAttractionList,
    alertView: routeState.alertView,
    alertEditId: routeState.alertEditId,
    navigateToAlertCreate,
    navigateToAlertEdit,
    navigateToAlertList,
    emergencyView: routeState.emergencyView,
    emergencyEditId: routeState.emergencyEditId,
    navigateToEmergencyCreate,
    navigateToEmergencyEdit,
    navigateToEmergencyList,
    invitationView: routeState.invitationView,
    navigateToInvitationCreate,
    navigateToInvitationList,
    seasonView: routeState.seasonView,
    seasonEditId: routeState.seasonEditId,
    navigateToSeasonCreate,
    navigateToSeasonEdit,
    navigateToSeasonList,
    calendarView: routeState.calendarView,
    navigateToCalendarBlock,
    navigateToCalendar,
  };
};
