import React, { useMemo } from 'react';
import type { MapPlace } from '../../../data/mock-places';
import { getAccommodationDetail } from './getAccommodationDetail';
import { useAccommodationBooking } from './hooks/useAccommodationBooking';
import { AccommodationGalleryBento } from './components/AccommodationGalleryBento';
import { AccommodationLeftCol, AccommodationDescription } from './components/AccommodationLeftCol';
import { AccommodationCenterCol } from './components/AccommodationCenterCol';
import { AccommodationStickyWidget } from './components/AccommodationStickyWidget';
import { AccommodationMobileBottomDock } from './components/AccommodationMobileBottomDock';
import { AccommodationGalleryModal } from './components/AccommodationGalleryModal';
import { AccommodationBookingModal } from './components/AccommodationBookingModal';

interface AccommodationDetailContainerProps {
  place: MapPlace;
}

export const AccommodationDetailContainer: React.FC<AccommodationDetailContainerProps> = ({ place }) => {
  const data = useMemo(() => getAccommodationDetail(place), [place]);
  const booking = useAccommodationBooking({ data });

  return (
    <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 lg:pt-12 space-y-6 sm:space-y-10 pb-24 lg:pb-16">
      {/* 1. Mobile Only: Nombre del Alojamiento arriba de las fotos */}
      <div className="md:hidden">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-stone-900 tracking-tight leading-tight">
          {data.title}
        </h1>
      </div>

      {/* 2. Fotos: Carrusel táctil en Mobile / Bento 5 Fotos en Desktop */}
      <AccommodationGalleryBento
        gallery={data.gallery}
        title={data.title}
        onOpenGallery={booking.openGallery}
      />

      {/* Versión Mobile (< 768px): Jerarquía estricta según requerimiento */}
      <div className="md:hidden space-y-8 pt-2">
        {/* 3. Sacar la reserva */}
        <AccommodationStickyWidget data={data} booking={booking} />

        {/* 4. Servicios (Clean Amenities) */}
        <AccommodationCenterCol />

        {/* 5. Descripción completa */}
        <AccommodationDescription description={data.fullDescription} />
      </div>

      {/* Versión Desktop (>= 768px): Grilla Fija a 3 Columnas fiel a comp original */}
      <div className="hidden md:grid detail-bento-grid pt-2">
        {/* Columna 1: Nombre y Descripción */}
        <AccommodationLeftCol data={data} />

        {/* Columna 2: Bedroom y Clean Amenities */}
        <AccommodationCenterCol />

        {/* Columna 3: Formulario para pagar (Sticky Widget) */}
        <AccommodationStickyWidget data={data} booking={booking} />
      </div>

      {/* Barra Inferior Fija para Móviles (Bottom Dock CRO) */}
      <AccommodationMobileBottomDock
        data={data}
        nightsCount={booking.nightsCount}
        totalPrice={booking.totalPrice}
        onOpenBookingModal={booking.openBookingModal}
      />

      {/* Modal Lightbox de Galería Fotográfica */}
      {booking.isGalleryOpen && (
        <AccommodationGalleryModal
          isOpen={booking.isGalleryOpen}
          onClose={booking.closeGallery}
          gallery={data.gallery}
          activeIndex={booking.activePhotoIndex}
          onSelectIndex={booking.openGallery}
          onNext={booking.nextPhoto}
          onPrev={booking.prevPhoto}
          title={data.title}
        />
      )}

      {/* Modal de Solicitud de Reserva Directa */}
      {booking.isBookingModalOpen && (
        <AccommodationBookingModal
          isOpen={booking.isBookingModalOpen}
          onClose={booking.closeBookingModal}
          data={data}
          booking={booking}
        />
      )}
    </div>
  );
};
