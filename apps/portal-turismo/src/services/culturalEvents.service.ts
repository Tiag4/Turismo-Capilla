import type { CulturalEvent } from '../types/culturalEvent.types';

const INITIAL_EVENTS: CulturalEvent[] = [
  {
    id: 'evt-001',
    title: '12° Festival Alienígena de Capilla del Monte',
    description: 'El clásico y esperado festival temático que congrega desfiles de disfraces, charlas científicas y ufológicas, música en vivo y gastronomía temática en el corazón de la villa.',
    category: 'FESTIVAL',
    startDate: '2026-11-14',
    endDate: '2026-11-16',
    timeString: '18:00 hs',
    location: 'Predio Gabriel Suárez & Calle Techada',
    isFree: true,
    imageUrl: '/images/attractions/calle-techada/calle-techada-01.jpg',
    isActive: true,
    isFeatured: true,
  },
  {
    id: 'evt-002',
    title: 'Noche de Astroturismo y Mitología Serrana',
    description: 'Observación con telescopios de cielo profundo, guiada astronómica láser para reconocer constelaciones australes y relatos míticos de los Comechingones al pie del Uritorco.',
    category: 'WORKSHOP',
    startDate: '2026-11-07',
    timeString: '20:30 hs',
    location: 'Base del Cerro Uritorco',
    isFree: false,
    price: 8500,
    imageUrl: '/images/attractions/astroturismo/astroturismo-01.jpg',
    isActive: true,
    isFeatured: true,
  },
  {
    id: 'evt-003',
    title: 'Gran Peña Folclórica y Sabores de las Sierras',
    description: 'Música popular en vivo con destacados artistas locales, danzas tradicionales, locro criollo, empanadas y feria de vinos cordobeses.',
    category: 'MUSIC',
    startDate: '2026-11-21',
    timeString: '21:00 hs',
    location: 'Balneario Municipal Calabalumba',
    isFree: false,
    price: 5000,
    imageUrl: '/images/attractions/balneario-municipal/balneario-municipal-01.jpg',
    isActive: true,
    isFeatured: true,
  },
  {
    id: 'evt-004',
    title: 'Feria de Productores Conscientes y Artesanos',
    description: 'Exposición y venta de cosmética natural, hierbas medicinales serranas, cerámicas autóctonas, miel de monte y productos orgánicos de la cuenca del Río Dolores.',
    category: 'FAIR',
    startDate: '2026-11-08',
    endDate: '2026-11-09',
    timeString: '10:00 a 19:00 hs',
    location: 'Plaza San Martín',
    isFree: true,
    imageUrl: '/images/attractions/calle-techada/calle-techada-02.jpg',
    isActive: true,
    isFeatured: false,
  },
  {
    id: 'evt-005',
    title: 'Obra Teatral: "Voces del Uritorco"',
    description: 'Puesta en escena dramática con tintes de comedia sobre los primeros pioneros de la villa serrana y las leyendas de la Ciudad Intraterrena de Erks.',
    category: 'THEATER',
    startDate: '2026-11-28',
    timeString: '21:30 hs',
    location: 'Cine Teatro Enrique Muiño',
    isFree: false,
    price: 6000,
    imageUrl: '/images/attractions/uritorco/uritorco-03.jpg',
    isActive: true,
    isFeatured: false,
  },
];

const STORAGE_KEY = 'turismo_capilla_cultural_events';

const API_BASE_URL =
  (typeof import.meta !== 'undefined' &&
    (import.meta.env?.VITE_API_URL || import.meta.env?.PUBLIC_API_URL)) ||
  (import.meta.env?.DEV
    ? 'http://localhost:8080/api/v1'
    : 'https://turismo-capilla-backend.onrender.com/api/v1');

function getStoredEvents(): CulturalEvent[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Fallback on error
  }
  return INITIAL_EVENTS;
}

export const culturalEventsService = {
  getEvents: (): CulturalEvent[] => {
    return getStoredEvents();
  },

  getActiveEvents: (): CulturalEvent[] => {
    return culturalEventsService.getEvents().filter((event) => event.isActive);
  },

  getFeaturedEvents: (): CulturalEvent[] => {
    return culturalEventsService.getActiveEvents().filter((event) => event.isFeatured);
  },

  fetchActiveEvents: async (): Promise<CulturalEvent[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/events?activeOnly=true`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          } catch {
            // Ignore storage quota error
          }
          return data;
        }
      }
    } catch {
      // Fallback
    }
    return culturalEventsService.getActiveEvents();
  },
};
