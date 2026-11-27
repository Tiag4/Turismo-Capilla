import { useState, useEffect, useMemo, useCallback } from 'react';
import type { BlockedDateRange, FocusedRangeInput } from './types';
import {
  parseISODate,
  getTodayISOString,
  calculateNights,
} from './dateUtils';

interface UseDateRangePickerOptions {
  checkIn: string;
  checkOut: string;
  onCheckInChange: (date: string) => void;
  onCheckOutChange: (date: string) => void;
  minDate?: string;
  minNights?: number;
  blockedRanges?: BlockedDateRange[];
  isOpen: boolean;
  onClose?: () => void;
}

export function useDateRangePicker({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  minDate,
  minNights = 1,
  blockedRanges = [],
  isOpen,
  onClose,
}: UseDateRangePickerOptions) {
  const effectiveMinDate = minDate || getTodayISOString();
  const effectiveMinNights = Math.max(1, minNights || 1);
  const [focusedInput, setFocusedInput] = useState<FocusedRangeInput>('checkIn');
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  // Initialize view month to checkIn, or today
  const initialDate = useMemo(() => {
    return parseISODate(checkIn) || parseISODate(effectiveMinDate) || {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      day: 1,
    };
  }, [checkIn, effectiveMinDate]);

  const [viewYear, setViewYear] = useState<number>(initialDate.year);
  const [viewMonth, setViewMonth] = useState<number>(initialDate.month);

  // Sync view when opened with an existing check-in
  useEffect(() => {
    if (isOpen && checkIn) {
      const parsed = parseISODate(checkIn);
      if (parsed) {
        setViewYear(parsed.year);
        setViewMonth(parsed.month);
      }
    }
  }, [isOpen, checkIn]);

  // Second month calculations
  const secondMonthYear = viewMonth === 11 ? viewYear + 1 : viewYear;
  const secondMonth = (viewMonth + 1) % 12;

  // Previous month navigation guard
  const canGoPrev = useMemo(() => {
    const minParsed = parseISODate(effectiveMinDate);
    if (!minParsed) return true;
    if (viewYear < minParsed.year) return false;
    if (viewYear === minParsed.year && viewMonth <= minParsed.month) return false;
    return true;
  }, [viewYear, viewMonth, effectiveMinDate]);

  const handlePrevMonth = useCallback(() => {
    if (!canGoPrev) return;
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }, [canGoPrev, viewMonth]);

  const handleNextMonth = useCallback(() => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }, [viewMonth]);

  // Find the earliest blocked date strictly after checkIn
  const earliestBlockedAfterCheckIn = useMemo(() => {
    if (!checkIn) return null;
    let earliest: string | null = null;
    for (const range of blockedRanges) {
      if (range.startDate > checkIn) {
        if (!earliest || range.startDate < earliest) {
          earliest = range.startDate;
        }
      }
    }
    return earliest;
  }, [checkIn, blockedRanges]);

  // Check if a single date is blocked or past
  const isDateDisabled = useCallback(
    (dateStr: string): boolean => {
      if (dateStr < effectiveMinDate) return true;

      // Inside any blocked range: [startDate, endDate)
      const isBlocked = blockedRanges.some(
        (range) => range.startDate <= dateStr && dateStr < range.endDate
      );
      if (isBlocked) return true;

      // If user is choosing checkOut: cannot pick a date <= checkIn or beyond a blocked range
      if (focusedInput === 'checkOut' && checkIn) {
        if (dateStr <= checkIn) return true;
        if (effectiveMinNights > 1) {
          const nights = calculateNights(checkIn, dateStr);
          if (nights !== null && nights < effectiveMinNights) {
            return true;
          }
        }
        if (earliestBlockedAfterCheckIn && dateStr > earliestBlockedAfterCheckIn) {
          return true;
        }
      }

      return false;
    },
    [effectiveMinDate, effectiveMinNights, blockedRanges, focusedInput, checkIn, earliestBlockedAfterCheckIn]
  );

  // Date selection action
  const handleSelectDate = useCallback(
    (dateStr: string) => {
      if (isDateDisabled(dateStr)) return;

      if (focusedInput === 'checkIn') {
        onCheckInChange(dateStr);
        if (checkOut) {
          const nights = calculateNights(dateStr, checkOut);
          if (dateStr >= checkOut || (nights !== null && nights < effectiveMinNights)) {
            onCheckOutChange('');
          }
        }
        setFocusedInput('checkOut');
      } else {
        // focusedInput === 'checkOut'
        if (!checkIn || dateStr <= checkIn) {
          // If user clicked earlier than checkIn, make it new checkIn
          onCheckInChange(dateStr);
          onCheckOutChange('');
          setFocusedInput('checkOut');
        } else {
          onCheckOutChange(dateStr);
          setFocusedInput('checkIn');
          // Auto close after complete selection if callback provided
          if (onClose) {
            setTimeout(onClose, 280);
          }
        }
      }
    },
    [focusedInput, checkIn, checkOut, effectiveMinNights, isDateDisabled, onCheckInChange, onCheckOutChange, onClose]
  );

  const clearDates = useCallback(() => {
    onCheckInChange('');
    onCheckOutChange('');
    setFocusedInput('checkIn');
    setHoverDate(null);
  }, [onCheckInChange, onCheckOutChange]);

  const clearCheckIn = useCallback(() => {
    onCheckInChange('');
    onCheckOutChange('');
    setFocusedInput('checkIn');
  }, [onCheckInChange, onCheckOutChange]);

  const clearCheckOut = useCallback(() => {
    onCheckOutChange('');
    setFocusedInput('checkOut');
  }, [onCheckOutChange]);

  const nightsCount = useMemo(() => {
    return calculateNights(checkIn, checkOut);
  }, [checkIn, checkOut]);

  return {
    focusedInput,
    setFocusedInput,
    hoverDate,
    setHoverDate,
    viewYear,
    viewMonth,
    secondMonthYear,
    secondMonth,
    canGoPrev,
    handlePrevMonth,
    handleNextMonth,
    isDateDisabled,
    handleSelectDate,
    clearDates,
    clearCheckIn,
    clearCheckOut,
    nightsCount,
  };
}
