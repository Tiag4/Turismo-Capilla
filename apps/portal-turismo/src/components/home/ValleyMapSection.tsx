import React, { useEffect, useState } from 'react';
import { InteractiveMapContainer } from '../map/InteractiveMapContainer';
import { MOCK_PLACES, type MapPlace } from '../../data/mock-places';
import { api } from '../../services/api';
import { mapApiToAttractionItem } from '../attractions/mappers/attractionMapper';

export const ValleyMapSection: React.FC = () => {
  const [places, setPlaces] = useState<MapPlace[]>(MOCK_PLACES);

  useEffect(() => {
    let active = true;
    Promise.allSettled([api.getAccommodations(), api.getAttractions()]).then(([accRes, attRes]) => {
      if (!active) return;

      const realAccommodations: MapPlace[] =
        accRes.status === 'fulfilled' && Array.isArray(accRes.value)
          ? accRes.value.map((item) => {
              const price = typeof item.pricePerNight === 'string' ? parseFloat(item.pricePerNight) : item.pricePerNight;
              return {
                id: item.id,
                type: 'accommodation',
                title: item.name,
                subtitle: item.description,
                category: item.type || 'Alojamiento',
                lat: item.latitude ?? -30.857,
                lng: item.longitude ?? -64.515,
                pricePerNight: isNaN(price) ? undefined : price,
                rating: 4.9,
                reviewCount: 0,
                imageUrl:
                  item.images?.find((img) => img.isMain)?.url ||
                  item.images?.[0]?.url ||
                  '/images/accommodations/el-aguaribay/el-aguaribay-01.jpg',
                address: item.address,
                verified: item.isActive,
                isFeatured: Boolean(item.isFeatured),
                zone: item.locality || 'Capilla del Monte',
                ctaUrl: `/alojamientos/${item.id}`,
              };
            })
          : [];

      const realAttractions: MapPlace[] =
        attRes.status === 'fulfilled' && Array.isArray(attRes.value)
          ? attRes.value.map((item) => {
              const detail = mapApiToAttractionItem(item);
              return {
                id: detail.id,
                type: 'attraction',
                title: detail.title,
                subtitle: detail.subtitle,
                category: detail.categoryLabel,
                lat: detail.coordinates.lat,
                lng: detail.coordinates.lng,
                rating: detail.rating,
                reviewCount: detail.reviewCount,
                imageUrl: detail.coverImage,
                address: detail.address,
                verified: true,
                isFeatured: Boolean(item.isFeatured),
                distanceFromCenter: detail.distanceFromCenter,
                duration: detail.trailSpecs?.estimatedDuration,
                difficulty: detail.difficulty,
                ctaUrl: `/atractivos/${detail.slug || detail.id}`,
              };
            })
          : [];

      const merged = [
        ...(realAccommodations.length > 0 ? realAccommodations : MOCK_PLACES.filter((p) => p.type === 'accommodation')),
        ...(realAttractions.length > 0 ? realAttractions : MOCK_PLACES.filter((p) => p.type === 'attraction')),
      ];

      if (merged.length > 0) {
        setPlaces(merged);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const accommodationCount = places.filter((p) => p.type === 'accommodation').length;
  const attractionCount = places.filter((p) => p.type === 'attraction').length;

  return (
    <section id="mapa-valle" className="py-16 sm:py-24 bg-sand-100/70">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div className="max-w-2xl">
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-sand-900 tracking-tight">
              Explorá el Valle en el Mapa
            </h2>
            <p className="mt-3 text-base text-sand-700 leading-relaxed font-normal">
              Ubicá cabañas habilitadas, senderos al Uritorco, balnearios y diques. Hacé zoom o click en cualquier punto para ver tarifas y distancias reales.
            </p>
          </div>

          <div className="mt-4 md:mt-0 text-xs font-medium text-sand-600">
            {accommodationCount} alojamientos verificados y {attractionCount} paseos geolocalizados
          </div>
        </div>

        <div className="gsap-map-container">
          <InteractiveMapContainer places={places} />
        </div>
      </div>
    </section>
  );
};
