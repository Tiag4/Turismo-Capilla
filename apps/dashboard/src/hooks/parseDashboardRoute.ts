import type { UserRole } from '../types/auth.types.ts';
import type { RouteDetail, DashboardTab } from './dashboardRouter.types.ts';
import { ROUTE_ALIASES, sanitizeTabForRole } from './dashboardRouter.types.ts';

const createDefaultRouteState = (tab: DashboardTab): RouteDetail => ({
  tab,
  accommodationView: 'list',
  eventView: 'list',
  attractionView: 'list',
  alertView: 'list',
  emergencyView: 'list',
  seasonView: 'list',
  invitationView: 'list',
  calendarView: 'calendar',
});

export const parseRouteFromPath = (pathname: string, role: UserRole): RouteDetail => {
  const normalized = decodeURIComponent(pathname.toLowerCase()).replace(/\/+$/, '');
  const base = createDefaultRouteState(role === 'ADMIN' ? 'overview' : 'bookings');

  // Accommodations: /mis-cabanas/nuevo or /alojamientos/nuevo
  if (normalized === '/mis-cabanas/nuevo' || normalized === '/alojamientos/nuevo') {
    return { ...base, tab: 'accommodations', accommodationView: 'create' };
  }
  const accMatch = normalized.match(/^\/(?:mis-cabanas|mis-cabañas|alojamientos)\/([^/]+)\/editar$/i);
  if (accMatch?.[1]) {
    return { ...base, tab: 'accommodations', accommodationView: 'edit', accommodationEditId: accMatch[1] };
  }

  // Events: /agenda-cultural/nuevo or /eventos/nuevo
  if (normalized === '/agenda-cultural/nuevo' || normalized === '/eventos/nuevo') {
    return { ...base, tab: 'events', eventView: 'create' };
  }
  const eventMatch = normalized.match(/^\/(?:agenda-cultural|eventos)\/([^/]+)\/editar$/i);
  if (eventMatch?.[1]) {
    return { ...base, tab: 'events', eventView: 'edit', eventEditId: eventMatch[1] };
  }

  // Attractions: /atractivos/nuevo or /senderos/nuevo
  if (normalized === '/atractivos/nuevo' || normalized === '/senderos/nuevo') {
    return { ...base, tab: 'attractions', attractionView: 'create' };
  }
  const attMatch = normalized.match(/^\/(?:atractivos|senderos|paseos)\/([^/]+)\/editar$/i);
  if (attMatch?.[1]) {
    return { ...base, tab: 'attractions', attractionView: 'edit', attractionEditId: attMatch[1] };
  }

  // Alerts: /alertas/nueva
  if (normalized === '/alertas/nueva' || normalized === '/alertas/nuevo') {
    return { ...base, tab: 'alerts', alertView: 'create' };
  }
  const alertMatch = normalized.match(/^\/alertas\/([^/]+)\/editar$/i);
  if (alertMatch?.[1]) {
    return { ...base, tab: 'alerts', alertView: 'edit', alertEditId: alertMatch[1] };
  }

  // Emergencies / Guardias: /guardias-farmacias/nueva
  if (normalized === '/guardias-farmacias/nueva' || normalized === '/guardias-farmacias/nuevo') {
    return { ...base, tab: 'emergencies', emergencyView: 'create' };
  }
  const emMatch = normalized.match(/^\/(?:guardias-farmacias|emergencias|farmacias)\/([^/]+)\/editar$/i);
  if (emMatch?.[1]) {
    return { ...base, tab: 'emergencies', emergencyView: 'edit', emergencyEditId: emMatch[1] };
  }

  // Invitations: /invitaciones/nueva
  if (normalized === '/invitaciones/nueva' || normalized === '/invitaciones/nuevo') {
    return { ...base, tab: 'invitations', invitationView: 'create' };
  }

  // Settings / Seasons: /configuracion/temporadas/nueva
  if (normalized === '/configuracion/temporadas/nueva' || normalized === '/configuracion/temporadas/nuevo') {
    return { ...base, tab: 'settings', seasonView: 'create' };
  }
  const seasonMatch = normalized.match(/^\/configuracion\/temporadas\/([^/]+)\/editar$/i);
  if (seasonMatch?.[1]) {
    return { ...base, tab: 'settings', seasonView: 'edit', seasonEditId: seasonMatch[1] };
  }

  // Calendar: /calendario/bloquear-fechas
  if (normalized === '/calendario/bloquear-fechas' || normalized === '/calendario/bloquear') {
    return { ...base, tab: 'calendar', calendarView: 'createBlock' };
  }

  // Standard tab matching
  if (ROUTE_ALIASES[normalized]) {
    return { ...base, tab: sanitizeTabForRole(ROUTE_ALIASES[normalized], role) };
  }

  return base;
};

export const getTabFromPath = (pathname: string, role: UserRole): DashboardTab => {
  return parseRouteFromPath(pathname, role).tab;
};
