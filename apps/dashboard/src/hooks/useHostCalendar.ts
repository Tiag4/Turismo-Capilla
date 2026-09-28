import { useState, useMemo, useCallback } from 'react';
import { useHostBookings } from './useHostBookings.ts';
import { useHostAccommodations } from './useHostAccommodations.ts';
import { useDateBlock } from './useDateBlock.ts';
import type { Booking } from '../types/booking.types.ts';
import type { DateBlock } from '../types/date-block.types.ts';

export interface CalendarDay {
  date: Date;
  dateKey: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  isWeekend: boolean;
  bookings: Booking[];
  dateBlocks: DateBlock[];
}

export const WEEKDAYS_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const MONTH_NAMES_ES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

function formatDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function useHostCalendar() {
  const { bookings, isLoading: isLoadingBookings, updateBookingStatus, refresh } = useHostBookings();
  const { accommodations, isLoading: isLoadingAccommodations } = useHostAccommodations();
  const { blocks: dateBlocks, createBlock, deleteBlock } = useDateBlock();

  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [selectedAccommodationId, setSelectedAccommodationId] = useState<string>('ALL');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigation handlers
  const prevMonth = useCallback(() => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const nextMonth = useCallback(() => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const monthLabel = useMemo(() => {
    return `${MONTH_NAMES_ES[month]} ${year}`;
  }, [month, year]);

  // Today key for comparisons
  const todayKey = useMemo(() => formatDateKey(new Date()), []);

  // Filter bookings by accommodation
  const relevantBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (b.status === 'CANCELLED') return false;
      if (selectedAccommodationId !== 'ALL' && b.accommodationId !== selectedAccommodationId) {
        return false;
      }
      return true;
    });
  }, [bookings, selectedAccommodationId]);

  // Build 35 or 42 grid cells starting on Monday
  const calendarDays = useMemo<CalendarDay[]>(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Day of week: 0 = Sunday, 1 = Monday ... 6 = Saturday
    // Convert to Monday = 0, Sunday = 6
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek < 0) startDayOfWeek = 6;

    const days: CalendarDay[] = [];

    // 1. Previous month padding
    const prevMonthLastDate = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDate - i);
      const dateKey = formatDateKey(d);
      const dayOfWeek = d.getDay();
      days.push({
        date: d,
        dateKey,
        dayNumber: d.getDate(),
        isCurrentMonth: false,
        isToday: dateKey === todayKey,
        isPast: dateKey < todayKey,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        bookings: [],
        dateBlocks: [],
      });
    }

    // 2. Current month days
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const d = new Date(year, month, day);
      const dateKey = formatDateKey(d);
      const dayOfWeek = d.getDay();
      days.push({
        date: d,
        dateKey,
        dayNumber: day,
        isCurrentMonth: true,
        isToday: dateKey === todayKey,
        isPast: dateKey < todayKey,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        bookings: [],
        dateBlocks: [],
      });
    }

    // 3. Next month padding to fill a complete 35 or 42 grid
    const totalCells = days.length <= 35 ? 35 : 42;
    const remaining = totalCells - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      const dateKey = formatDateKey(d);
      const dayOfWeek = d.getDay();
      days.push({
        date: d,
        dateKey,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: dateKey === todayKey,
        isPast: dateKey < todayKey,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        bookings: [],
        dateBlocks: [],
      });
    }

    // 4. Map bookings and date blocks to each day
    for (const cell of days) {
      cell.bookings = relevantBookings.filter((b) => {
        const inKey = b.checkIn.substring(0, 10);
        const outKey = b.checkOut.substring(0, 10);
        return inKey <= cell.dateKey && cell.dateKey < outKey;
      });

      cell.dateBlocks = dateBlocks.filter((block) => {
        if (selectedAccommodationId !== 'ALL' && block.accommodationId !== selectedAccommodationId) {
          return false;
        }
        return block.startDate <= cell.dateKey && cell.dateKey <= block.endDate;
      });
    }

    return days;
  }, [year, month, todayKey, relevantBookings, dateBlocks, selectedAccommodationId]);

  // Statistics for current month
  const monthStats = useMemo(() => {
    const currentMonthKeyPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    const monthBookings = relevantBookings.filter(
      (b) => b.checkIn.startsWith(currentMonthKeyPrefix) || b.checkOut.startsWith(currentMonthKeyPrefix)
    );
    const confirmedCount = monthBookings.filter((b) => b.status === 'CONFIRMED').length;
    const pendingCount = monthBookings.filter((b) => b.status === 'PENDING').length;
    return {
      totalBookings: monthBookings.length,
      confirmedCount,
      pendingCount,
    };
  }, [relevantBookings, year, month]);

  return {
    calendarDays,
    monthLabel,
    year,
    month,
    prevMonth,
    nextMonth,
    goToToday,
    selectedAccommodationId,
    setSelectedAccommodationId,
    accommodations,
    monthStats,
    dateBlocks,
    createBlock,
    deleteBlock,
    isLoading: isLoadingBookings || isLoadingAccommodations,
    updateBookingStatus,
    refresh,
  };
}
