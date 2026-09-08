import { useState, useMemo, useCallback, useEffect } from 'react';
import type { AccommodationDetailData } from '../../accommodations/detail/types';

export interface BookingWizardState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  wantsWhatsappUpdates: boolean;
  bookingFor: 'self' | 'other';
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
    setInitialParams({ checkIn, checkOut, adults, children, childAges, rooms });
  }, []);

  const [step, setStep] = useState<2 | 3 | 'success'>(2);
  const [form, setForm] = useState<BookingWizardState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'Argentina',
    wantsWhatsappUpdates: true,
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
  const baseRate = data.pricePerNight ?? 0;
  const nightsCount = useMemo(() => {
    if (!initialParams.checkIn || !initialParams.checkOut) return 1;
    const diff = new Date(initialParams.checkOut).getTime() - new Date(initialParams.checkIn).getTime();
    const d = Math.round(diff / (1000 * 60 * 60 * 24));
    return d > 0 ? d : 1;
  }, [initialParams.checkIn, initialParams.checkOut]);

  const rawTotal = nightsCount * baseRate;
  const discountAmount = Math.round(rawTotal * (form.discountPercent / 100));
  const finalPrice = Math.max(0, rawTotal - discountAmount);

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
    await new Promise((res) => setTimeout(res, 900));
    const randomCode = `CAP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingCode(randomCode);
    setIsSubmitting(false);
    setStep('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [form.acceptedTerms]);

  const whatsappUrl = useMemo(() => {
    const msg = `Hola! Quiero confirmar mi solicitud de reserva oficial *${bookingCode}* para *${data.title}* a nombre de *${form.firstName} ${form.lastName}*. Total: $${finalPrice.toLocaleString('es-AR')} ARS.`;
    return `https://wa.me/5493548000000?text=${encodeURIComponent(msg)}`;
  }, [bookingCode, data.title, form.firstName, form.lastName, finalPrice]);

  return {
    step,
    form,
    updateField,
    errors,
    initialParams,
    nightsCount,
    rawTotal,
    finalPrice,
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
