import React from 'react';
import { Users, BedDouble, Bed, Home, Maximize2, Utensils, ShowerHead, Tv } from 'lucide-react';
import type { UnitDetails } from '../types';

interface AccommodationRoomTypeCardProps {
  unitDetails: UnitDetails;
}

const getFeatureIcon = (feature: string) => {
  const lower = feature.toLowerCase();
  if (lower.includes('entero') || lower.includes('chalet') || lower.includes('cabaña')) {
    return <Home className="w-3.5 h-3.5 text-stone-700 shrink-0" />;
  }
  if (lower.includes('m²')) {
    return <Maximize2 className="w-3.5 h-3.5 text-stone-700 shrink-0" />;
  }
  if (lower.includes('cocina')) {
    return <Utensils className="w-3.5 h-3.5 text-stone-700 shrink-0" />;
  }
  if (lower.includes('baño')) {
    return <ShowerHead className="w-3.5 h-3.5 text-stone-700 shrink-0" />;
  }
  if (lower.includes('tv')) {
    return <Tv className="w-3.5 h-3.5 text-stone-700 shrink-0" />;
  }
  return null;
};

export const AccommodationRoomTypeCard: React.FC<AccommodationRoomTypeCardProps> = ({ unitDetails }) => {
  return (
    <div className="space-y-3.5 pt-1 pb-4 border-b border-stone-200/80">
      {/* Etiqueta y Título de la Unidad */}
      <div>
        <span className="text-[10px] font-bold text-terracotta-700 tracking-wider uppercase block mb-0.5">
          Tipo de alojamiento
        </span>
        <h3 className="font-display font-black text-lg sm:text-xl text-stone-900 tracking-tight">
          {unitDetails.title}
        </h3>
        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-700 mt-1">
          <Users className="w-4 h-4 text-terracotta-700 shrink-0" />
          <span>{unitDetails.capacityText}</span>
        </div>
      </div>

      {/* Distribución de dormitorios y camas */}
      <div className="space-y-1.5 text-xs sm:text-sm text-stone-800">
        {unitDetails.bedrooms.map((bed, idx) => (
          <div key={idx} className="flex items-center gap-2 font-medium">
            <span className="font-bold text-stone-900">{bed.roomName}:</span>
            <span className="text-stone-700">{bed.bedDetails}</span>
            {bed.isDouble ? (
              <BedDouble className="w-4 h-4 text-stone-600 ml-1 inline" />
            ) : (
              <div className="inline-flex gap-0.5 ml-1">
                <Bed className="w-3.5 h-3.5 text-stone-600" />
                <Bed className="w-3.5 h-3.5 text-stone-600" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Badges integrados al sistema de diseño */}
      <div className="flex flex-wrap gap-2 pt-1">
        {unitDetails.features.map((feature, idx) => (
          <div
            key={idx}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-200/60 text-stone-800 text-xs font-semibold border border-stone-300/50"
          >
            {getFeatureIcon(feature)}
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
