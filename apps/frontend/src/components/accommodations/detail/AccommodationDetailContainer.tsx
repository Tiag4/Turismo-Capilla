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
import { AccommodationBookingDrawer } from './components/AccommodationBookingModal';
import { AccommodationAmenitiesDrawer } from './components/AccommodationAmenitiesDrawer';

interface AccommodationDetailContainerProps {
  place: MapPlace;
}

export const AccommodationDetailContainer: React.FC<AccommodationDetailContainerProps> = ({ place }) => {
  const data = useMemo(() => getAccommodationDetail(place), [place]);
  const booking = useAccommodationBooking({ data });

  return (
    <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 lg:pt-12 space-y-6 sm:space-y-10 pb-24 lg:pb-16">
      {/* Mobile Title */}
      <div className="md:hidden">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-stone-900 tracking-tight leading-tight">
          {data.title}
        </h1>
      </div>

      {/* Gallery Bento / Carousel */}
      <AccommodationGalleryBento
        id={data.id}
        gallery={data.gallery}
        title={data.title}
        onOpenGallery={booking.openGallery}
      />

      {/* Mobile (< 768px): Jerarquía requerida */}
      <div className="md:hidden space-y-8 pt-2">
        <div ref={booking.cardObserverRef}>
          <AccommodationStickyWidget data={data} booking={booking} />
        </div>
        <AccommodationCenterCol onOpenAmenities={booking.openAmenities} />
        <AccommodationDescription description={data.fullDescription} />
      </div>

      {/* Desktop (>= 768px): Grilla Fija 3 Columnas */}
      <div className="hidden md:grid detail-bento-grid pt-2">
        <AccommodationLeftCol data={data} />
        <AccommodationCenterCol onOpenAmenities={booking.openAmenities} />
        <AccommodationStickyWidget data={data} booking={booking} />
      </div>

      {/* Bottom Dock Móvil */}
      <AccommodationMobileBottomDock
        data={data}
        nightsCount={booking.nightsCount}
        totalPrice={booking.totalPrice}
        onOpenBookingModal={booking.openBookingModal}
        isVisible={!booking.isReservationCardVisible}
      />

      {/* Overlays / Modals */}
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

      {booking.isBookingModalOpen && (
        <AccommodationBookingDrawer
          isOpen={booking.isBookingModalOpen}
          onClose={booking.closeBookingModal}
          data={data}
          booking={booking}
        />
      )}

      {booking.isAmenitiesOpen && (
        <AccommodationAmenitiesDrawer
          isOpen={booking.isAmenitiesOpen}
          onClose={booking.closeAmenities}
          title={data.title}
        />
      )}
    </div>
  );
};
