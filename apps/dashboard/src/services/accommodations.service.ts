import { apiClient } from './api.client.ts';
import { resolveMediaUrl } from '../utils/media-url.ts';
import type {
  Accommodation,
  AccommodationImage,
  CreateAccommodationDto,
} from '../types/accommodation.types.ts';

function normalizeImage(image: AccommodationImage): AccommodationImage {
  return { ...image, url: resolveMediaUrl(image.url) };
}

function normalizeAccommodation(accommodation: Accommodation): Accommodation {
  return {
    ...accommodation,
    images: (accommodation.images ?? []).map(normalizeImage),
  };
}

const MOCK_ACCOMMODATIONS: Accommodation[] = [
  {
    id: 'acc-1',
    hasBreakfast: false,
    name: 'Cabañas Pircas del Uritorco',
    description: 'Cabaña serrana de piedra y tronco al pie del Cerro Uritorco con vistas panorámicas únicas hacia el valle y las sierras.\n\nEl predio cuenta con parque autóctono arbolado, piscina cercada con solárium, cocheras individuales techadas y asador privado para disfrutar del descanso serrano.\n\nAtención personalizada por sus dueños durante toda la estadía, con recomendaciones sobre senderos, paseos y gastronomía de Capilla del Monte.',
    type: 'CABIN',
    inventoryMode: 'SINGLE_UNIT',
    address: 'Camino a Los Terrones Km 3.5',
    locality: 'Capilla del Monte',
    latitude: -30.8654,
    longitude: -64.5241,
    pricePerNight: 85000,
    maxGuests: 5,
    unitTitle: 'Chalet de Montaña 2 Dormitorios',
    surfaceSqm: 58,
    bedroomsSummary: 'Dormitorio 1: 1 cama matrimonial King | Dormitorio 2: 3 camas individuales',
    phone: '+54 9 3548 481234',
    checkInTime: '14:00 hs',
    checkOutTime: '10:00 hs',
    petPolicy: 'Mascotas medianas y pequeñas bienvenidas con aviso previo.',
    cancellationPolicy: 'Cancelación flexible hasta 7 días antes de la fecha de ingreso.',
    licenseNumber: 'H-3412',
    responseTime: 'Responde habitualmente en menos de 1 hora',
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
    hasBreakfast: true,
    breakfastType: 'Desayuno serrano casero',
    name: 'Casona Histórica San Esteban',
    description: 'Hostería colonial restaurada en el casco histórico, a 4 cuadras de la Calle Techada.',
    type: 'HOTEL',
    inventoryMode: 'MULTI_ROOM',
    roomTypes: [
      {
        id: 'rt-2-1',
        name: 'Doble Serrano Standard',
        bedsSummary: '1 Cama Queen Size (o 2 Twin)',
        pricePerNight: 120000,
        maxGuests: 2,
        totalStock: 5,
        breakfastIncluded: true,
      },
      {
        id: 'rt-2-2',
        name: 'Superior Vista al Cerro Uritorco',
        bedsSummary: '1 Cama King Size + 1 Individual',
        pricePerNight: 150000,
        maxGuests: 3,
        totalStock: 4,
        breakfastIncluded: true,
      },
      {
        id: 'rt-2-3',
        name: 'Suite Familiar 2 Ambientes',
        bedsSummary: '1 Cama King Size + 2 Camas Individuales',
        pricePerNight: 185000,
        maxGuests: 4,
        totalStock: 3,
        breakfastIncluded: true,
      },
    ],
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
    hasBreakfast: false,
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
        return items.map(normalizeAccommodation);
      }
      return localAccommodations.map(normalizeAccommodation);
    } catch {
      try {
        const publicResp = await apiClient.get<any>('/accommodations');
        const publicItems = Array.isArray(publicResp) ? publicResp : publicResp.data || [];
        if (Array.isArray(publicItems)) return publicItems.map(normalizeAccommodation);
      } catch {
        // Ignorar y caer a fallback local
      }
      return localAccommodations.map(normalizeAccommodation);
    }
  },

  async getById(id: string): Promise<Accommodation | null> {
    try {
      const accommodation = await apiClient.get<Accommodation>(`/accommodations/${id}`);
      return accommodation ? normalizeAccommodation(accommodation) : null;
    } catch {
      const local = localAccommodations.find((a) => a.id === id) || null;
      return local ? normalizeAccommodation(local) : null;
    }
  },

  async create(dto: CreateAccommodationDto): Promise<Accommodation> {
    // Images are uploaded to real storage beforehand (media service), so only
    // http(s) URLs reach the backend. Data URLs are never persisted.
    const formattedImages = (dto.images || [])
      .filter((img) => {
        const url = typeof img === 'string' ? img : img.url;
        return !url.startsWith('data:') && !url.startsWith('blob:');
      })
      .map((img, index) => {
        if (typeof img === 'string') {
          return {
            url: img,
            isMain: index === 0,
          };
        }
        return {
          url: img.url,
          publicId: img.publicId,
          isMain: index === 0,
        };
      });

    const payload = {
      name: dto.name,
      description: dto.description || '',
      type: dto.type,
      inventoryMode: dto.inventoryMode,
      roomTypes: dto.roomTypes,
      address: dto.address,
      locality: dto.locality || 'Capilla del Monte',
      latitude: dto.latitude ?? -30.857,
      longitude: dto.longitude ?? -64.515,
      pricePerNight: Number(dto.pricePerNight),
      maxGuests: Number(dto.maxGuests),
      unitTitle: dto.unitTitle,
      surfaceSqm: dto.surfaceSqm,
      bedroomsSummary: dto.bedroomsSummary,
      phone: dto.phone,
      checkInTime: dto.checkInTime,
      checkOutTime: dto.checkOutTime,
      petPolicy: dto.petPolicy,
      cancellationPolicy: dto.cancellationPolicy,
      licenseNumber: dto.licenseNumber,
      responseTime: dto.responseTime,
      hasBreakfast: Boolean(dto.hasBreakfast),
      breakfastType: dto.hasBreakfast ? dto.breakfastType : undefined,
      amenities: dto.amenities || [],
      downPaymentPercentage: dto.downPaymentPercentage ?? 50,
      bankAccountHolder: dto.bankAccountHolder,
      bankCbu: dto.bankCbu,
      bankAlias: dto.bankAlias,
      bankName: dto.bankName,
      images: formattedImages,
    };

    try {
      const created = await apiClient.post<Accommodation>('/accommodations', payload);
      if (created) return normalizeAccommodation(created);
    } catch (err) {
      console.warn('Fallo guardado en backend, usando fallback local:', err);
    }

    const newAcc: Accommodation = {
      id: `acc-${Date.now()}`,
      name: dto.name,
      description: dto.description,
      type: dto.type,
      inventoryMode: dto.inventoryMode,
      roomTypes: dto.roomTypes,
      address: dto.address,
      locality: dto.locality || 'Capilla del Monte',
      latitude: dto.latitude,
      longitude: dto.longitude,
      pricePerNight: Number(dto.pricePerNight),
      maxGuests: Number(dto.maxGuests),
      unitTitle: dto.unitTitle,
      surfaceSqm: dto.surfaceSqm,
      bedroomsSummary: dto.bedroomsSummary,
      phone: dto.phone,
      checkInTime: dto.checkInTime,
      checkOutTime: dto.checkOutTime,
      petPolicy: dto.petPolicy,
      cancellationPolicy: dto.cancellationPolicy,
      licenseNumber: dto.licenseNumber,
      responseTime: dto.responseTime,
      hasBreakfast: Boolean(dto.hasBreakfast),
      breakfastType: dto.hasBreakfast ? dto.breakfastType : undefined,
      amenities: dto.amenities,
      downPaymentPercentage: dto.downPaymentPercentage ?? 50,
      bankAccountHolder: dto.bankAccountHolder,
      bankCbu: dto.bankCbu,
      bankAlias: dto.bankAlias,
      bankName: dto.bankName,
      isActive: true,
      hostId: 'host-01',
      images: formattedImages.map((img, i) => ({ id: `img-${Date.now()}-${i}`, ...img })),
      createdAt: new Date().toISOString(),
    };
    localAccommodations = [newAcc, ...localAccommodations];
    return normalizeAccommodation(newAcc);
  },

  async addImage(
    accommodationId: string,
    image: { url: string; publicId?: string; isMain?: boolean }
  ): Promise<AccommodationImage> {
    const created = await apiClient.post<AccommodationImage>(
      `/accommodations/${accommodationId}/images`,
      image
    );
    return normalizeImage(created);
  },

  async deleteImage(accommodationId: string, imageId: string): Promise<void> {
    await apiClient.delete<void>(`/accommodations/${accommodationId}/images/${imageId}`);
  },

  async update(id: string, dto: Partial<CreateAccommodationDto>): Promise<Accommodation> {
    // UpdateAccommodationDto has no `images` field: image mutations are handled
    // exclusively through addImage/deleteImage, never in the PUT payload.
    const { images: dtoImages, ...generalData } = dto;
    const payload: any = { ...generalData };
    if (generalData.pricePerNight !== undefined) {
      payload.pricePerNight = Number(generalData.pricePerNight);
    }
    if (generalData.maxGuests !== undefined) {
      payload.maxGuests = Number(generalData.maxGuests);
    }

    try {
      const updated = await apiClient.put<Accommodation>(`/accommodations/${id}`, payload);
      if (updated) return normalizeAccommodation(updated);
    } catch (err) {
      console.warn('Fallo actualizacion en backend, usando fallback local:', err);
    }

    const index = localAccommodations.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Alojamiento no encontrado');
    const existing = localAccommodations[index];

    let updatedImages = existing.images;
    if (dtoImages) {
      updatedImages = dtoImages.map((img, index) => {
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
      ...generalData,
      images: updatedImages,
      pricePerNight: dto.pricePerNight ? Number(dto.pricePerNight) : existing.pricePerNight,
      maxGuests: dto.maxGuests ? Number(dto.maxGuests) : existing.maxGuests,
      updatedAt: new Date().toISOString(),
    };
    localAccommodations[index] = updated;
    return normalizeAccommodation(updated);
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
    return normalizeAccommodation({ ...acc });
  },
};
