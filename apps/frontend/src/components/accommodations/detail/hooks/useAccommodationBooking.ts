import { useState, useMemo, useCallback } from 'react';
import type { AccommodationDetailData } from '../types';

interface UseAccommodationBookingProps {
  data: AccommodationDetailData;
}

export function useAccommodationBooking({ data }: UseAccommodationBookingProps) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');

  // Lightbox Gallery state
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Booking Modal & Request state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Calculate nights count
  const nightsCount = useMemo(() => {
    if (!checkIn || !checkOut) return null;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : null;
  }, [checkIn, checkOut]);

  // Calculate total price and deposit
  const baseRate = data?.pricePerNight ?? 0;
  const totalPrice = useMemo(() => {
    if (!nightsCount || nightsCount <= 0) return null;
    return nightsCount * baseRate;
  }, [nightsCount, baseRate]);

  const depositRequired = useMemo(() => {
    if (!totalPrice) return null;
    return Math.round(totalPrice * (data.depositPercent / 100));
  }, [totalPrice, data.depositPercent]);

  // Gallery handlers
  const openGallery = useCallback((index = 0) => {
    setActivePhotoIndex(index);
    setIsGalleryOpen(true);
  }, []);

  const closeGallery = useCallback(() => {
    setIsGalleryOpen(false);
  }, []);

  const nextPhoto = useCallback(() => {
    setActivePhotoIndex((prev) => (prev + 1) % data.gallery.length);
  }, [data.gallery.length]);

  const prevPhoto = useCallback(() => {
    setActivePhotoIndex((prev) => (prev - 1 + data.gallery.length) % data.gallery.length);
  }, [data.gallery.length]);

  // Booking Modal handlers
  const openBookingModal = useCallback(() => {
    setIsBookingModalOpen(true);
  }, []);

  const closeBookingModal = useCallback(() => {
    setIsBookingModalOpen(false);
  }, []);

  // WhatsApp link generation
  const whatsappUrl = useMemo(() => {
    const datesText = checkIn && checkOut ? ` del ${checkIn} al ${checkOut} (${nightsCount ?? 0} noches)` : '';
    const msg = `Hola! Vengo desde Turismo Capilla del Monte oficial. Me gustaría consultar disponibilidad para *${data.title}*${datesText} para *${guests} personas*.`;
    return `https://wa.me/5493548000000?text=${encodeURIComponent(msg)}`;
  }, [data.title, checkIn, checkOut, nightsCount, guests]);

  // Form submission
  const handleSubmitBooking = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!guestName || !guestPhone) return;

      setIsSubmitting(true);
      // Simulate direct booking request dispatch
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSubmitting(false);
      setIsSuccess(true);
    },
    [guestName, guestPhone]
  );

  return {
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    guests,
    setGuests,
    nightsCount,
    totalPrice,
    depositRequired,
    isGalleryOpen,
    activePhotoIndex,
    openGallery,
    closeGallery,
    nextPhoto,
    prevPhoto,
    isBookingModalOpen,
    openBookingModal,
    closeBookingModal,
    guestName,
    setGuestName,
    guestEmail,
    setGuestEmail,
    guestPhone,
    setGuestPhone,
    isSubmitting,
    isSuccess,
    handleSubmitBooking,
    whatsappUrl,
  };
}

export type UseAccommodationBookingReturn = ReturnType<typeof useAccommodationBooking>;
