export const PORTAL_URL: string =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_PORTAL_URL) ||
  'http://localhost:5173';
