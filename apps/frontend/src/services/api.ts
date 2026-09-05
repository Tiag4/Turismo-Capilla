const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_API_URL) ||
  'http://localhost:3001/api/v1';

export interface Attraction {
  id: string;
  name: string;
  description: string;
  category: 'HILL' | 'RIVER_BEACH' | 'CULTURAL' | 'NIGHT' | 'NATURE_TRAIL';
  difficulty?: string | null;
  estimatedDuration?: string | null;
  howToGet?: string | null;
  requiresGuide: boolean;
  admissionFee?: number | string | null;
  latitude?: number | null;
  longitude?: number | null;
  images: { id: string; url: string; publicId: string }[];
}

export interface Accommodation {
  id: string;
  name: string;
  description: string;
  type: 'CABIN' | 'HOTEL' | 'APARTMENT' | 'HOSTEL' | 'CAMPING';
  address: string;
  locality: string;
  pricePerNight: number | string;
  maxGuests: number;
  amenities: string[];
  isActive: boolean;
  images: { id: string; url: string; publicId: string; isMain: boolean }[];
  host?: {
    id: string;
    name: string;
    lastName: string;
    email: string;
    phone?: string | null;
  };
}

export interface BookingPayload {
  accommodationId: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestOrigin?: string;
  notes?: string;
}

export interface BookingResult {
  id: string;
  bookingCode: string;
  checkIn: string;
  checkOut: string;
  totalNights: number;
  totalAmount: number | string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  guestName: string;
  accommodation?: Accommodation;
}

export const api = {
  async getHealth() {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error('Error de conexión con el servidor');
    return res.json();
  },

  async getAttractions(params?: { category?: string; search?: string }): Promise<Attraction[]> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);

    const url = `${API_BASE_URL}/attractions${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error al obtener los atractivos');
    return res.json();
  },

  async getAttractionById(id: string): Promise<Attraction> {
    const res = await fetch(`${API_BASE_URL}/attractions/${id}`);
    if (!res.ok) throw new Error('Atractivo no encontrado');
    return res.json();
  },

  async getAccommodations(params?: {
    checkIn?: string;
    checkOut?: string;
    guests?: number;
    type?: string;
    search?: string;
  }): Promise<Accommodation[]> {
    const query = new URLSearchParams();
    if (params?.checkIn) query.set('checkIn', params.checkIn);
    if (params?.checkOut) query.set('checkOut', params.checkOut);
    if (params?.guests) query.set('guests', params.guests.toString());
    if (params?.type) query.set('type', params.type);
    if (params?.search) query.set('search', params.search);

    const url = `${API_BASE_URL}/accommodations${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error al consultar alojamientos');
    return res.json();
  },

  async getAccommodationById(id: string): Promise<Accommodation> {
    const res = await fetch(`${API_BASE_URL}/accommodations/${id}`);
    if (!res.ok) throw new Error('Alojamiento no encontrado');
    return res.json();
  },

  async createBooking(payload: BookingPayload): Promise<BookingResult> {
    const res = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Error al procesar la reserva');
    }
    return data;
  },

  async lookupBooking(code: string, email: string): Promise<BookingResult> {
    const query = new URLSearchParams({ code, email });
    const res = await fetch(`${API_BASE_URL}/bookings/lookup?${query.toString()}`);
    if (!res.ok) throw new Error('Reserva no encontrada');
    return res.json();
  },
};
