import { apiClient } from './api.client.ts';
import type { Accommodation, CreateAccommodationDto } from '../types/accommodation.types.ts';

const MOCK_ACCOMMODATIONS: Accommodation[] = [
  {
    id: 'acc-1',
    name: 'Cabañas Pircas del Uritorco',
    description: 'Cabaña serrana de piedra y tronco al pie del cerro con vistas panorámicas únicas y piscina climatizada.',
    type: 'CABIN',
    address: 'Camino a Los Terrones Km 3.5',
    locality: 'Capilla del Monte',
    latitude: -30.8654,
    longitude: -64.5241,
    pricePerNight: 85000,
    maxGuests: 5,
    amenities: ['Piscina', 'Wi-Fi Starlink', 'Cochera techada', 'Parrilla individual', 'Aire acondicionado'],
    isActive: true,
    hostId: 'host-01',
    images: [
      { id: 'img-1-1', url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80', isMain: true },
      { id: 'img-1-2', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', isMain: false },
      { id: 'img-1-3', url: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80', isMain: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'acc-2',
    name: 'Casona Histórica San Esteban',
    description: 'Hostería colonial restaurada en el casco histórico, a 4 cuadras de la Calle Techada.',
    type: 'HOTEL',
    address: 'Av. Pueyrredón 340',
    locality: 'Capilla del Monte',
    latitude: -30.8592,
    longitude: -64.5283,
    pricePerNight: 120000,
    maxGuests: 4,
    amenities: ['Desayuno serrano', 'Wi-Fi', 'Calefacción central', 'Jardín con frutales', 'Guía de senderismo'],
    isActive: true,
    hostId: 'host-01',
    images: [
      { id: 'img-2-1', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', isMain: true },
      { id: 'img-2-2', url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80', isMain: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'acc-3',
    name: 'Refugio Los Alazanes',
    description: 'Monoambiente de montaña con deck privado con vista al atardecer sobre el Dique El Cajón.',
    type: 'APARTMENT',
    address: 'Barrio La Banda, Calle Los Quebrachos 12',
    locality: 'Capilla del Monte',
    latitude: -30.8711,
    longitude: -64.5389,
    pricePerNight: 65000,
    maxGuests: 2,
    amenities: ['Wi-Fi', 'Deck privado', 'Parrilla', 'Cocina equipada', 'Pet friendly'],
    isActive: true,
    hostId: 'host-01',
    images: [
      { id: 'img-3-1', url: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80', isMain: true },
      { id: 'img-3-2', url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80', isMain: false },
    ],
    createdAt: new Date().toISOString(),
  },
];

let localAccommodations = [...MOCK_ACCOMMODATIONS];

export const accommodationsService = {
  async getAll(): Promise<Accommodation[]> {
    try {
      const userRaw = localStorage.getItem('turismo_capilla_user');
      const user = userRaw ? JSON.parse(userRaw) : null;
      const token = localStorage.getItem('turismo_capilla_token');
      // ADMIN consulta todo el catálogo municipal; HOST consulta sus propios establecimientos
      const isHost = user?.role === 'HOST';
      const endpoint = (token && isHost) ? '/accommodations/my-accommodations' : '/accommodations';
      const response = await apiClient.get<any>(endpoint);
      const items = Array.isArray(response) ? response : response.data || [];
      if (Array.isArray(items)) {
        return items;
      }
      return localAccommodations;
    } catch {
      try {
        const publicResp = await apiClient.get<any>('/accommodations');
        const publicItems = Array.isArray(publicResp) ? publicResp : publicResp.data || [];
        if (Array.isArray(publicItems)) return publicItems;
      } catch {
        // Ignorar y caer a fallback local
      }
      return localAccommodations;
    }
  },

  async getById(id: string): Promise<Accommodation | null> {
    try {
      return await apiClient.get<Accommodation>(`/accommodations/${id}`);
    } catch {
      return localAccommodations.find((a) => a.id === id) || null;
    }
  },

  async create(dto: CreateAccommodationDto): Promise<Accommodation> {
    const formattedImages = (dto.images || []).map((img, index) => {
      if (typeof img === 'string') {
        return {
          url: img,
          isMain: index === 0,
        };
      }
      return {
        url: img.url,
        isMain: Boolean(img.isMain) || index === 0,
      };
    });

    if (formattedImages.length > 0 && !formattedImages.some((i) => i.isMain)) {
      formattedImages[0].isMain = true;
    }

    const payload = {
      name: dto.name,
      description: dto.description || '',
      type: dto.type,
      address: dto.address,
      locality: dto.locality || 'Capilla del Monte',
      latitude: dto.latitude ?? -30.857,
      longitude: dto.longitude ?? -64.515,
      pricePerNight: Number(dto.pricePerNight),
      maxGuests: Number(dto.maxGuests),
      amenities: dto.amenities || [],
      images: formattedImages,
    };

    try {
      const created = await apiClient.post<Accommodation>('/accommodations', payload);
      if (created) return created;
    } catch (err) {
      console.warn('Fallo guardado en backend, usando fallback local:', err);
    }

    const newAcc: Accommodation = {
      id: `acc-${Date.now()}`,
      name: dto.name,
      description: dto.description,
      type: dto.type,
      address: dto.address,
      locality: dto.locality || 'Capilla del Monte',
      latitude: dto.latitude,
      longitude: dto.longitude,
      pricePerNight: Number(dto.pricePerNight),
      maxGuests: Number(dto.maxGuests),
      amenities: dto.amenities,
      isActive: true,
      hostId: 'host-01',
      images: formattedImages.map((img, i) => ({ id: `img-${Date.now()}-${i}`, ...img })),
      createdAt: new Date().toISOString(),
    };
    localAccommodations = [newAcc, ...localAccommodations];
    return newAcc;
  },

  async update(id: string, dto: Partial<CreateAccommodationDto>): Promise<Accommodation> {
    const payload: any = { ...dto };
    if (dto.images) {
      payload.images = dto.images.map((img, index) => {
        if (typeof img === 'string') {
          return { url: img, isMain: index === 0 };
        }
        return { url: img.url, isMain: Boolean(img.isMain) };
      });
    }
    if (dto.pricePerNight !== undefined) {
      payload.pricePerNight = Number(dto.pricePerNight);
    }
    if (dto.maxGuests !== undefined) {
      payload.maxGuests = Number(dto.maxGuests);
    }

    try {
      const updated = await apiClient.put<Accommodation>(`/accommodations/${id}`, payload);
      if (updated) return updated;
    } catch (err) {
      console.warn('Fallo actualizacion en backend, usando fallback local:', err);
    }

    const index = localAccommodations.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Alojamiento no encontrado');
    const existing = localAccommodations[index];

    let updatedImages = existing.images;
    if (dto.images) {
      updatedImages = dto.images.map((img, index) => {
        if (typeof img === 'string') {
          return {
            id: `img-${Date.now()}-${index}`,
            url: img,
            isMain: index === 0,
          };
        }
        return img;
      });

      if (updatedImages.length > 0 && !updatedImages.some((i) => i.isMain)) {
        updatedImages[0].isMain = true;
      }
    }

    const updated: Accommodation = {
      ...existing,
      ...dto,
      images: updatedImages,
      pricePerNight: dto.pricePerNight ? Number(dto.pricePerNight) : existing.pricePerNight,
      maxGuests: dto.maxGuests ? Number(dto.maxGuests) : existing.maxGuests,
      updatedAt: new Date().toISOString(),
    };
    localAccommodations[index] = updated;
    return updated;
  },

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/accommodations/${id}`);
    } catch (err) {
      console.warn('Fallo eliminacion en backend, usando fallback local:', err);
    }
    localAccommodations = localAccommodations.filter((a) => a.id !== id);
  },

  async toggleActive(id: string): Promise<Accommodation> {
    const acc = localAccommodations.find((a) => a.id === id);
    if (!acc) throw new Error('Alojamiento no encontrado');
    acc.isActive = !acc.isActive;
    try {
      await apiClient.put(`/accommodations/${id}`, { isActive: acc.isActive });
    } catch {
      // Ignorar
    }
    return { ...acc };
  },
};
