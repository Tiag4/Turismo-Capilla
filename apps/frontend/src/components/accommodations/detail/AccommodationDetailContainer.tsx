import React, { useMemo } from 'react';
import type { MapPlace } from '../../../data/mock-places';
import { getAccommodationDetail } from './getAccommodationDetail';
import { useAccommodationBooking } from './hooks/useAccommodationBooking';
import { AccommodationHeaderInfo } from './components/AccommodationHeaderInfo';
import { AccommodationGalleryBento } from './components/AccommodationGalleryBento';
import { AccommodationHostAndRooms } from './components/AccommodationHostAndRooms';
import { AccommodationAmenitiesList } from './components/AccommodationAmenitiesList';
import { AccommodationRulesPolicies } from './components/AccommodationRulesPolicies';
import { AccommodationLocationSnippet } from './components/AccommodationLocationSnippet';
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
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 space-y-8 pb-24 lg:pb-12">
      {/* Cabecera y Navegación */}
      <AccommodationHeaderInfo data={data} />

      {/* Galería Asimétrica Bento de 5 Fotos */}
      <AccommodationGalleryBento
        gallery={data.gallery}
        title={data.title}
        onOpenGallery={booking.openGallery}
      />

      {/* Estructura a 2 Columnas (Opción 1: Bento & Sticky Checkout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-2">
        {/* Columna Izquierda (65%): Contenido, Habitaciones, Amenities, Normas y Mapa */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          <AccommodationHostAndRooms data={data} />
          <AccommodationAmenitiesList categories={data.amenityCategories} />
          <AccommodationRulesPolicies rules={data.rules} />
          <AccommodationLocationSnippet data={data} />
        </div>

        {/* Columna Derecha (35%): Widget Flotante Sticky de Reserva y Cotización */}
        <div className="hidden lg:block lg:col-span-5 xl:col-span-4">
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
