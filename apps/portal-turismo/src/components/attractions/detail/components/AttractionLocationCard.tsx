import React from 'react';
import type { AttractionItem } from '../../types';

interface AttractionLocationCardProps {
  item: AttractionItem;
}

export const AttractionLocationCard: React.FC<AttractionLocationCardProps> = ({ item }) => {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${item.coordinates.lat},${item.coordinates.lng}`;

  return (
    <div className="bg-white rounded-2xl border border-sand-200/90 p-5 sm:p-6 shadow-xs space-y-4">
      <h3 className="font-display font-bold text-base text-sand-900 flex items-center gap-2">
        <svg className="w-5 h-5 text-terracotta-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>Ubicación & Cómo Llegar</span>
      </h3>

      <div className="space-y-2 text-xs text-sand-700">
        <div>
          <span className="font-bold text-sand-900 block">Dirección:</span>
          <span>{item.address}</span>
        </div>
        <div>
          <span className="font-bold text-sand-900 block">Distancia:</span>
          <span>A {item.distanceFromCenter} de Plaza San Martín (centro).</span>
        </div>
        <div>
          <span className="font-bold text-sand-900 block">Acceso:</span>
          <span>{item.practicalInfo.accessHowTo}</span>
        </div>
        <div>
          <span className="font-bold text-sand-900 block">Estacionamiento:</span>
          <span>{item.practicalInfo.parking}</span>
        </div>
      </div>

      <div className="pt-2">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-sand-100 hover:bg-sand-200 text-sand-800 transition-colors"
        >
          <svg className="w-4 h-4 text-sand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span>Abrir ubicación en Google Maps</span>
        </a>
      </div>
    </div>
  );
};
