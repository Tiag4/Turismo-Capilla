import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import type { AccommodationDetailData } from '../types';

interface AccommodationLocationSnippetProps {
  data: AccommodationDetailData;
}

export const AccommodationLocationSnippet: React.FC<AccommodationLocationSnippetProps> = ({ data }) => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${data.lat},${data.lng}`;

  return (
    <section className="space-y-4 pt-6 border-t border-stone-200/80">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-black text-xl text-stone-900">
            Ubicación en el Territorio
          </h2>
          <p className="text-xs text-stone-500 font-medium mt-0.5">
            {data.address} — Barrio {data.zone}, Capilla del Monte
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

      {/* Tarjeta de Relieve y Distancias Clave */}
      <div className="p-5 rounded-3xl bg-stone-100/90 border border-stone-200 space-y-3">
        <div className="flex items-center gap-2 text-stone-800">
          <MapPin className="w-4 h-4 text-terracotta-600" />
          <span className="text-xs font-bold">
            Puntos de referencia cercanos:
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-white border border-stone-200/80">
            <span className="text-stone-500 block text-[11px]">Base Cerro Uritorco</span>
            <strong className="text-stone-900 font-bold">A 1.8 km (5 min en auto)</strong>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-stone-200/80">
            <span className="text-stone-500 block text-[11px]">Río Calabalumba / La Toma</span>
            <strong className="text-stone-900 font-bold">A 900 m (caminando)</strong>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-stone-200/80">
            <span className="text-stone-500 block text-[11px]">Centro y Calle Techada</span>
            <strong className="text-stone-900 font-bold">A 1.4 km</strong>
          </div>
        </div>
      </div>
    </section>
  );
};
