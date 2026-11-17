import { useState, useEffect, useCallback, useMemo } from 'react';
import { bookingsService } from '../services/bookings.service.ts';
import { useToast } from '../context/ToastContext.tsx';
import type { Booking, BookingStatus } from '../types/booking.types.ts';

function normalizeBooking(dto: any): Booking {
  return {
    ...dto,
    items: Array.isArray(dto.items) ? dto.items : [],
    totalAmount: Number(dto.totalAmount ?? 0),
    pricePerNight: Number(dto.pricePerNight ?? 0),
    accommodationName: dto.accommodationName || dto.accommodation?.name || 'Alojamiento',
    accommodation: {
      id: dto.accommodationId || dto.accommodation?.id || '',
      name: dto.accommodationName || dto.accommodation?.name || 'Alojamiento',
      locality: dto.locality || dto.accommodation?.locality || 'Capilla del Monte',
    },
  };
}

export function useHostBookings() {
  const { showSuccess, showError } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await bookingsService.getMyBookings();
      const normalized = (Array.isArray(data) ? data : []).map(normalizeBooking);
      setBookings(normalized);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las reservas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateBookingStatus = useCallback(async (id: string, status: BookingStatus): Promise<Booking | null> => {
    setError(null);
    setIsUpdating(true);
    try {
      const rawUpdated = await bookingsService.updateStatus(id, status);
      const updated = normalizeBooking(rawUpdated);
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
      if (status === 'CONFIRMED') {
        showSuccess('Reserva confirmada con éxito. Se despachó el correo de confirmación al huésped.');
      } else if (status === 'CANCELLED') {
        showSuccess('Reserva cancelada. Se notificó al huésped por correo electrónico.');
      } else if (status === 'COMPLETED') {
        showSuccess('Reserva marcada como completada.');
      }
      return updated;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'No se pudo actualizar el estado de la reserva.';
      setError(message);
      showError(message);
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, [showSuccess, showError]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesStatus = filterStatus === 'ALL' || b.status === filterStatus;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        b.bookingCode.toLowerCase().includes(q) ||
        b.guestName.toLowerCase().includes(q) ||
        b.guestEmail.toLowerCase().includes(q) ||
        (b.accommodationName || b.accommodation?.name || '').toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [bookings, filterStatus, searchQuery]);

  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === 'PENDING').length;
    const confirmed = bookings.filter((b) => b.status === 'CONFIRMED').length;
    const totalRevenue = bookings
      .filter((b) => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
      .reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);

    return { total, pending, confirmed, totalRevenue };
  }, [bookings]);

  return {
    bookings: filteredBookings,
    allBookingsCount: bookings.length,
    stats,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    isLoading,
    isUpdating,
    error,
    refresh: fetchBookings,
    updateBookingStatus,
  };
}
