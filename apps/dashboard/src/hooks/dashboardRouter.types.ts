import type { DashboardTab } from '../components/layout/DashboardNav.tsx';
import type { UserRole } from '../types/auth.types.ts';

export type { DashboardTab };

export type EntityViewMode = 'list' | 'create' | 'edit';
export type SimpleViewMode = 'list' | 'create';

export interface RouteDetail {
  tab: DashboardTab;
  accommodationView: EntityViewMode;
  accommodationEditId?: string;
  eventView: EntityViewMode;
  eventEditId?: string;
  attractionView: EntityViewMode;
  attractionEditId?: string;
  alertView: EntityViewMode;
  alertEditId?: string;
  emergencyView: EntityViewMode;
  emergencyEditId?: string;
  seasonView: EntityViewMode;
  seasonEditId?: string;
  invitationView: SimpleViewMode;
  calendarView: 'calendar' | 'createBlock';
}

export const TAB_ROUTE_MAP: Record<DashboardTab, string> = {
  overview: '/panel-general',
  bookings: '/reservas',
  accommodations: '/mis-cabanas',
  attractions: '/atractivos',
  alerts: '/alertas',
  emergencies: '/guardias-farmacias',
  calendar: '/calendario',
  pricing: '/tarifas',
  performance: '/rendimiento',
  invitations: '/invitaciones',
  reports: '/reportes',
  audit: '/auditoria',
  moderation: '/moderacion',
  settings: '/configuracion',
  events: '/agenda-cultural',
  portal_cms: '/personalizador-portal',
  profile: '/perfil',
};

export const ROUTE_ALIASES: Record<string, DashboardTab> = {
  '/guardias-farmacias': 'emergencies',
  '/emergencias': 'emergencies',
  '/farmacias': 'emergencies',
  '/agenda-cultural': 'events',
  '/eventos': 'events',
  '/personalizador-portal': 'portal_cms',
  '/cms': 'portal_cms',
  '/personalizador': 'portal_cms',
  '/mis-cabanas': 'accommodations',
  '/mis-cabañas': 'accommodations',
  '/alojamientos': 'accommodations',
  '/cabanas': 'accommodations',
  '/cabañas': 'accommodations',
  '/atractivos': 'attractions',
  '/senderos': 'attractions',
  '/paseos': 'attractions',
  '/alertas': 'alerts',
  '/seguridad': 'alerts',
  '/reservas': 'bookings',
  '/calendario': 'calendar',
  '/tarifas': 'pricing',
  '/precios': 'pricing',
  '/rendimiento': 'performance',
  '/balance': 'performance',
  '/panel-general': 'overview',
  '/resumen': 'overview',
  '/overview': 'overview',
  '/invitaciones': 'invitations',
  '/tokens': 'invitations',
  '/reportes': 'reports',
  '/auditoria': 'audit',
  '/auditoría': 'audit',
  '/moderacion': 'moderation',
  '/moderación': 'moderation',
  '/configuracion': 'settings',
  '/perfil': 'profile',
  '/mi-perfil': 'profile',
  '/profile': 'profile',
  '/configuración': 'settings',
};

export const ADMIN_ONLY_TABS: DashboardTab[] = [
  'overview',
  'portal_cms',
  'events',
  'attractions',
  'alerts',
  'invitations',
  'reports',
  'audit',
  'moderation',
  'settings',
];

export const HOST_ONLY_TABS: DashboardTab[] = [
  'calendar',
  'pricing',
  'performance',
];

export const sanitizeTabForRole = (tab: DashboardTab, role: UserRole): DashboardTab => {
  if (role === 'HOST' && ADMIN_ONLY_TABS.includes(tab)) {
    return 'bookings';
  }
  if (role === 'ADMIN' && HOST_ONLY_TABS.includes(tab)) {
    return 'overview';
  }
  return tab;
};
