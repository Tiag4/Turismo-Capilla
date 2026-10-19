import { apiClient } from './api.client.ts';
import { accommodationsService } from './accommodations.service.ts';
import type { ProviderUser } from '../types/provider.types.ts';
import type { Accommodation } from '../types/accommodation.types.ts';

const MOCK_PROVIDERS: ProviderUser[] = [
  {
    id: 'host-01',
    name: 'Roberto',
    lastName: 'Gómez',
    email: 'host@capilladelmonte.gov.ar',
    phone: '+54 9 3548 456789',
    role: 'HOST',
    isActive: true,
    accommodationsCount: 2,
    createdAt: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 'host-02',
    name: 'Marcela',
    lastName: 'Rossi',
    email: 'marcela.rossi@capillaturismo.com.ar',
    phone: '+54 9 3548 512345',
    role: 'HOST',
    isActive: true,
    accommodationsCount: 1,
    createdAt: '2026-02-10T14:30:00.000Z',
  },
  {
    id: 'host-03',
    name: 'Carlos',
    lastName: 'Benítez',
    email: 'carlos.benitez@capillaturismo.com.ar',
    phone: '+54 9 3548 678901',
    role: 'HOST',
    isActive: true,
    accommodationsCount: 1,
    createdAt: '2026-03-01T09:15:00.000Z',
  },
  {
    id: 'host-04',
    name: 'Silvina',
    lastName: 'Morán',
    email: 'silvina.moran@capilladelmonte.com.ar',
    phone: '+54 9 3548 789012',
    role: 'HOST',
    isActive: false,
    accommodationsCount: 1,
    createdAt: '2026-03-12T16:45:00.000Z',
  },
];

let localProviders: ProviderUser[] = (() => {
  try {
    const saved = localStorage.getItem('turismo_capilla_admin_providers');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Ignore error
  }
  return [...MOCK_PROVIDERS];
})();

function saveToLocalStorage() {
  try {
    localStorage.setItem('turismo_capilla_admin_providers', JSON.stringify(localProviders));
  } catch {
    // Ignore error
  }
}

export const providersService = {
  async getAll(search?: string): Promise<ProviderUser[]> {
    try {
      const path = search ? `/users?role=HOST&search=${encodeURIComponent(search)}` : '/users?role=HOST';
      const remote = await apiClient.get<ProviderUser[]>(path);
      if (Array.isArray(remote) && remote.length > 0) {
        // Merge remote with local status
        const merged = remote.map((r) => {
          const match = localProviders.find((l) => l.id === r.id || l.email.toLowerCase() === r.email.toLowerCase());
          return {
            ...r,
            isActive: r.isActive !== undefined ? r.isActive : (match?.isActive ?? true),
            accommodationsCount: r.accommodationsCount ?? match?.accommodationsCount ?? 1,
          };
        });

        // Keep local mocks if they are not in remote yet
        const missingLocal = localProviders.filter(
          (loc) => !merged.some((m) => m.email.toLowerCase() === loc.email.toLowerCase() || m.id === loc.id)
        );

        localProviders = [...merged, ...missingLocal];
        saveToLocalStorage();
        return localProviders;
      }
    } catch (err) {
      console.warn('Backend /users?role=HOST no disponible, usando fallback local:', err);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      return localProviders.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.lastName.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          (p.phone && p.phone.includes(q))
      );
    }

    return [...localProviders];
  },

  async toggleStatus(id: string, currentStatus: boolean): Promise<ProviderUser> {
    const nextStatus = !currentStatus;

    try {
      const updated = await apiClient.patch<ProviderUser>(`/users/${id}/status?isActive=${nextStatus}`, {});
      if (updated) {
        const idx = localProviders.findIndex((p) => p.id === id);
        if (idx !== -1) {
          localProviders[idx] = { ...localProviders[idx], isActive: nextStatus };
          saveToLocalStorage();
          return localProviders[idx];
        }
      }
    } catch (err) {
      console.warn('Fallo actualización remota de estado de prestador, guardando en local:', err);
    }

    const idx = localProviders.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Prestador no encontrado');
    localProviders[idx] = { ...localProviders[idx], isActive: nextStatus };
    saveToLocalStorage();
    return localProviders[idx];
  },

  async getAccommodationsByHost(host: ProviderUser): Promise<Accommodation[]> {
    try {
      const allAcc = await accommodationsService.getAll();
      const filtered = allAcc.filter(
        (a) =>
          a.hostId === host.id ||
          (host.email && a.hostId === host.email) ||
          (a.name.toLowerCase().includes(host.lastName.toLowerCase()))
      );

      if (filtered.length > 0) return filtered;
    } catch {
      // Fallback
    }

    // Default mock accommodation for host if none matches directly
    return [
      {
        id: `acc-host-${host.id}`,
        name: host.name === 'Roberto' ? 'Cabañas Pircas del Uritorco' : `Hospedaje ${host.lastName}`,
        description: 'Establecimiento habilitado ante la Secretaría de Turismo de Capilla del Monte.',
        type: 'CABIN',
        address: 'Zona Serrana, Capilla del Monte',
        locality: 'Capilla del Monte',
        latitude: -30.8654,
        longitude: -64.5241,
        pricePerNight: 85000,
        maxGuests: 4,
        amenities: ['Wi-Fi', 'Piscina', 'Parrilla', 'Cochera'],
        isActive: host.isActive,
        hostId: host.id,
        images: [
          {
            id: 'img-1',
            url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
            isMain: true,
          },
        ],
        createdAt: host.createdAt,
      },
    ];
  },
};
