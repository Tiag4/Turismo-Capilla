import type { BookingVoucherRecord } from '../types';

export const SEED_VOUCHERS: BookingVoucherRecord[] = [
  {
    code: 'CAP-2026-8492',
    accommodationId: 'acc-1',
    accommodationTitle: 'Cabañas Valle del Sol',
    accommodationZone: 'La Toma',
    accommodationAddress: 'Camino a La Toma km 1.5, Capilla del Monte',
    accommodationImage:
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80',
    firstName: 'Martino',
    lastName: 'Gómez',
    email: 'turista@capilladelmonte.gov.ar',
    phone: '+54 9 351 555-1234',
    checkIn: '2026-09-18',
    checkOut: '2026-09-22',
    nightsCount: 4,
    adults: 2,
    children: 1,
    childAges: [7],
    rooms: 1,
    finalPrice: 380000,
    status: 'CONFIRMED',
    createdAt: '2026-09-08T14:30:00Z',
    hostPhone: '+54 9 3548 40-1122',
  },
  {
    code: 'CAP-2026-5120',
    accommodationId: 'acc-2',
    accommodationTitle: 'Hostería Los Portales',
    accommodationZone: 'Casco Histórico',
    accommodationAddress: 'Av. Pueyrredón 320, Capilla del Monte',
    accommodationImage:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    firstName: 'Mariana',
    lastName: 'Rossi',
    email: 'mariana.rossi@email.com',
    phone: '+54 9 11 4444-5555',
    checkIn: '2026-10-02',
    checkOut: '2026-10-05',
    nightsCount: 3,
    adults: 2,
    children: 0,
    childAges: [],
    rooms: 1,
    finalPrice: 360000,
    status: 'PENDING_CONFIRMATION',
    createdAt: '2026-09-07T11:20:00Z',
    hostPhone: '+54 9 3548 41-9988',
  },
  {
    code: 'CAP-2026-3310',
    accommodationId: 'acc-3',
    accommodationTitle: 'Refugio Serrano Altas Cumbres',
    accommodationZone: 'Falda del Uritorco',
    accommodationAddress: 'Ruta 38 y acceso norte, Capilla del Monte',
    accommodationImage:
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    firstName: 'Lucas',
    lastName: 'Fernández',
    email: 'lucas.fdz@gmail.com',
    phone: '+54 9 341 678-9012',
    checkIn: '2026-11-12',
    checkOut: '2026-11-15',
    nightsCount: 3,
    adults: 2,
    children: 0,
    childAges: [],
    rooms: 1,
    finalPrice: 435000,
    status: 'CONFIRMED',
    createdAt: '2026-09-06T18:45:00Z',
    hostPhone: '+54 9 3548 42-3344',
  },
];

export function lookupBooking(code: string, email?: string): BookingVoucherRecord | null {
  if (!code) return null;
  const normalizedCode = code.trim().toUpperCase();
  const normalizedEmail = (email || '').trim().toLowerCase();

  // 1. Check client local storage
  if (typeof window !== 'undefined') {
    try {
      const stored: BookingVoucherRecord[] = JSON.parse(
        localStorage.getItem('capilla_bookings') || '[]',
      );
      const match = stored.find((r) => {
        const matchesCode = r.code.toUpperCase() === normalizedCode;
        if (!matchesCode) return false;
        if (normalizedEmail) {
          return r.email.toLowerCase() === normalizedEmail;
        }
        return true;
      });
      if (match) return match;
    } catch {
      // Fall through to seed records
    }
  }

  // 2. Check seed records
  const seedMatch = SEED_VOUCHERS.find((r) => {
    const matchesCode = r.code.toUpperCase() === normalizedCode;
    if (!matchesCode) return false;
    if (normalizedEmail) {
      return r.email.toLowerCase() === normalizedEmail;
    }
    return true;
  });

  return seedMatch || null;
}
