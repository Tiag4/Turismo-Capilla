import React from 'react';
import { Star, MapPin, Clock, ShieldCheck, Compass, X } from 'lucide-react';
import type { MapPlace } from '../../data/mock-places';

interface MapCardPreviewProps {
  place: MapPlace;
  onClose: () => void;
}

export const MapCardPreview: React.FC<MapCardPreviewProps> = ({ place, onClose }) => {
  const isAccommodation = place.type === 'accommodation';

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-sand-200 overflow-hidden text-sand-900 transition-all animate-in fade-in zoom-in-95 duration-200">
      {/* Header con Imagen */}
      <div className="relative h-44 w-full overflow-hidden bg-sand-200">
        <img
          src={place.imageUrl}
          alt={place.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Cerrar vista previa"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Datos y Título sobre imagen (sin eyebrows ni badges) */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <span className="text-xs text-sand-300 font-normal block">
            {place.category}
          </span>
          <h4 className="font-display font-bold text-lg leading-tight drop-shadow-sm truncate mt-0.5">
            {place.title}
          </h4>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 space-y-3">
        <p className="text-xs text-sand-700 leading-relaxed font-normal line-clamp-2">
          {place.subtitle}
        </p>

        {/* Métricas y Datos Clave sin emojis */}
        <div className="flex items-center justify-between text-xs py-2 border-y border-sand-100">
          <div className="flex items-center gap-1 text-amber-600 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{place.rating.toFixed(1)}</span>
            <span className="text-sand-400 font-normal">({place.reviewCount})</span>
          </div>

          <div className="flex items-center gap-1 text-sand-600 truncate max-w-[190px]">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-sand-400" />
            <span className="truncate">{place.address}</span>
          </div>
        </div>

        {/* Especificidades por tipo */}
        {isAccommodation ? (
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-[11px] text-sand-500 block">Tarifa por noche</span>
              <span className="text-base font-extrabold text-primary-600">
                ${(place.pricePerNight ?? 0).toLocaleString('es-AR')}
              </span>
            </div>
            <a
              href={place.ctaUrl}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-semibold text-xs shadow-md shadow-primary-500/20 transition-all cursor-pointer"
            >
              Ver Disponibilidad →
            </a>
          </div>
        ) : (
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-[11px] text-sand-500 block">Dificultad: {place.difficulty}</span>
              <div className="flex items-center gap-1 text-xs font-semibold text-sand-800">
                <Clock className="w-3 h-3 text-sand-500" />
                <span>{place.duration}</span>
              </div>
            </div>
            <a
              href={place.ctaUrl}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-uritorco-600 hover:bg-uritorco-700 active:bg-uritorco-800 text-white font-semibold text-xs shadow-md shadow-uritorco-600/20 transition-all cursor-pointer"
            >
              Ficha del Paseo →
            </a>
          </div>
        )}
      </div>
    </div>
  );
};