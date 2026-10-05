export const DASHBOARD_URL: string =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DASHBOARD_URL) ||
  'http://localhost:5174';
