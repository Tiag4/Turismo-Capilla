import { apiClient } from './api.client.ts';
import type { Attraction, CreateAttractionDto, AttractionStatus } from '../types/attraction.types.ts';

const MOCK_ATTRACTIONS: Attraction[] = [
  {
    id: 'att-1',
    name: 'Cerro Uritorco',
    description: 'El pico más emblemático del Valle de Punilla con 1.979 msnm. Sendero de alta exigencia física.',
    category: 'HILL',
    difficulty: 'ALTA',
    estimatedDuration: '7 horas ida y vuelta',
    howToGet: 'A 3 km del centro por calle Sabattini hasta el Parador La Toma.',
    requiresGuide: false,
    admissionFee: 15000,
    latitude: -30.8522,
    longitude: -64.4789,
    status: 'OPEN',
    statusNotice: null,
    isFeatured: true,
    images: [
      {
        id: 'img-uritorco-1',
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
        publicId: 'uritorco_cover',
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'att-2',
    name: 'Parque Los Terrones',
    description: 'Cañadones rojizos, laberintos geológicos esculpidos por viento y agua hace millones de años.',
    category: 'NATURE_TRAIL',
    difficulty: 'MEDIA',
    estimatedDuration: '2.5 a 3 horas',
    howToGet: 'Ruta Nacional 38 Km 92, a 14 km al norte de Capilla del Monte.',
    requiresGuide: true,
    admissionFee: 8000,
    latitude: -30.7711,
    longitude: -64.4822,
    status: 'OPEN',
    statusNotice: null,
    isFeatured: true,
    images: [
      {
        id: 'img-terrones-1',
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        publicId: 'terrones_cover',
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'att-3',
    name: 'El Zapato',
    description: 'Geoforma natural modelada por la erosión eólica con vistas panorámicas privilegiadas al lago del dique.',
    category: 'CULTURAL',
    difficulty: 'BAJA',
    estimatedDuration: '1 hora',
    howToGet: 'A 1.5 km de la Plaza San Martín, acceso pavimentado por calle Hipólito Yrigoyen.',
    requiresGuide: false,
    admissionFee: 0,
    latitude: -30.8625,
    longitude: -64.5386,
    status: 'OPEN',
    statusNotice: null,
    isFeatured: true,
    images: [
      {
        id: 'img-zapato-1',
        url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
        publicId: 'zapato_cover',
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'att-4',
    name: 'Dique El Cajón',
    description: 'Espejo de agua ideal para pesca deportiva sin motor, avistaje de aves y paseos en kayak.',
    category: 'RIVER_BEACH',
    difficulty: 'BAJA',
    estimatedDuration: 'Paseo libre',
    howToGet: 'A 3.5 km del centro, siguiendo por Av. El Cajón.',
    requiresGuide: false,
    admissionFee: 0,
    latitude: -30.8719,
    longitude: -64.5492,
    status: 'OPEN',
    statusNotice: null,
    isFeatured: false,
    images: [
      {
        id: 'img-cajon-1',
        url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
        publicId: 'cajon_cover',
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'att-5',
    name: 'Balneario La Toma',
    description: 'Ollas naturales, cascadas de agua de vertiente y frondosa arboleda autóctona sobre el Río Calabalumba.',
    category: 'RIVER_BEACH',
    difficulty: 'BAJA',
    estimatedDuration: 'Medio día',
    howToGet: 'Al final de la calle Sabattini, en la base oeste del Cerro Uritorco.',
    requiresGuide: false,
    admissionFee: 2500,
    latitude: -30.8548,
    longitude: -64.5021,
    status: 'OPEN',
    statusNotice: null,
    isFeatured: false,
    images: [
      {
        id: 'img-latoma-1',
        url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
        publicId: 'latoma_cover',
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'att-6',
    name: 'Los Mogotes y Paso del Indio',
    description: 'Garganta natural de paredes rocosas de granito con senderos y zona de escalada deportiva.',
    category: 'NATURE_TRAIL',
    difficulty: 'MEDIA',
    estimatedDuration: '2 horas',
    howToGet: 'A 4 km al noroeste del centro sobre el Río Dolores.',
    requiresGuide: false,
    admissionFee: 3000,
    latitude: -30.8405,
    longitude: -64.5498,
    status: 'OPEN',
    statusNotice: null,
    isFeatured: false,
    images: [
      {
        id: 'img-mogotes-1',
        url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
        publicId: 'mogotes_cover',
      },
    ],
    createdAt: new Date().toISOString(),
  },
];

let localAttractions: Attraction[] = (() => {
  try {
    const saved = localStorage.getItem('turismo_capilla_admin_attractions');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Combinar con los mocks por si falta alguno
        const missing = MOCK_ATTRACTIONS.filter(
          (m) => !parsed.some((p: Attraction) => p.id === m.id || p.name === m.name)
        );
        return [...parsed, ...missing];
      }
    }
  } catch {
    // Ignore error
  }
  return [...MOCK_ATTRACTIONS];
})();

function saveToLocalStorage() {
  try {
    localStorage.setItem('turismo_capilla_admin_attractions', JSON.stringify(localAttractions));
  } catch {
    // Ignore storage issues
  }
}

export const attractionsService = {
  async getAll(): Promise<Attraction[]> {
    try {
      const remote = await apiClient.get<Attraction[]>('/attractions');
      if (Array.isArray(remote) && remote.length > 0) {
        // Mapear elementos remotos preservando metadatos locales si no vinieron
        const remoteWithStatus: Attraction[] = remote.map((item) => {
          const localMatch = localAttractions.find((l) => l.id === item.id || l.name === item.name);
          return {
            ...item,
            status: item.status || localMatch?.status || 'OPEN',
            statusNotice: item.statusNotice !== undefined ? item.statusNotice : (localMatch?.statusNotice || null),
            isFeatured: item.isFeatured !== undefined ? item.isFeatured : (localMatch?.isFeatured ?? false),
          };
        });

        // Asegurar que los atractivos locales (mocks o creados localmente) que no estén en remote se conserven
        const remainingLocal = localAttractions.filter(
          (loc) => !remoteWithStatus.some((rem) => rem.name.toLowerCase() === loc.name.toLowerCase() || rem.id === loc.id)
        );

        localAttractions = [...remoteWithStatus, ...remainingLocal];
        saveToLocalStorage();
        return localAttractions;
      }
    } catch (err) {
      console.warn('Backend /attractions no accesible, usando fallback local:', err);
    }
    return [...localAttractions];
  },

  async getById(id: string): Promise<Attraction> {
    try {
      const remote = await apiClient.get<Attraction>(`/attractions/${id}`);
      if (remote) {
        const localMatch = localAttractions.find((l) => l.id === id);
        return {
          ...remote,
          status: remote.status || localMatch?.status || 'OPEN',
          statusNotice: remote.statusNotice || localMatch?.statusNotice || null,
          isFeatured: remote.isFeatured ?? localMatch?.isFeatured ?? false,
        };
      }
    } catch {
      // Fallback
    }

    const found = localAttractions.find((a) => a.id === id);
    if (!found) throw new Error('Atractivo no encontrado');
    return found;
  },

  async create(dto: CreateAttractionDto): Promise<Attraction> {
    const formattedImages = (dto.images || []).map((img, i) => {
      if (typeof img === 'string') {
        return {
          id: `img-${Date.now()}-${i}`,
          url: img,
          publicId: `att_img_${Date.now()}_${i}`,
        };
      }
      return {
        id: `img-${Date.now()}-${i}`,
        url: img.url,
        publicId: img.publicId || `att_img_${Date.now()}_${i}`,
      };
    });

    const payload = {
      name: dto.name,
      description: dto.description || '',
      category: dto.category,
      difficulty: dto.difficulty || 'BAJA',
      estimatedDuration: dto.estimatedDuration || '',
      howToGet: dto.howToGet || '',
      requiresGuide: Boolean(dto.requiresGuide),
      admissionFee: dto.admissionFee !== undefined && dto.admissionFee !== null ? Number(dto.admissionFee) : null,
      latitude: dto.latitude !== undefined && dto.latitude !== null ? Number(dto.latitude) : null,
      longitude: dto.longitude !== undefined && dto.longitude !== null ? Number(dto.longitude) : null,
      images: formattedImages.map((img) => ({ url: img.url, publicId: img.publicId })),
    };

    try {
      const created = await apiClient.post<Attraction>('/attractions', payload);
      if (created) {
        const fullItem: Attraction = {
          ...created,
          status: dto.status || 'OPEN',
          statusNotice: dto.statusNotice || null,
          isFeatured: Boolean(dto.isFeatured),
        };
        localAttractions = [fullItem, ...localAttractions];
        saveToLocalStorage();
        return fullItem;
      }
    } catch (err) {
      console.warn('Error al crear atractivo en backend, guardando en local:', err);
    }

    const localItem: Attraction = {
      id: `att-${Date.now()}`,
      name: dto.name,
      description: dto.description,
      category: dto.category,
      difficulty: dto.difficulty || 'BAJA',
      estimatedDuration: dto.estimatedDuration,
      howToGet: dto.howToGet,
      requiresGuide: Boolean(dto.requiresGuide),
      admissionFee: dto.admissionFee !== undefined && dto.admissionFee !== null ? Number(dto.admissionFee) : null,
      latitude: dto.latitude !== undefined && dto.latitude !== null ? Number(dto.latitude) : null,
      longitude: dto.longitude !== undefined && dto.longitude !== null ? Number(dto.longitude) : null,
      images: formattedImages,
      status: dto.status || 'OPEN',
      statusNotice: dto.statusNotice || null,
      isFeatured: Boolean(dto.isFeatured),
      createdAt: new Date().toISOString(),
    };

    localAttractions = [localItem, ...localAttractions];
    saveToLocalStorage();
    return localItem;
  },

  async update(id: string, dto: Partial<CreateAttractionDto>): Promise<Attraction> {
    const formattedImages = dto.images?.map((img, i) => {
      if (typeof img === 'string') {
        return {
          id: `img-${Date.now()}-${i}`,
          url: img,
          publicId: `att_img_${Date.now()}_${i}`,
        };
      }
      return {
        id: `img-${Date.now()}-${i}`,
        url: img.url,
        publicId: img.publicId || `att_img_${Date.now()}_${i}`,
      };
    });

    const payload: Record<string, unknown> = { ...dto };
    if (formattedImages) {
      payload.images = formattedImages.map((img) => ({ url: img.url, publicId: img.publicId }));
    }
    if (dto.admissionFee !== undefined) {
      payload.admissionFee = dto.admissionFee !== null ? Number(dto.admissionFee) : null;
    }
    if (dto.latitude !== undefined) {
      payload.latitude = dto.latitude !== null ? Number(dto.latitude) : null;
    }
    if (dto.longitude !== undefined) {
      payload.longitude = dto.longitude !== null ? Number(dto.longitude) : null;
    }

    try {
      const updated = await apiClient.put<Attraction>(`/attractions/${id}`, payload);
      if (updated) {
        const fullItem: Attraction = {
          ...updated,
          status: dto.status !== undefined ? dto.status : updated.status || 'OPEN',
          statusNotice: dto.statusNotice !== undefined ? dto.statusNotice : updated.statusNotice,
          isFeatured: dto.isFeatured !== undefined ? dto.isFeatured : updated.isFeatured ?? false,
        };
        const index = localAttractions.findIndex((a) => a.id === id);
        if (index !== -1) {
          localAttractions[index] = fullItem;
        } else {
          localAttractions.push(fullItem);
        }
        saveToLocalStorage();
        return fullItem;
      }
    } catch (err) {
      console.warn('Error al actualizar atractivo en backend, actualizando local:', err);
    }

    const index = localAttractions.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Atractivo no encontrado');

    const existing = localAttractions[index];
    const updated: Attraction = {
      ...existing,
      ...dto,
      images: formattedImages || existing.images,
      status: dto.status !== undefined ? dto.status : existing.status,
      statusNotice: dto.statusNotice !== undefined ? dto.statusNotice : existing.statusNotice,
      isFeatured: dto.isFeatured !== undefined ? dto.isFeatured : existing.isFeatured,
      updatedAt: new Date().toISOString(),
    };

    localAttractions[index] = updated;
    saveToLocalStorage();
    return updated;
  },

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/attractions/${id}`);
    } catch (err) {
      console.warn('Error al eliminar atractivo en backend, eliminando local:', err);
    }
    localAttractions = localAttractions.filter((a) => a.id !== id);
    saveToLocalStorage();
  },

  async updateStatus(id: string, status: AttractionStatus, statusNotice?: string | null): Promise<Attraction> {
    return this.update(id, { status, statusNotice });
  },

  async toggleFeatured(id: string): Promise<Attraction> {
    const existing = localAttractions.find((a) => a.id === id);
    if (!existing) throw new Error('Atractivo no encontrado');
    return this.update(id, { isFeatured: !existing.isFeatured });
  },
};
