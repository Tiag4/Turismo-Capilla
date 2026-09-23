import { useState, useEffect, useCallback } from 'react';
import type { DashboardTab } from '../components/layout/DashboardNav.tsx';
import type { UserRole } from '../types/auth.types.ts';

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

export const getTabFromPath = (pathname: string, role: UserRole): DashboardTab => {
  const normalized = decodeURIComponent(pathname.toLowerCase()).replace(/\/+$/, '');

  if (ROUTE_ALIASES[normalized]) {
    return ROUTE_ALIASES[normalized];
  }

  // Fallback default per role
  return role === 'ADMIN' ? 'overview' : 'accommodations';
};

export const useDashboardRouter = (role: UserRole) => {
  const [currentTab, setCurrentTabState] = useState<DashboardTab>(() => {
    return getTabFromPath(window.location.pathname, role);
  });

  const navigateToTab = useCallback((tab: DashboardTab, replace = false) => {
    setCurrentTabState(tab);
    const targetRoute = TAB_ROUTE_MAP[tab] || '/reservas';
    if (window.location.pathname !== targetRoute) {
      if (replace) {
        window.history.replaceState({ tab }, '', targetRoute);
      } else {
        window.history.pushState({ tab }, '', targetRoute);
      }
    }
  }, []);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const tab = getTabFromPath(window.location.pathname, role);
      setCurrentTabState(tab);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [role]);

  // Sync initial URL on mount if at root or non-matching path
  useEffect(() => {
    const currentPath = window.location.pathname.replace(/\/+$/, '');
    if (!currentPath || currentPath === '' || currentPath === '/') {
      const defaultRoute = TAB_ROUTE_MAP[currentTab];
      window.history.replaceState({ tab: currentTab }, '', defaultRoute);
    }
  }, [currentTab]);

  return {
    currentTab,
    setCurrentTab: navigateToTab,
  };
};
