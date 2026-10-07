import { useState, useEffect, useCallback } from 'react';
import type { DashboardTab } from '../components/layout/DashboardNav.tsx';
import type { UserRole } from '../types/auth.types.ts';

export type AccommodationViewMode = 'list' | 'create' | 'edit';

export interface RouteDetail {
  tab: DashboardTab;
  accommodationView: AccommodationViewMode;
  accommodationEditId?: string;
}

export const TAB_ROUTE_MAP: Record<DashboardTab, string> = {
  overview: '/panel-general',
  bookings: '/reservas',
  accommodations: '/mis-cabanas',
  calendar: '/calendario',
  pricing: '/tarifas',
  performance: '/rendimiento',
  invitations: '/invitaciones',
  reports: '/reportes',
  audit: '/auditoria',
  moderation: '/moderacion',
  settings: '/configuracion',
};

// Friendly aliases and accented URL matching
const ROUTE_ALIASES: Record<string, DashboardTab> = {
  '/mis-cabanas': 'accommodations',
  '/mis-cabañas': 'accommodations',
  '/alojamientos': 'accommodations',
  '/cabanas': 'accommodations',
  '/cabañas': 'accommodations',
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
  '/configuración': 'settings',
};

export const parseRouteFromPath = (pathname: string, role: UserRole): RouteDetail => {
  const normalized = decodeURIComponent(pathname.toLowerCase()).replace(/\/+$/, '');

  // Sub-route: /mis-cabanas/nuevo or /alojamientos/nuevo
  if (normalized === '/mis-cabanas/nuevo' || normalized === '/alojamientos/nuevo') {
    return {
      tab: 'accommodations',
      accommodationView: 'create',
    };
  }

  // Sub-route: /mis-cabanas/:id/editar or /alojamientos/:id/editar
  const editMatch = normalized.match(/^\/(?:mis-cabanas|mis-cabañas|alojamientos)\/([^/]+)\/editar$/i);
  if (editMatch && editMatch[1]) {
    return {
      tab: 'accommodations',
      accommodationView: 'edit',
      accommodationEditId: editMatch[1],
    };
  }

  // Standard tab matching
  if (ROUTE_ALIASES[normalized]) {
    return {
      tab: ROUTE_ALIASES[normalized],
      accommodationView: 'list',
    };
  }

  // Fallback default per role
  return {
    tab: role === 'ADMIN' ? 'overview' : 'accommodations',
    accommodationView: 'list',
  };
};

export const getTabFromPath = (pathname: string, role: UserRole): DashboardTab => {
  return parseRouteFromPath(pathname, role).tab;
};

export const useDashboardRouter = (role: UserRole) => {
  const [routeState, setRouteState] = useState<RouteDetail>(() => {
    return parseRouteFromPath(window.location.pathname, role);
  });

  const navigateToTab = useCallback((tab: DashboardTab, replace = false) => {
    setRouteState({
      tab,
      accommodationView: 'list',
    });
    const targetRoute = TAB_ROUTE_MAP[tab] || '/reservas';
    if (window.location.pathname !== targetRoute) {
      if (replace) {
        window.history.replaceState({ tab, view: 'list' }, '', targetRoute);
      } else {
        window.history.pushState({ tab, view: 'list' }, '', targetRoute);
      }
    }
  }, []);

  const navigateToAccommodationCreate = useCallback(() => {
    setRouteState({
      tab: 'accommodations',
      accommodationView: 'create',
    });
    const targetRoute = '/mis-cabanas/nuevo';
    if (window.location.pathname !== targetRoute) {
      window.history.pushState({ tab: 'accommodations', view: 'create' }, '', targetRoute);
    }
  }, []);

  const navigateToAccommodationEdit = useCallback((id: string) => {
    setRouteState({
      tab: 'accommodations',
      accommodationView: 'edit',
      accommodationEditId: id,
    });
    const targetRoute = `/mis-cabanas/${id}/editar`;
    if (window.location.pathname !== targetRoute) {
      window.history.pushState({ tab: 'accommodations', view: 'edit', id }, '', targetRoute);
    }
  }, []);

  const navigateToAccommodationList = useCallback(() => {
    setRouteState({
      tab: 'accommodations',
      accommodationView: 'list',
    });
    const targetRoute = '/mis-cabanas';
    if (window.location.pathname !== targetRoute) {
      window.history.pushState({ tab: 'accommodations', view: 'list' }, '', targetRoute);
    }
  }, []);

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
      window.history.replaceState({ tab: routeState.tab, view: routeState.accommodationView }, '', defaultRoute);
    }
  }, [routeState.tab, routeState.accommodationView]);

  return {
    currentTab: routeState.tab,
    setCurrentTab: navigateToTab,
    accommodationView: routeState.accommodationView,
    accommodationEditId: routeState.accommodationEditId,
    navigateToAccommodationCreate,
    navigateToAccommodationEdit,
    navigateToAccommodationList,
  };
};
