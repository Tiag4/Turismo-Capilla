import React, { useMemo } from 'react';
import type { MapPlace } from '../../../data/mock-places';
import { getAccommodationDetail } from './getAccommodationDetail';
import { useAccommodationBooking } from './hooks/useAccommodationBooking';
import { AccommodationGalleryBento } from './components/AccommodationGalleryBento';
import { AccommodationLeftCol } from './components/AccommodationLeftCol';
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
    <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-12 space-y-8 sm:space-y-10 pb-24 lg:pb-16">
      {/* Galería Asimétrica Bento de 5 Fotos fiel a la comp */}
      <AccommodationGalleryBento
        gallery={data.gallery}
        title={data.title}
        onOpenGallery={booking.openGallery}
      />

      {/* Grilla Directa a 3 Columnas Fiel a detail_comp_bento_1788830967288.jpg */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start w-full pt-2">
        {/* Columna 1: Info General, Badge y Bedroom */}
        <AccommodationLeftCol data={data} />

        {/* Columna 2: Bedroom y Clean Amenities (4x2) */}
        <AccommodationCenterCol />

        {/* Columna 3: Widget Sticky de Reserva y Cotización */}
        <AccommodationStickyWidget data={data} booking={booking} />
      </div>

      {/* Barra Inferior Fija para Móviles */}
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
