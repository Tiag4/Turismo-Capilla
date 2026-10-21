import { apiClient } from './api.client';
import type { CulturalEvent, CreateCulturalEventDTO } from '../types/culturalEvent.types';

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
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=1200&q=80',
    isActive: true,
    isFeatured: false,
  },
];

const STORAGE_KEY = 'turismo_capilla_cultural_events';

function getStoredEvents(): CulturalEvent[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Fallback
  }
  return INITIAL_EVENTS;
}

function persistLocally(events: CulturalEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (err) {
    console.error('Error saving cultural events to localStorage:', err);
  }
}

export const culturalEventsService = {
  getEvents: (): CulturalEvent[] => {
    return getStoredEvents();
  },

  getActiveEvents: (): CulturalEvent[] => {
    return culturalEventsService.getEvents().filter((e) => e.isActive);
  },

  fetchEvents: async (): Promise<CulturalEvent[]> => {
    try {
      const remote = await apiClient.get<CulturalEvent[]>('/events');
      if (Array.isArray(remote) && remote.length > 0) {
        persistLocally(remote);
        return remote;
      }
    } catch (err) {
      console.warn('API local de eventos no disponible, utilizando almacenamiento local/fallback:', err);
    }
    return getStoredEvents();
  },

  saveEvents: (events: CulturalEvent[]): void => {
    persistLocally(events);
  },

  createEvent: async (dto: CreateCulturalEventDTO): Promise<CulturalEvent> => {
    try {
      const created = await apiClient.post<CulturalEvent>('/events', dto);
      if (created && created.id) {
        const events = getStoredEvents();
        const updated = [created, ...events.filter((e) => e.id !== created.id)];
        persistLocally(updated);
        return created;
      }
    } catch (err) {
      console.warn('Error al persistir evento en API remota, guardando localmente:', err);
    }

    const localNewEvent: CulturalEvent = {
      ...dto,
      id: `evt-${Date.now()}`,
    };
    const events = getStoredEvents();
    events.unshift(localNewEvent);
    persistLocally(events);
    return localNewEvent;
  },

  updateEvent: async (id: string, dto: Partial<CreateCulturalEventDTO>): Promise<CulturalEvent> => {
    try {
      const updated = await apiClient.put<CulturalEvent>(`/events/${id}`, dto);
      if (updated && updated.id) {
        const events = getStoredEvents();
        const idx = events.findIndex((e) => e.id === id);
        if (idx !== -1) {
          events[idx] = updated;
        } else {
          events.unshift(updated);
        }
        persistLocally(events);
        return updated;
      }
    } catch (err) {
      console.warn('Error al actualizar evento en API remota, aplicando actualización local:', err);
    }

    const events = getStoredEvents();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new Error(`Event with id ${id} not found`);
    }
    const updated = { ...events[index], ...dto };
    events[index] = updated;
    persistLocally(events);
    return updated;
  },

  deleteEvent: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/events/${id}`);
    } catch (err) {
      console.warn('Error al eliminar evento en API remota, purgando localmente:', err);
    }
    const events = getStoredEvents().filter((e) => e.id !== id);
    persistLocally(events);
  },

  toggleEventActive: async (id: string): Promise<CulturalEvent> => {
    const events = getStoredEvents();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new Error(`Event with id ${id} not found`);
    }
    const nextState = !events[index].isActive;
    return culturalEventsService.updateEvent(id, { isActive: nextState });
  },
};
