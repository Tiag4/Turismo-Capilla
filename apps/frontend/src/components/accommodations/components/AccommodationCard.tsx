import React from 'react';
import { Star, CheckCircle2, Users, MapPin, Waves, Flame, Wifi, Sparkles } from 'lucide-react';
import type { MapPlace } from '../../../data/mock-places';

interface AccommodationCardProps {
  place: MapPlace;
  nightsCount: number | null;
}

export const AccommodationCard: React.FC<AccommodationCardProps> = ({ place, nightsCount }) => {
  const price = place?.pricePerNight ?? 0;
  const formattedPrice = price.toLocaleString('es-AR');
  const totalPrice = nightsCount && nightsCount > 0 ? (price * nightsCount).toLocaleString('es-AR') : null;

  return (
    <article className="group bg-white rounded-3xl border border-stone-200/90 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Portada Fotográfica */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <img
          src={place?.imageUrl ?? '/placeholder-cabin.jpg'}
          alt={place?.title ?? 'Alojamiento en Capilla del Monte'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-80" />

        {/* Badge de Verificación Municipal */}
        {place?.verified && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 border border-stone-100">
            <CheckCircle2 className="w-3.5 h-3.5 text-uritorco-600 shrink-0" />
            <span className="text-[11px] font-bold text-stone-900 tracking-tight">Prestador Habilitado</span>
          </div>
        )}

        {/* Badge de Puntuación */}
        <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{(place?.rating ?? 5.0).toFixed(1)}</span>
          <span className="text-stone-300 text-[10px] font-normal">({place?.reviewCount ?? 0})</span>
        </div>

        {/* Zona Geográfica en la imagen */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
          <div className="flex items-center gap-1 drop-shadow-md">
            <MapPin className="w-3.5 h-3.5 text-sand-200 shrink-0" />
            <span className="truncate">{place?.zone ?? 'Capilla del Monte'}</span>
          </div>
          {place?.capacity && (
            <div className="flex items-center gap-1 drop-shadow-md text-[11px] bg-stone-950/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
              <Users className="w-3 h-3 text-sand-200 shrink-0" />
              <span>{place.capacity}</span>
            </div>
          )}
        </div>
      </div>

      {/* Cuerpo de la Tarjeta */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-terracotta-700">
            {place?.category ?? 'Alojamiento'}
          </div>
          <h3 className="font-display font-extrabold text-lg sm:text-xl text-stone-900 group-hover:text-terracotta-600 transition-colors line-clamp-1">
            {place?.title ?? 'Cabaña'}
          </h3>
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {place?.subtitle ?? place?.address ?? ''}
          </p>
        </div>

        {/* Amenities destacadas */}
        {place?.amenities && place.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {place.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="text-[11px] font-medium text-stone-600 bg-stone-100/90 px-2.5 py-1 rounded-lg flex items-center gap-1"
              >
                {amenity.toLowerCase().includes('pileta') && <Waves className="w-3 h-3 text-primary-600 shrink-0" />}
                {amenity.toLowerCase().includes('asador') && <Flame className="w-3 h-3 text-terracotta-600 shrink-0" />}
                {amenity.toLowerCase().includes('wifi') && <Wifi className="w-3 h-3 text-stone-500 shrink-0" />}
                {!amenity.toLowerCase().includes('pileta') && !amenity.toLowerCase().includes('asador') && !amenity.toLowerCase().includes('wifi') && (
                  <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                )}
                <span>{amenity}</span>
              </span>
            ))}
          </div>
        )}

        {/* Pricing y Acción Directa */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-black text-xl text-stone-900">${formattedPrice}</span>
              <span className="text-xs text-stone-500 font-medium">/ noche</span>
            </div>
            {totalPrice && nightsCount && (
              <div className="text-[11px] font-semibold text-terracotta-700">
                Total: ${totalPrice} ({nightsCount} {nightsCount === 1 ? 'noche' : 'noches'})
              </div>
            )}
          </div>

          <a
            href={place?.ctaUrl ?? `/alojamientos/${place?.id}`}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 active:bg-terracotta-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer select-none shrink-0"
          >
            Ver detalles →
          </a>
        </div>
      </div>
    </article>
  );
};
