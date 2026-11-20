import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_PLACES, type MapPlace } from '../../data/mock-places';
import { api } from '../../services/api';
import { mapApiToAttractionItem } from '../attractions/mappers/attractionMapper';

function getFallbackAttractions(): MapPlace[] {
  const featured = MOCK_PLACES.filter((p) => p.type === 'attraction');
  const ids = ['att-2', 'att-4', 'att-5', 'att-3', 'att-7', 'att-8'];
  const ordered = ids
    .map((id) => featured.find((p) => p.id === id))
    .filter((p): p is MapPlace => Boolean(p));
  return ordered.length >= 6 ? ordered : featured.slice(0, 6);
}

export const FeaturedAttractionsSection: React.FC = () => {
  const [attractions, setAttractions] = useState<MapPlace[]>(() => getFallbackAttractions());

  useEffect(() => {
    let active = true;
    api
      .getAttractions()
      .then((apiItems) => {
        if (!active || !Array.isArray(apiItems) || apiItems.length === 0) return;

        // Sort featured attractions first to honor Dashboard CMS selection
        const sorted = [...apiItems].sort((a, b) => Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured)));
        const mapped: MapPlace[] = sorted.slice(0, 6).map((item) => {
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
            duration: detail.trailSpecs?.estimatedDuration || '1 a 2 horas',
            difficulty: detail.difficulty,
            ctaUrl: `/atractivos/${detail.slug || detail.id}`,
          };
        });

        if (mapped.length > 0) {
          setAttractions(mapped);
        }
      })
      .catch(() => {
        // Keep static fallback if backend is unreachable
      });

    return () => {
      active = false;
    };
  }, []);

  const [terrones, elCajon, laToma, elZapato, losMogotes, calleTechada] = attractions;

  return (
    <section className="py-16 sm:py-24 bg-sand-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-2xl">
            <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-sand-900 tracking-tight leading-tight">
              Hay mucho por descubrir.
            </h2>
            <p className="mt-3 text-base sm:text-lg text-sand-600 font-normal">
              Naturaleza milenaria, cañadones rojizos y rincones secretos que vas a querer explorar.
            </p>
          </div>
          <Link
            to="/atractivos"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700 group cursor-pointer"
          >
            <span>Ver todos los paseos catalogados</span>
            <span className="group-hover:translate-x-1.5 transition-transform">→</span>
          </Link>
        </div>

        {/* Grilla Bento */}
        <div className="space-y-6 gsap-discover-grid">
          {/* Fila 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {terrones && (
              <Link
                to={terrones.ctaUrl}
                className="gsap-discover-card lg:col-span-7 group relative min-h-[460px] sm:min-h-[520px] lg:h-[580px] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-end p-8 sm:p-12 border border-sand-200/80 cursor-pointer"
              >
                <img
                  src={terrones.imageUrl}
                  alt={terrones.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-95 contrast-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent" />

                <div className="relative z-10 space-y-3">
                  <h3 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-tight drop-shadow-sm">
                    {terrones.title}
                  </h3>
                  <p className="text-sm sm:text-base text-sand-100/90 font-normal leading-relaxed max-w-xl line-clamp-2">
                    {terrones.subtitle}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-sand-200 font-medium">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-sand-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m3 11 19-9-9 19-2-8-8-2z" />
                      </svg>
                      <span>{terrones.distanceFromCenter}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-sand-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>{terrones.duration}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-sand-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
                      </svg>
                      <span>Dificultad {terrones.difficulty?.toLowerCase()}</span>
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Columna Lateral Apilada */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {elCajon && (
                <Link
                  to={elCajon.ctaUrl}
                  className="gsap-discover-card flex-1 group relative min-h-[260px] lg:h-[278px] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-end p-6 sm:p-8 border border-sand-200/80 cursor-pointer"
                >
                  <img
                    src={elCajon.imageUrl}
                    alt={elCajon.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-95 contrast-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent" />

                  <div className="relative z-10 space-y-1.5">
                    <h3 className="font-display font-black text-2xl sm:text-3xl text-white leading-tight drop-shadow-sm">
                      {elCajon.title}
                    </h3>
                    <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-sand-200 font-medium">
                      <span>{elCajon.distanceFromCenter}</span>
                      <span>•</span>
                      <span>{elCajon.duration}</span>
                    </div>
                  </div>
                </Link>
              )}

              {laToma && (
                <Link
                  to={laToma.ctaUrl}
                  className="gsap-discover-card flex-1 group relative min-h-[260px] lg:h-[278px] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-end p-6 sm:p-8 border border-sand-200/80 cursor-pointer"
                >
                  <img
                    src={laToma.imageUrl}
                    alt={laToma.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-95 contrast-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent" />

                  <div className="relative z-10 space-y-1.5">
                    <h3 className="font-display font-black text-2xl sm:text-3xl text-white leading-tight drop-shadow-sm">
                      {laToma.title}
                    </h3>
                    <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-sand-200 font-medium">
                      <span>{laToma.distanceFromCenter}</span>
                      <span>•</span>
                      <span>{laToma.duration}</span>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* Fila 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[elZapato, losMogotes, calleTechada].filter(Boolean).map((item) => (
              <Link
                key={item.id}
                to={item.ctaUrl}
                className="gsap-discover-card group relative h-[320px] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-end p-6 sm:p-8 border border-sand-200/80 cursor-pointer"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-95 contrast-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent" />

                <div className="relative z-10 space-y-1.5">
                  <h3 className="font-display font-black text-2xl text-white leading-snug drop-shadow-sm">
                    {item.title}
                  </h3>
                  <p className="text-xs text-sand-200 line-clamp-1 font-normal">
                    {item.subtitle}
                  </p>
                  <div className="pt-1 flex items-center gap-3 text-xs text-sand-200 font-medium">
                    <span>{item.distanceFromCenter}</span>
                    <span>•</span>
                    <span>{item.duration}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
