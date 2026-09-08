import React from 'react';
import { Users, BedDouble, Bed, Home, Maximize2, Utensils, ShowerHead, Tv } from 'lucide-react';
import type { UnitDetails } from '../types';

interface AccommodationRoomTypeCardProps {
  unitDetails: UnitDetails;
}

const getFeatureIcon = (feature: string) => {
  const lower = feature.toLowerCase();
  if (lower.includes('entero') || lower.includes('chalet') || lower.includes('cabaña')) {
    return <Home className="w-3.5 h-3.5 text-stone-600 shrink-0" />;
  }
  if (lower.includes('m²')) {
    return <Maximize2 className="w-3.5 h-3.5 text-stone-600 shrink-0" />;
  }
  if (lower.includes('cocina')) {
    return <Utensils className="w-3.5 h-3.5 text-stone-600 shrink-0" />;
  }
  if (lower.includes('baño')) {
    return <ShowerHead className="w-3.5 h-3.5 text-stone-600 shrink-0" />;
  }
  if (lower.includes('tv')) {
    return <Tv className="w-3.5 h-3.5 text-stone-600 shrink-0" />;
  }
  return null;
};

export const AccommodationRoomTypeCard: React.FC<AccommodationRoomTypeCardProps> = ({ unitDetails }) => {
  return (
    <div className="rounded-2xl border border-stone-200 overflow-hidden bg-white shadow-xs">
      {/* Banner Superior */}
      <div className="bg-[#2a6db5] text-white px-4 py-2 text-xs sm:text-sm font-bold tracking-wide">
        Tipo de alojamiento
      </div>

      <div className="p-4 sm:p-5 space-y-3.5">
        {/* Nombre de la unidad */}
        <div>
          <h3 className="font-display font-bold text-base sm:text-lg text-[#006ce4] hover:underline cursor-pointer">
            {unitDetails.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-800 mt-1">
            <Users className="w-4 h-4 text-stone-600" />
            <span>{unitDetails.capacityText}</span>
          </div>
        </div>

        {/* Distribución de dormitorios y camas */}
        <div className="space-y-1.5 text-xs sm:text-sm text-stone-800">
          {unitDetails.bedrooms.map((bed, idx) => (
            <div key={idx} className="flex items-center gap-2 font-medium">
              <span className="font-bold">{bed.roomName}:</span>
              <span>{bed.bedDetails}</span>
              {bed.isDouble ? (
                <BedDouble className="w-4 h-4 text-stone-700 ml-1 inline" />
              ) : (
                <div className="inline-flex gap-0.5 ml-1">
                  <Bed className="w-3.5 h-3.5 text-stone-700" />
                  <Bed className="w-3.5 h-3.5 text-stone-700" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Badges de especificaciones */}
        <div className="flex flex-wrap gap-2 pt-1">
          {unitDetails.features.map((feature, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-stone-300 bg-stone-50/70 text-[11px] sm:text-xs font-semibold text-stone-700"
            >
              {getFeatureIcon(feature)}
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
