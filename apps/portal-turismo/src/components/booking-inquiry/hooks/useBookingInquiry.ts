import { useState, useEffect, useCallback } from 'react';
import type { BookingVoucherRecord } from '../types';
import { lookupBooking } from '../data/seed-vouchers';
import { api, ApiRequestError, type BookingResult } from '../../../services/api';

function mapApiResultToVoucher(apiRes: BookingResult, fallbackEmail: string): BookingVoucherRecord {
  const nameParts = (apiRes.guestName || '').trim().split(/\s+/);
  const firstName = nameParts[0] || 'Turista';
  const lastName = nameParts.slice(1).join(' ') || '';
  const totalAmount = Number(apiRes.totalAmount) || 0;
  const downPct = apiRes.downPaymentPercentage ?? apiRes.accommodation?.downPaymentPercentage ?? 50;
  const downAmt =
    apiRes.downPaymentAmount != null
      ? Number(apiRes.downPaymentAmount)
      : Math.round(totalAmount * (downPct / 100));
  const remBal =
    apiRes.remainingBalance != null
      ? Number(apiRes.remainingBalance)
      : Math.max(0, totalAmount - downAmt);

  return {
    code: apiRes.bookingCode,
    accommodationId: apiRes.accommodation?.id || apiRes.accommodationId || 'acc-1',
    accommodationTitle: apiRes.accommodation?.name || apiRes.accommodationName || 'Alojamiento en Capilla del Monte',
    accommodationZone: apiRes.accommodation?.locality || 'Capilla del Monte',
    accommodationAddress: apiRes.accommodation?.address || 'Capilla del Monte, Córdoba',
    accommodationImage:
      apiRes.accommodation?.imageUrl ||
      apiRes.accommodation?.images?.[0]?.url ||
      '/images/detail/bento-1-terrace.jpg',
    firstName,
    lastName,
    email: apiRes.guestEmail || fallbackEmail,
    phone: apiRes.guestPhone || '',
    checkIn: apiRes.checkIn,
    checkOut: apiRes.checkOut,
    nightsCount: apiRes.totalNights || 1,
    adults: apiRes.guestCount || 2,
    children: 0,
    rooms: 1,
    finalPrice: totalAmount,
    downPaymentPercentage: downPct,
    downPaymentAmount: downAmt,
    remainingBalance: remBal,
    bankAccountHolder:
      apiRes.bankAccountHolder ||
      apiRes.accommodation?.bankAccountHolder ||
      'Administración Cabañas Capilla',
    bankCbu:
      apiRes.bankCbu ||
      apiRes.accommodation?.bankCbu ||
      '0110485530048500123456',
    bankAlias:
      apiRes.bankAlias ||
      apiRes.accommodation?.bankAlias ||
      'CAPILLA.RESERVA.OFICIAL',
    bankName:
      apiRes.bankName ||
      apiRes.accommodation?.bankName ||
      'Banco de la Nación Argentina',
    status:
      apiRes.status === 'CONFIRMED' ||
      apiRes.status === 'COMPLETED' ||
      apiRes.status === 'CANCELLED'
        ? apiRes.status
        : 'PENDING_CONFIRMATION',
    createdAt: apiRes.createdAt || new Date().toISOString(),
    hostPhone: apiRes.hostPhone || apiRes.accommodation?.phone || '+54 9 3548 40-1122',
    isDemo: false,
  };
}

export function useBookingInquiry() {
  const [code, setCode] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [voucher, setVoucher] = useState<BookingVoucherRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const performLookup = useCallback(async (searchCode: string, searchEmail: string) => {
    const cleanCode = searchCode.trim().toUpperCase();
    const cleanEmail = searchEmail.trim();

    if (!cleanCode) {
      setError('Ingresá el código de reserva oficial (ej. CAP-2026-K9M4X7Q2 o CAP-2026-8492)');
      return;
    }

    // Si no ingresó email, primero intentamos consultar los datos de prueba/locales
    if (!cleanEmail) {
      const localMatch = lookupBooking(cleanCode);
      if (localMatch) {
        setVoucher(localMatch);
        setEmail(localMatch.email);
        setError(null);
        setHasSearched(true);
        return;
      }

      // Si no existe localmente, informamos que el email es obligatorio para buscar en la base oficial
      setVoucher(null);
      setHasSearched(true);
      setError('Para consultar tu reserva en el sistema oficial, por favor ingresá el correo electrónico asociado a la misma.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const apiRes = await api.lookupBooking(cleanCode, cleanEmail);
      if (apiRes) {
        const mapped = mapApiResultToVoucher(apiRes, cleanEmail);
        setVoucher(mapped);
        setError(null);
        setHasSearched(true);
        setIsLoading(false);
        return;
      }
    } catch (err: unknown) {
      // Fallback a almacenamiento local / semillas (resiliencia offline y demos)
      const localMatch = lookupBooking(cleanCode, cleanEmail);
      if (localMatch) {
        setVoucher(localMatch);
        setError(null);
        setHasSearched(true);
        setIsLoading(false);
        return;
      }

      setVoucher(null);
      setHasSearched(true);
      setIsLoading(false);

      if (err instanceof ApiRequestError) {
        if (err.status === 404) {
          setError(
            `No encontramos ninguna reserva con el código "${cleanCode}" asociada al email "${cleanEmail}". Por favor verificá los datos ingresados.`,
          );
        } else if (err.status === 400) {
          setError('El código de reserva o el correo electrónico no tienen un formato válido.');
        } else {
          setError(err.message || 'Error al validar la reserva en el servidor oficial.');
        }
      } else if (err instanceof TypeError || (err instanceof Error && err.name === 'AbortError')) {
        setError(
          'No se pudo conectar con el servidor oficial para validar la reserva. Por favor verificá tu conexión e intentá de nuevo.',
        );
      } else {
        setError(
          `No encontramos reservas para el código "${cleanCode}" asociado al email "${cleanEmail}". Verificá los datos e intentá de nuevo.`,
        );
      }
    }
  }, []);

  // Carga automática si el código viene en query params de la URL (?code=...&email=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const initialCode = params.get('code');
    const initialEmail = params.get('email');

    if (initialCode) {
      const cleanCode = initialCode.trim().toUpperCase();
      const cleanEmail = initialEmail ? initialEmail.trim() : '';

      setCode(cleanCode);

      if (cleanEmail) {
        setEmail(cleanEmail);
        performLookup(cleanCode, cleanEmail);
      } else {
        // Solo vino el código: verificar si está en mocks o guiar al usuario
        const localMatch = lookupBooking(cleanCode);
        if (localMatch) {
          setVoucher(localMatch);
          setEmail(localMatch.email);
          setError(null);
          setHasSearched(true);
        } else {
          setError('Para consultar tu reserva en el sistema oficial, por favor ingresá el correo electrónico con el que realizaste la solicitud.');
          setHasSearched(true);
        }
      }
    }
  }, [performLookup]);

  // Formato del código al escribir
  const handleCodeChange = useCallback((val: string) => {
    setError(null);
    const cleaned = val.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    setCode(cleaned);
  }, []);

  const handleEmailChange = useCallback((val: string) => {
    setError(null);
    setEmail(val);
  }, []);

  // Búsqueda manual desde formulario
  const handleSearch = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      performLookup(code, email);
    },
    [code, email, performLookup],
  );

  const selectDemoCode = useCallback((demoCode: string) => {
    const clean = demoCode.trim().toUpperCase();
    setCode(clean);
    setError(null);
    const result = lookupBooking(clean);
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
