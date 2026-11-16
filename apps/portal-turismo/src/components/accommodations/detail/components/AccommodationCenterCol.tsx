import React, { useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import type { UnitDetails } from '../types';
import { AccommodationRoomTypeCard } from './AccommodationRoomTypeCard';
import { getFeaturedAmenitiesGrid } from '../utils/amenitiesCatalog';

interface AccommodationCenterColProps {
  unitDetails?: UnitDetails;
  amenities?: string[];
  hasBreakfast?: boolean;
  onOpenAmenities?: () => void;
}

export const AccommodationCenterCol: React.FC<AccommodationCenterColProps> = ({
  unitDetails,
  amenities,
  hasBreakfast,
  onOpenAmenities,
}) => {
  const featuredServices = useMemo(
    () => getFeaturedAmenitiesGrid(amenities, hasBreakfast),
    [amenities, hasBreakfast],
  );

  const totalCount = (amenities?.length ?? 0) + (hasBreakfast ? 1 : 0);
  const buttonLabel =
    totalCount > 0
      ? `Ver todos los servicios e instalaciones (${Math.max(totalCount, featuredServices.length)})`
      : 'Ver todos los servicios e instalaciones';

  return (
    <div className="space-y-6">
      {/* Ficha Tipo de Alojamiento */}
      {unitDetails ? (
        <AccommodationRoomTypeCard unitDetails={unitDetails} />
      ) : (
        <div className="space-y-1.5">
          <h3 className="font-display font-bold text-base text-stone-900">Habitaciones</h3>
          <p className="text-sm text-stone-600 font-medium">Dormitorio principal con cama matrimonial</p>
          <p className="text-sm text-stone-600 font-medium">Segundo dormitorio con camas individuales</p>
        </div>
      )}

      {/* Servicios destacados dinámicos con grilla de 4 columnas */}
      <div className="space-y-4 pt-1">
        <h3 className="font-display font-bold text-base text-stone-900">Servicios destacados</h3>
        <div
          className="gap-y-4 gap-x-2 text-center"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          }}
        >
          {featuredServices.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.id} className="flex flex-col items-center group">
                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800 mb-1 group-hover:bg-terracotta-50 group-hover:text-terracotta-700 transition-colors">
                  <Icon className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <span className="text-[11px] font-semibold text-stone-800 leading-tight">
                  {service.name}
                </span>
              </div>
            );
          })}
        </div>

        {onOpenAmenities && (
          <button
            type="button"
            onClick={onOpenAmenities}
            className="w-full mt-2 py-2.5 px-4 rounded-xl border border-stone-200 hover:border-stone-400 bg-stone-50/50 hover:bg-stone-100 text-stone-800 font-display font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer select-none"
          >
            <span>{buttonLabel}</span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
          </button>
        )}
      </div>
    </div>
  );
};
