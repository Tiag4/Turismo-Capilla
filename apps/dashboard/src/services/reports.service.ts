import type { Booking } from '../types/booking.types.ts';

export type ReportPeriod = 'CURRENT_FORTNIGHT' | 'CURRENT_MONTH' | 'SUMMER_SEASON' | 'WINTER_BREAK';

export interface OccupancyDataPoint {
  label: string;
  rate: number; // percentage 0 - 100
  bookingsCount: number;
}

export interface OriginStat {
  origin: string;
  percentage: number;
}

export interface TourismReportData {
  period: ReportPeriod;
  periodLabel: string;
  dateRangeLabel: string;
  averageOccupancy: number;
  totalRevenue: number;
  totalBookings: number;
  totalGuests: number;
  averageStayNights: number;
  chartData: OccupancyDataPoint[];
  origins: OriginStat[];
  bookings: Booking[];
}

const MOCK_PERIOD_DATA: Record<ReportPeriod, TourismReportData> = {
  CURRENT_FORTNIGHT: {
    period: 'CURRENT_FORTNIGHT',
    periodLabel: 'Quincena en Curso',
    dateRangeLabel: '01/09/2026 - 15/09/2026',
    averageOccupancy: 78,
    totalRevenue: 8450000,
    totalBookings: 24,
    totalGuests: 86,
    averageStayNights: 3.2,
    chartData: [
      { label: '01-03 Sep', rate: 65, bookingsCount: 4 },
      { label: '04-06 Sep', rate: 82, bookingsCount: 7 },
      { label: '07-09 Sep', rate: 74, bookingsCount: 5 },
      { label: '10-12 Sep', rate: 91, bookingsCount: 8 },
      { label: '13-15 Sep', rate: 78, bookingsCount: 6 },
    ],
    origins: [
      { origin: 'Córdoba Capital', percentage: 38 },
      { origin: 'Rosario / Santa Fe', percentage: 28 },
      { origin: 'CABA y GBA', percentage: 22 },
      { origin: 'Mendoza / Cuyo', percentage: 12 },
    ],
    bookings: [
      {
        id: 'rep-1',
        bookingCode: 'CAP-2026-9012',
        checkIn: '2026-09-02',
        checkOut: '2026-09-05',
        totalNights: 3,
        guestCount: 4,
        pricePerNight: 95000,
        totalAmount: 285000,
        status: 'CONFIRMED',
        guestName: 'Valeria Roldán',
        guestEmail: 'valeria.roldan@gmail.com',
        guestPhone: '+54 9 341 555 1234',
        guestOrigin: 'Rosario, Santa Fe',
        accommodationId: 'acc-1',
        accommodation: { id: 'acc-1', name: 'Cabañas Pircas del Uritorco' },
        createdAt: '2026-08-28T10:00:00Z',
      },
      {
        id: 'rep-2',
        bookingCode: 'CAP-2026-9015',
        checkIn: '2026-09-06',
        checkOut: '2026-09-10',
        totalNights: 4,
        guestCount: 2,
        pricePerNight: 120000,
        totalAmount: 480000,
        status: 'CONFIRMED',
        guestName: 'Martín Bossi',
        guestEmail: 'martin.bossi@live.com',
        guestPhone: '+54 9 11 4433 2211',
        guestOrigin: 'CABA',
        accommodationId: 'acc-2',
        accommodation: { id: 'acc-2', name: 'Casona Histórica San Esteban' },
        createdAt: '2026-08-30T14:30:00Z',
      },
      {
        id: 'rep-3',
        bookingCode: 'CAP-2026-9022',
        checkIn: '2026-09-11',
        checkOut: '2026-09-14',
        totalNights: 3,
        guestCount: 3,
        pricePerNight: 70000,
        totalAmount: 210000,
        status: 'CONFIRMED',
        guestName: 'Lucía Albarracín',
        guestEmail: 'lucia.albarracin@yahoo.com.ar',
        guestPhone: '+54 9 351 987 6543',
        guestOrigin: 'Córdoba Capital',
        accommodationId: 'acc-3',
        accommodation: { id: 'acc-3', name: 'Refugio Los Alazanes' },
        createdAt: '2026-09-01T09:15:00Z',
      },
    ],
  },
  CURRENT_MONTH: {
    period: 'CURRENT_MONTH',
    periodLabel: 'Mes Completo (Septiembre)',
    dateRangeLabel: '01/09/2026 - 30/09/2026',
    averageOccupancy: 81,
    totalRevenue: 16800000,
    totalBookings: 52,
    totalGuests: 174,
    averageStayNights: 3.5,
    chartData: [
      { label: 'Semana 1', rate: 72, bookingsCount: 11 },
      { label: 'Semana 2', rate: 84, bookingsCount: 14 },
      { label: 'Semana 3', rate: 88, bookingsCount: 16 },
      { label: 'Semana 4', rate: 79, bookingsCount: 11 },
    ],
    origins: [
      { origin: 'Córdoba Capital', percentage: 35 },
      { origin: 'CABA y Gran Buenos Aires', percentage: 30 },
      { origin: 'Santa Fe / Rosario', percentage: 23 },
      { origin: 'Resto del País', percentage: 12 },
    ],
    bookings: [],
  },
  SUMMER_SEASON: {
    period: 'SUMMER_SEASON',
    periodLabel: 'Temporada de Verano',
    dateRangeLabel: '01/01/2026 - 28/02/2026',
    averageOccupancy: 94,
    totalRevenue: 64200000,
    totalBookings: 198,
    totalGuests: 680,
    averageStayNights: 5.1,
    chartData: [
      { label: '1° Quin Ene', rate: 91, bookingsCount: 46 },
      { label: '2° Quin Ene', rate: 98, bookingsCount: 54 },
      { label: '1° Quin Feb', rate: 96, bookingsCount: 52 },
      { label: '2° Quin Feb', rate: 90, bookingsCount: 46 },
    ],
    origins: [
      { origin: 'CABA y Gran Buenos Aires', percentage: 42 },
      { origin: 'Santa Fe / Rosario', percentage: 26 },
      { origin: 'Córdoba Capital', percentage: 20 },
      { origin: 'Noroeste / Cuyo', percentage: 12 },
    ],
    bookings: [],
  },
  WINTER_BREAK: {
    period: 'WINTER_BREAK',
    periodLabel: 'Vacaciones de Invierno',
    dateRangeLabel: '06/07/2026 - 26/07/2026',
    averageOccupancy: 87,
    totalRevenue: 31500000,
    totalBookings: 96,
    totalGuests: 310,
    averageStayNights: 4.0,
    chartData: [
      { label: 'Semana 1', rate: 82, bookingsCount: 28 },
      { label: 'Semana 2', rate: 92, bookingsCount: 38 },
      { label: 'Semana 3', rate: 86, bookingsCount: 30 },
    ],
    origins: [
      { origin: 'Córdoba Capital', percentage: 40 },
      { origin: 'CABA y GBA', percentage: 32 },
      { origin: 'Santa Fe', percentage: 18 },
      { origin: 'Otras Provincias', percentage: 10 },
    ],
    bookings: [],
  },
};

export const reportsService = {
  async getReportData(period: ReportPeriod): Promise<TourismReportData> {
    // Simulate brief network fetch
    await new Promise((resolve) => setTimeout(resolve, 150));
    const data = MOCK_PERIOD_DATA[period];
    // Fill sample bookings if array is empty
    if (data.bookings.length === 0) {
      data.bookings = MOCK_PERIOD_DATA.CURRENT_FORTNIGHT.bookings;
    }
    return data;
  },

  downloadBookingsCsv(bookings: Booking[], periodTitle: string): void {
    const headers = [
      'Codigo Reserva',
      'Alojamiento',
      'Turista',
      'Email',
      'Telefono',
      'Origen',
      'Check-In',
      'Check-Out',
      'Noches',
      'Pasajeros',
      'Tarifa Noche ARS',
      'Total ARS',
      'Estado',
    ];

    const rows = bookings.map((b) => [
      b.bookingCode,
      `"${(b.accommodation?.name || 'Alojamiento').replace(/"/g, '""')}"`,
      `"${b.guestName.replace(/"/g, '""')}"`,
      b.guestEmail,
      b.guestPhone,
      `"${(b.guestOrigin || 'No especificado').replace(/"/g, '""')}"`,
      b.checkIn,
      b.checkOut,
      b.totalNights,
      b.guestCount,
      b.pricePerNight,
      b.totalAmount,
      b.status,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeTitle = periodTitle.toLowerCase().replace(/[^a-z0-9]/g, '_');
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_turismo_capilla_${safeTitle}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};
