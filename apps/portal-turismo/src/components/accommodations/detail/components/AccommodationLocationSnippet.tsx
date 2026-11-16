import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, Car, Footprints, ArrowUpRight } from 'lucide-react';
import type { AccommodationDetailData } from '../types';
import { useNearbyLandmarks, type CalculatedLandmark } from '../hooks/useNearbyLandmarks';

interface AccommodationLocationSnippetProps {
  data: AccommodationDetailData;
}

export const AccommodationLocationSnippet: React.FC<AccommodationLocationSnippetProps> = ({ data }) => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${data.lat},${data.lng}`;
  const { nearbyLandmarks, isLoading, hasValidCoordinates } = useNearbyLandmarks({
    lat: data.lat,
    lng: data.lng,
    limit: 3,
  });

  return (
    <section className="space-y-4 pt-6 border-t border-stone-200/80">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display font-black text-xl text-stone-900">
            Ubicación en el Territorio
          </h2>
          <p className="text-xs text-stone-500 font-medium mt-0.5">
            {data.address} — Barrio {data.zone || 'Capilla del Monte'}, Capilla del Monte
          </p>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-xs font-bold text-stone-800 shadow-2xs transition-colors"
        >
          <Navigation className="w-3.5 h-3.5 text-primary-600" />
          <span>Abrir en Maps</span>
        </a>
      </div>

      {/* Tarjeta de Relieve y Distancias Clave Calculadas Dinámicamente */}
      <div className="p-5 rounded-3xl bg-stone-100/90 border border-stone-200 space-y-3">
        <div className="flex items-center justify-between text-stone-800">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-terracotta-600 shrink-0" />
            <span className="text-xs font-bold">
              Puntos de referencia cercanos (calculados en tiempo real):
            </span>
          </div>
          {hasValidCoordinates && (
            <span className="text-[11px] text-stone-400 hidden sm:inline">
              Distancia radial directa
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="p-3.5 rounded-2xl bg-white border border-stone-200/80 animate-pulse space-y-2">
                <div className="h-3 bg-stone-200 rounded-md w-3/4" />
                <div className="h-4 bg-stone-300 rounded-md w-1/2" />
              </div>
            ))}
          </div>
        ) : nearbyLandmarks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {nearbyLandmarks.map((landmark: CalculatedLandmark) => {
              const cardContent = (
                <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 hover:border-terracotta-300 transition-all flex flex-col justify-between h-full group">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-stone-500 block text-[11px] font-medium truncate">
                        {landmark.name}
                      </span>
                      {landmark.ctaUrl && !landmark.isKeyCivicHub && (
                        <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-terracotta-600 transition-colors shrink-0" />
                      )}
                    </div>
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <strong className="text-stone-900 font-bold text-sm">
                        {landmark.distanceText}
                      </strong>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-stone-100 flex items-center gap-1.5 text-[11px] text-stone-600">
                    {landmark.isWalking ? (
                      <Footprints className="w-3.5 h-3.5 text-uritorco-600 shrink-0" />
                    ) : (
                      <Car className="w-3.5 h-3.5 text-terracotta-600 shrink-0" />
                    )}
                    <span className="font-medium text-stone-700">{landmark.timeEstimate}</span>
                  </div>
                </div>
              );

              return landmark.ctaUrl && !landmark.isKeyCivicHub ? (
                <Link key={landmark.id} to={landmark.ctaUrl} className="block cursor-pointer">
                  {cardContent}
                </Link>
              ) : (
                <div key={landmark.id}>{cardContent}</div>
              );
            })}
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-white border border-stone-200/80 text-xs text-stone-500">
            Coordenadas geográficas no configuradas para este establecimiento.
          </div>
        )}
      </div>
    </section>
  );
};
