import React from 'react';
import { Star, Users, MapPin, Waves, Flame, Wifi, Coffee, Trees, Car, Check } from 'lucide-react';
import type { MapPlace } from '../../../data/mock-places';

interface AccommodationCardProps {
  place: MapPlace;
  nightsCount: number | null;
}

function getAmenityIcon(amenity: string) {
  const lower = amenity.toLowerCase();
  if (lower.includes('pileta') || lower.includes('piscina') || lower.includes('agua') || lower.includes('río')) {
    return <Waves className="w-3.5 h-3.5 text-primary-600 shrink-0" />;
  }
  if (lower.includes('asador') || lower.includes('parrilla') || lower.includes('leña')) {
    return <Flame className="w-3.5 h-3.5 text-terracotta-600 shrink-0" />;
  }
  if (lower.includes('wifi') || lower.includes('internet')) {
    return <Wifi className="w-3.5 h-3.5 text-stone-500 shrink-0" />;
  }
  if (lower.includes('desayuno') || lower.includes('vino') || lower.includes('cava')) {
    return <Coffee className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
  }
  if (lower.includes('parque') || lower.includes('jardín') || lower.includes('bosque')) {
    return <Trees className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
  }
  if (lower.includes('cochera') || lower.includes('estacionamiento')) {
    return <Car className="w-3.5 h-3.5 text-stone-600 shrink-0" />;
  }
  return <Check className="w-3.5 h-3.5 text-stone-500 shrink-0" />;
}

export const AccommodationCard: React.FC<AccommodationCardProps> = ({ place, nightsCount }) => {
  const price = place?.pricePerNight ?? 0;
  const formattedPrice = price.toLocaleString('es-AR');
  const totalPrice = nightsCount && nightsCount > 0 ? (price * nightsCount).toLocaleString('es-AR') : null;

  return (
    <article className="group bg-white rounded-3xl border border-stone-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-[460px] overflow-hidden">
      {/* Portada Fotográfica Fija y Calibrada (Inmune a Deformaciones) */}
      <div className="relative w-full h-56 overflow-hidden bg-stone-100 shrink-0">
        <img
          src={place?.imageUrl ?? '/placeholder-cabin.jpg'}
          alt={place?.title ?? 'Alojamiento en Capilla del Monte'}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          style={{ viewTransitionName: place?.id ? `accommodation-hero-${place.id}` : undefined }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/20 to-transparent" />

        {/* Badge de Puntuación */}
        <div className="absolute top-3 right-3 bg-stone-900/85 backdrop-blur-xs px-2.5 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{(place?.rating ?? 5.0).toFixed(1)}</span>
          <span className="text-stone-300 text-[10px] font-normal">({place?.reviewCount ?? 0})</span>
        </div>

        {/* Zona Geográfica y Capacidad */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
          <div className="flex items-center gap-1 drop-shadow-md">
            <MapPin className="w-3.5 h-3.5 text-sand-200 shrink-0" />
            <span className="truncate">{place?.zone ?? 'Capilla del Monte'}</span>
          </div>
          {place?.capacity && (
            <div className="flex items-center gap-1 drop-shadow-md text-[11px] bg-stone-950/50 px-2 py-0.5 rounded-md backdrop-blur-xs">
              <Users className="w-3 h-3 text-sand-200 shrink-0" />
              <span>{place.capacity}</span>
            </div>
          )}
        </div>
      </div>

      {/* Cuerpo de la Tarjeta con Altura Fija y Cero Eyebrows */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1">
          <h3 className="font-display font-extrabold text-lg sm:text-xl text-stone-900 group-hover:text-terracotta-600 transition-colors truncate h-7 flex items-center">
            {place?.title ?? 'Cabaña'}
          </h3>
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed h-10 overflow-hidden flex items-start">
            {place?.subtitle ?? place?.address ?? ''}
          </p>
        </div>

        {/* Amenities Funcionales */}
        <div className="h-7 flex items-center gap-1.5 overflow-hidden">
          {place?.amenities && place.amenities.length > 0 ? (
            place.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="text-[11px] font-medium text-stone-700 bg-stone-100 px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0 max-w-[150px] truncate"
              >
                {getAmenityIcon(amenity)}
                <span className="truncate">{amenity}</span>
              </span>
            ))
          ) : (
            <span className="text-[11px] text-stone-400">Consultar comodidades</span>
          )}
        </div>

        {/* Pricing y CTA Alineados */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3 min-h-[56px] mt-auto">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-black text-xl text-stone-900">${formattedPrice}</span>
              <span className="text-xs text-stone-500 font-medium">/ noche</span>
            </div>
            <div className="text-[11px] font-semibold text-terracotta-700 h-4">
              {totalPrice && nightsCount ? (
                `Total: $${totalPrice} (${nightsCount} ${nightsCount === 1 ? 'noche' : 'noches'})`
              ) : (
                <span className="text-stone-400 font-normal">Tarifa por noche</span>
              )}
            </div>
          </div>

          <a
            href={place?.ctaUrl ?? `/alojamientos/${place?.id}`}
            className="h-10 px-4 inline-flex items-center justify-center rounded-xl bg-terracotta-500 hover:bg-terracotta-600 active:bg-terracotta-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer select-none shrink-0"
          >
            Ver detalles →
          </a>
        </div>
      </div>
    </article>
  );
};
