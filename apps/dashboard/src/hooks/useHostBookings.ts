import { useState, useEffect, useCallback, useMemo } from 'react';
import { bookingsService } from '../services/bookings.service.ts';
import type { Booking, BookingStatus } from '../types/booking.types.ts';

export function useHostBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await bookingsService.getMyBookings();
      setBookings(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las reservas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateBookingStatus = useCallback(async (id: string, status: BookingStatus) => {
    const updated = await bookingsService.updateStatus(id, status);
    setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    return updated;
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesStatus = filterStatus === 'ALL' || b.status === filterStatus;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        b.bookingCode.toLowerCase().includes(q) ||
        b.guestName.toLowerCase().includes(q) ||
        b.guestEmail.toLowerCase().includes(q) ||
        (b.accommodation?.name || '').toLowerCase().includes(q);
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
    error,
    refresh: fetchBookings,
    updateBookingStatus,
  };
}
