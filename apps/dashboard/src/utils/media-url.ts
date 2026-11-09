import { API_BASE_URL } from '../services/api.client.ts';

/**
 * El backend puede devolver rutas de almacenamiento local relativas
 * (por ejemplo "/uploads/capilla-turismo/...") cuando no configura un CDN.
 * Esas rutas deben resolverse contra el origen de la API, no contra el del
 * frontend, o la imagen se pide al servidor equivocado.
 */
export function resolveMediaUrl(url?: string | null): string {
  if (!url) return '';

  if (/^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(url)) return url;
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;

  try {
    const origin = new URL(API_BASE_URL, window.location.origin).origin;
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${origin}${path}`;
  } catch {
    return url;
  }
}
