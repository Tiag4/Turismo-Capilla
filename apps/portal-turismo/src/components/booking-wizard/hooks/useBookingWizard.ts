import { useState, useMemo, useCallback, useEffect } from 'react';
import type { AccommodationDetailData } from '../../accommodations/detail/types';
import { api } from '../../../services/api';

export interface BookingWizardState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  wantsWhatsappUpdates: boolean;
  bookingFor: 'self' | 'someone_else';
  isWorkTrip: boolean;
  extraBreakfast: boolean;
  extraExcursion: boolean;
  specialRequests: string;
  estimatedArrival: string;
  promoCode: string;
  discountPercent: number;
  acceptedTerms: boolean;
}

export function useBookingWizard(data: AccommodationDetailData) {
  // Read initial query params from URL safely in client and SSR
  const [initialParams, setInitialParams] = useState({
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0,
    childAges: [] as (number | null)[],
    rooms: 1,
    roomSelection: '',
    nightlyRate: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const checkIn = params.get('checkIn') || '';
    const checkOut = params.get('checkOut') || '';
    const adults = Math.max(1, Number(params.get('adults')) || 2);
    const children = Math.max(0, Number(params.get('children')) || 0);
    const childAges = params.get('childAges')
      ? params.get('childAges')!.split(',').map((s) => (s ? Number(s) : null))
      : [];
    const rooms = Math.max(1, Number(params.get('rooms')) || 1);
    const roomSelection = params.get('roomSelection') || '';
    const nightlyRate = Math.max(0, Number(params.get('nightlyRate')) || 0);
    setInitialParams({ checkIn, checkOut, adults, children, childAges, rooms, roomSelection, nightlyRate });
  }, []);

  const [step, setStep] = useState<2 | 3 | 'success'>(2);
  const [form, setForm] = useState<BookingWizardState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'Argentina',
    wantsWhatsappUpdates: false,
    bookingFor: 'self',
    isWorkTrip: false,
    extraBreakfast: false,
    extraExcursion: false,
    specialRequests: '',
    estimatedArrival: 'No lo sé aún',
    promoCode: '',
    discountPercent: 0,
    acceptedTerms: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingCode, setBookingCode] = useState<string>('');

  const updateField = useCallback(<K extends keyof BookingWizardState>(key: K, val: BookingWizardState[K]) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  }, []);

  // Pricing calculations
  const baseRate = initialParams.nightlyRate > 0 ? initialParams.nightlyRate : (data.pricePerNight ?? 0);
  const nightsCount = useMemo(() => {
    if (!initialParams.checkIn || !initialParams.checkOut) return 1;
    const diff = new Date(initialParams.checkOut).getTime() - new Date(initialParams.checkIn).getTime();
    const d = Math.round(diff / (1000 * 60 * 60 * 24));
    return d > 0 ? d : 1;
  }, [initialParams.checkIn, initialParams.checkOut]);

  const rawTotal = nightsCount * baseRate;
  const discountAmount = Math.round(rawTotal * (form.discountPercent / 100));
  const finalPrice = Math.max(0, rawTotal - discountAmount);

  const downPaymentPercentage = data.downPaymentPercentage ?? data.depositPercent ?? 50;
  const downPaymentAmount = Math.round(finalPrice * (downPaymentPercentage / 100));
  const remainingBalance = Math.max(0, finalPrice - downPaymentAmount);

  // Apply promo code
  const applyPromoCode = useCallback(() => {
    if (form.promoCode.trim().toUpperCase() === 'CAPILLA10') {
      updateField('discountPercent', 10);
      return { success: true, msg: '¡Cupón del 10% aplicado con éxito!' };
    }
    return { success: false, msg: 'Código promocional no válido' };
  }, [form.promoCode, updateField]);

  // Step 2 validation
  const validateStep2 = useCallback(() => {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = 'Ingresá tu nombre';
    if (!form.lastName.trim()) errs.lastName = 'Ingresá tu apellido';
    if (!form.email.trim() || !form.email.includes('@')) errs.email = 'Ingresá un email válido';
    if (!form.phone.trim()) errs.phone = 'Ingresá tu número de teléfono';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form.firstName, form.lastName, form.email, form.phone]);

  const goToStep3 = useCallback(() => {
    if (validateStep2()) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [validateStep2]);

  const goToStep2 = useCallback(() => {
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Complete booking
  const completeBooking = useCallback(async () => {
    if (!form.acceptedTerms) {
      setErrors((prev) => ({ ...prev, terms: 'Debés aceptar las condiciones' }));
      return;
    }
    setIsSubmitting(true);
    let finalCode = `CAP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const payload = {
        accommodationId: data.id,
        checkIn: initialParams.checkIn,
        checkOut: initialParams.checkOut,
        guestCount: initialParams.adults + initialParams.children,
        guestName: `${form.firstName} ${form.lastName}`.trim(),
        guestEmail: form.email,
        guestPhone: form.phone,
        guestOrigin: form.country,
        notes: form.specialRequests,
      };
      const apiResult = await api.createBooking(payload);
      if (apiResult?.bookingCode) {
        finalCode = apiResult.bookingCode;
      }
    } catch (apiErr) {
      console.warn('Backend offline o simulación: guardando reserva localmente', apiErr);
    }

    setBookingCode(finalCode);

    // Save to localStorage for instant voucher lookup
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('capilla_bookings') || '[]');
        const newRecord = {
          code: finalCode,
          accommodationId: data.id,
          accommodationTitle: data.title,
          accommodationZone: data.zone,
          accommodationAddress: data.address,
          accommodationImage: (data.gallery && data.gallery.length > 0) ? data.gallery[0] : (data.imageUrl || ''),
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          checkIn: initialParams.checkIn,
          checkOut: initialParams.checkOut,
          nightsCount,
          adults: initialParams.adults,
          children: initialParams.children,
          childAges: initialParams.childAges,
          rooms: initialParams.rooms,
          finalPrice,
          downPaymentPercentage,
          downPaymentAmount,
          remainingBalance,
          bankAccountHolder: data.bankAccountHolder || 'Administración Cabañas Capilla',
          bankCbu: data.bankCbu || '0110485530048500123456',
          bankAlias: data.bankAlias || 'CAPILLA.RESERVA.OFICIAL',
          bankName: data.bankName || 'Banco de la Nación Argentina',
          status: 'PENDING_CONFIRMATION',
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem('capilla_bookings', JSON.stringify([newRecord, ...stored]));
      } catch (e) {
        console.warn('Could not cache booking locally', e);
      }
    }

    setIsSubmitting(false);
    setStep('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [form, data, initialParams, nightsCount, finalPrice, downPaymentPercentage, downPaymentAmount, remainingBalance]);

  const whatsappUrl = useMemo(() => {
    const msg = `Hola! Quiero confirmar mi solicitud de reserva oficial *${bookingCode}* para *${data.title}* a nombre de *${form.firstName} ${form.lastName}*. Total: $${finalPrice.toLocaleString('es-AR')} ARS (Seña: $${downPaymentAmount.toLocaleString('es-AR')} ARS).`;
    return `https://wa.me/5493548000000?text=${encodeURIComponent(msg)}`;
  }, [bookingCode, data.title, form.firstName, form.lastName, finalPrice, downPaymentAmount]);

  return {
    step,
    form,
    updateField,
    errors,
    initialParams,
    nightsCount,
    rawTotal,
    finalPrice,
    downPaymentPercentage,
    downPaymentAmount,
    remainingBalance,
    discountAmount,
    applyPromoCode,
    goToStep3,
    goToStep2,
    completeBooking,
    isSubmitting,
    bookingCode,
    whatsappUrl,
  };
}

export type UseBookingWizardReturn = ReturnType<typeof useBookingWizard>;
