import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { MOCK_PLACES, type MapPlace } from '../../data/mock-places';
import { api, type Accommodation } from '../../services/api';

const TYPE_MAP: Record<string, string> = {
  CABIN: 'Cabaña de Montaña',
  HOTEL: 'Hotel Serrano',
  APARTMENT: 'Departamento',
  HOSTEL: 'Hostería',
  CAMPING: 'Camping & Glamping',
};

function mapApiToPlace(item: Accommodation): MapPlace {
  const price = typeof item.pricePerNight === 'string' ? parseFloat(item.pricePerNight) : item.pricePerNight;
  const mainImage =
    item.images?.find((img) => img.isMain)?.url ||
    item.images?.[0]?.url ||
    '/images/accommodations/el-aguaribay/el-aguaribay-01.jpg';

  return {
    id: item.id,
    type: 'accommodation',
    title: item.name,
    subtitle: item.description,
    category: TYPE_MAP[item.type] || 'Alojamiento',
    lat: item.latitude ?? -30.857,
    lng: item.longitude ?? -64.515,
    pricePerNight: isNaN(price) ? 85000 : price,
    rating: 4.9,
    reviewCount: 20,
    imageUrl: mainImage,
    galleryImages: item.images?.map((img) => img.url),
    address: item.address,
    verified: item.isActive,
    hasBreakfast: item.hasBreakfast ?? item.amenities?.some((a) => a.toLowerCase().includes('desayuno')),
    isFeatured: Boolean(item.isFeatured),
    amenities: item.amenities ?? [],
    capacity: `Hasta ${item.maxGuests} personas`,
    zone: item.locality || 'Capilla del Monte',
    licenseNumber: item.licenseNumber || undefined,
    ctaUrl: `/alojamientos/${item.id}`,
  };
}

export const FeaturedCabinsSection: React.FC = () => {
  const [cabins, setCabins] = useState<MapPlace[]>(() => {
    const accommodations = MOCK_PLACES.filter((p) => p.type === 'accommodation');
    const featured = accommodations.filter((p) => p.isFeatured);
    return featured.length > 0 ? featured : accommodations.slice(0, 4);
  });
  const [totalCatalogCount, setTotalCatalogCount] = useState<number>(() =>
    MOCK_PLACES.filter((p) => p.type === 'accommodation').length
  );

  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  // Activamos el carrusel únicamente cuando hay más de 4 cabañas destacadas
  const isCarousel = cabins.length > 4;

  const checkScrollability = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollPrev(scrollLeft > 10);
    setCanScrollNext(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el || !isCarousel) return;
    checkScrollability();
    el.addEventListener('scroll', checkScrollability, { passive: true });
    window.addEventListener('resize', checkScrollability);
    return () => {
      el.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
    };
  }, [isCarousel, cabins.length, checkScrollability]);

  const handleScroll = (direction: 'prev' | 'next') => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const firstArticle = container.querySelector('article');
    const scrollAmount = firstArticle ? firstArticle.clientWidth + 28 : 360;
    container.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    let isMounted = true;
    api
      .getAccommodations()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const mapped = data.map(mapApiToPlace);
          setTotalCatalogCount(mapped.length);
          const featured = mapped.filter((item) => item.isFeatured);
          // Si hay alojamientos destacados manualmente por la administración, mostramos exclusivamente esos.
          setCabins(featured.length > 0 ? featured : mapped.slice(0, 4));
        }
      })
      .catch((err) => {
        console.warn('Usando catálogo local para cabañas destacadas:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const renderCabinCard = (cabin: MapPlace, idx: number) => (
    <article
      key={cabin.id}
      className={`gsap-cabin-card bg-white rounded-3xl border border-sand-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-shadow duration-300 flex flex-col group ${
        isCarousel
          ? 'snap-start shrink-0 w-[85%] sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.2rem)] xl:w-[calc(25%-1.35rem)]'
          : ''
      }`}
    >
      <div className="relative h-60 w-full overflow-hidden bg-sand-200">
        <img
          src={cabin.imageUrl}
          alt={cabin.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {cabin.isFeatured && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/95 backdrop-blur-xs text-sand-950 text-xs font-black tracking-wide shadow-md border border-amber-300">
              <Star className="w-3.5 h-3.5 fill-current text-sand-950" />
              <span>Destacado</span>
            </span>
          </div>
        )}
        <div className="absolute bottom-3 left-4 text-white">
          <span className="text-xs text-sand-200 font-medium block">
            {cabin.category} · {cabin.zone}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-display font-bold text-xl text-sand-900 group-hover:text-primary-600 transition-colors leading-snug">
            {cabin.title}
          </h3>
          <p className="text-xs text-sand-600 line-clamp-2 leading-relaxed">
            {cabin.subtitle}
          </p>

          {cabin.capacity && (
            <p className="text-xs font-semibold text-sand-800">
              Capacidad: {cabin.capacity}
            </p>
          )}

          {cabin.amenities && (
            <p className="text-xs text-sand-500 line-clamp-1 pt-1">
              {cabin.amenities.join(' · ')}
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-sand-100 flex items-end justify-between">
          <div>
            <span className="text-xs text-emerald-portal-700 font-medium block mb-0.5">
              {cabin.licenseNumber ? `Habilitación ${cabin.licenseNumber}` : `Habilitación Municipal Nº ${140 + idx}`}
            </span>
            <span className="text-[11px] text-sand-500 block">Por noche desde</span>
            <span className="text-xl font-black text-sand-900">
              ${(cabin.pricePerNight ?? 0).toLocaleString('es-AR')}
            </span>
          </div>
          <Link
            to={cabin.ctaUrl}
            className="px-4 py-2.5 rounded-xl bg-sand-900 hover:bg-primary-600 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Consultar →
          </Link>
        </div>
      </div>
    </article>
  );

  return (
    <section className="py-16 sm:py-24 bg-sand-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div className="max-w-xl">
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-sand-900 tracking-tight">
              Cabañas y Posadas del Valle
            </h2>
            <p className="mt-3 text-base text-sand-700 leading-relaxed font-normal">
              Establecimientos formalmente inspeccionados por la Cámara de Turismo, con habilitación vigente y contacto directo.
            </p>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 self-start md:self-end">
            <Link
              to="/alojamientos"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700 group"
            >
              <span>Ver catálogo completo ({totalCatalogCount})</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>

            {/* Botones de navegación del carrusel: sólo visibles cuando hay más de 4 cabañas */}
            {isCarousel && (
              <div className="flex items-center gap-2 border-l border-sand-300 pl-4 sm:pl-6">
                <button
                  type="button"
                  onClick={() => handleScroll('prev')}
                  disabled={!canScrollPrev}
                  className="w-10 h-10 rounded-full border border-sand-300 bg-white flex items-center justify-center text-sand-800 hover:bg-sand-100 hover:border-sand-400 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xs cursor-pointer"
                  title="Ver establecimientos anteriores"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleScroll('next')}
                  disabled={!canScrollNext}
                  className="w-10 h-10 rounded-full border border-sand-300 bg-white flex items-center justify-center text-sand-800 hover:bg-sand-100 hover:border-sand-400 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xs cursor-pointer"
                  title="Ver más establecimientos destacados"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {isCarousel ? (
          <div
            ref={carouselRef}
            className="flex gap-7 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden gsap-cabins-grid"
          >
            {cabins.map((cabin, idx) => renderCabinCard(cabin, idx))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 gsap-cabins-grid">
            {cabins.map((cabin, idx) => renderCabinCard(cabin, idx))}
          </div>
        )}
      </div>
    </section>
  );
};
