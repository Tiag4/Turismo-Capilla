import { useState, useEffect, useCallback } from 'react';
import type { BookingVoucherRecord } from '../types';
import { lookupBooking } from '../data/seed-vouchers';

export function useBookingInquiry() {
  const [code, setCode] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [voucher, setVoucher] = useState<BookingVoucherRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Auto-search if code is passed via URL query
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const initialCode = params.get('code');
    const initialEmail = params.get('email');

    if (initialCode) {
      const cleanCode = initialCode.trim().toUpperCase();
      setCode(cleanCode);
      if (initialEmail) setEmail(initialEmail.trim());

      const found = lookupBooking(cleanCode, initialEmail || undefined);
      if (found) {
        setVoucher(found);
      } else {
        setError(`No encontramos ninguna reserva con el código ${cleanCode}.`);
      }
      setHasSearched(true);
    }
  }, []);

  // Format code on change
  const handleCodeChange = useCallback((val: string) => {
    setError(null);
    let cleaned = val.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    setCode(cleaned);
  }, []);

  const handleEmailChange = useCallback((val: string) => {
    setError(null);
    setEmail(val);
  }, []);

  // Perform search
  const handleSearch = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const cleanCode = code.trim().toUpperCase();

      if (!cleanCode) {
        setError('Ingresá el código de reserva oficial (ej. CAP-2026-8492)');
        return;
      }

      setIsLoading(true);
      setError(null);

      // Brief simulated lookup for UI feedback
      setTimeout(() => {
        const result = lookupBooking(cleanCode, email ? email.trim() : undefined);
        setIsLoading(false);
        setHasSearched(true);

        if (result) {
          setVoucher(result);
          setError(null);
        } else {
          setVoucher(null);
          setError(
            `No encontramos reservas para el código "${cleanCode}"${
              email ? ` asociado al email ${email}` : ''
            }. Verificá los datos e intentá de nuevo.`,
          );
        }
      }, 400);
    },
    [code, email],
  );

  const selectDemoCode = useCallback((demoCode: string) => {
    setCode(demoCode);
    setError(null);
    const result = lookupBooking(demoCode);
    if (result) {
      setVoucher(result);
      setEmail(result.email);
    }
    setHasSearched(true);
  }, []);

  const printVoucher = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }, []);

  return {
    code,
    email,
    handleCodeChange,
    handleEmailChange,
    handleSearch,
    selectDemoCode,
    printVoucher,
    voucher,
    isLoading,
    error,
    hasSearched,
  };
}
