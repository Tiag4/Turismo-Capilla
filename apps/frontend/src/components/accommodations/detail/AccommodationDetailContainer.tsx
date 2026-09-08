import React, { useMemo } from 'react';
import type { MapPlace } from '../../../data/mock-places';
import { getAccommodationDetail } from './getAccommodationDetail';
import { useAccommodationBooking } from './hooks/useAccommodationBooking';
import { AccommodationGalleryBento } from './components/AccommodationGalleryBento';
import { AccommodationEditorialContent } from './components/AccommodationEditorialContent';
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
    <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-14 space-y-10 sm:space-y-12 pb-24 lg:pb-16">
      {/* Galería Asimétrica Bento de 5 Fotos fiel a la comp */}
      <AccommodationGalleryBento
        gallery={data.gallery}
        title={data.title}
        onOpenGallery={booking.openGallery}
      />

      {/* Estructura Idéntica a la Captura: Editorial Content (flex-1) + Sticky Widget (w-80/w-96) */}
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start w-full pt-2">
        {/* Columna Izquierda y Central (Editorial Content, Dormitorios y Clean Amenities) */}
        <div className="flex-1 w-full min-w-0">
          <AccommodationEditorialContent data={data} />
        </div>

        {/* Columna Derecha: Widget Sticky de Reserva y Cotización */}
        <div className="w-full lg:w-[380px] lg:shrink-0">
          <AccommodationStickyWidget data={data} booking={booking} />
        </div>
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
