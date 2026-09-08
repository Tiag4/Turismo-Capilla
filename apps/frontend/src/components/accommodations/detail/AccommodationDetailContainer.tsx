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
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 pb-24 lg:pb-12">
      {/* Galería Asimétrica Bento de 5 Fotos fiel a la comp */}
      <AccommodationGalleryBento
        gallery={data.gallery}
        title={data.title}
        onOpenGallery={booking.openGallery}
      />

      {/* Estructura Idéntica a la Captura: Editorial Content + Sticky Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-2">
        {/* Columna Izquierda y Central (Editorial Content, Dormitorios y Clean Amenities) */}
        <div className="lg:col-span-8">
          <AccommodationEditorialContent data={data} />
        </div>

        {/* Columna Derecha: Widget Sticky de Reserva y Cotización */}
        <div className="lg:col-span-4">
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
