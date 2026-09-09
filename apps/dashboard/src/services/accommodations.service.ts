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
      const response = await apiClient.get<any>('/accommodations');
      const items = Array.isArray(response) ? response : response.data || [];
      if (items.length > 0) return items;
      return localAccommodations;
    } catch {
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
    try {
      return await apiClient.post<Accommodation>('/accommodations', dto);
    } catch {
      const parsedImages = (dto.images || []).map((img, index) => {
        if (typeof img === 'string') {
          return {
            id: `img-${Date.now()}-${index}`,
            url: img,
            isMain: index === 0,
          };
        }
        return img;
      });

      // Garantizar que al menos una tenga isMain
      if (parsedImages.length > 0 && !parsedImages.some((i) => i.isMain)) {
        parsedImages[0].isMain = true;
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
        images: parsedImages,
        createdAt: new Date().toISOString(),
      };
      localAccommodations = [newAcc, ...localAccommodations];
      return newAcc;
    }
  },

  async update(id: string, dto: Partial<CreateAccommodationDto>): Promise<Accommodation> {
    try {
      return await apiClient.put<Accommodation>(`/accommodations/${id}`, dto);
    } catch {
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
    }
  },

  async toggleActive(id: string): Promise<Accommodation> {
    const acc = localAccommodations.find((a) => a.id === id);
    if (!acc) throw new Error('Alojamiento no encontrado');
    acc.isActive = !acc.isActive;
    return { ...acc };
  },
};
