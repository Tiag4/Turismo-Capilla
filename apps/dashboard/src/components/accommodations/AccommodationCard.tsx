import React from 'react';
import { Users, MapPin, Edit3, Power } from 'lucide-react';
import type { Accommodation } from '../../types/accommodation.types.ts';
import { Button } from '../ui/Button.tsx';

export interface AccommodationCardProps {
  accommodation: Accommodation;
  onEdit: (accommodation: Accommodation) => void;
  onToggleActive: (id: string) => void;
}

export const AccommodationCard: React.FC<AccommodationCardProps> = ({
  accommodation,
  onEdit,
  onToggleActive,
}) => {
  const mainImage =
    accommodation.images?.find((img) => img.isMain)?.url ||
    accommodation.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80';

  const typeLabels = {
    CABIN: 'Cabaña',
    HOTEL: 'Hotel / Posada',
    APARTMENT: 'Departamento',
    HOSTEL: 'Hostel',
    CAMPING: 'Camping',
  }[accommodation.type] || 'Alojamiento';

  return (
    <div className="bg-white border border-[var(--color-sand-200)] rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
      <div>
        {/* Image & Type Badge */}
        <div className="relative h-44 w-full bg-[var(--color-sand-200)] overflow-hidden">
          <img
            src={mainImage}
            alt={accommodation.name}
            className="w-full h-full object-cover"
          />
          {/* Solid badge adhering strictly to anti-vibecoded */}
          <div className="absolute top-3 left-3">
            <span className="bg-[#22201E] text-white text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
              {typeLabels}
            </span>
          </div>

          <div className="absolute top-3 right-3">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md text-white ${
                accommodation.isActive ? 'bg-[#005530]' : 'bg-rose-700'
              }`}
            >
              {accommodation.isActive ? 'Activo' : 'Pausado'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 flex flex-col gap-2.5">
          <h4 className="text-base font-bold text-[var(--color-sand-900)] font-['Outfit'] line-clamp-1">
            {accommodation.name}
          </h4>

          <div className="flex items-center gap-1.5 text-xs text-[var(--color-sand-400)]">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{accommodation.address}</span>
          </div>

          <p className="text-xs text-[var(--color-sand-800)] line-clamp-2 mt-1">
            {accommodation.description}
          </p>

          {/* Specs: Price & Capacity */}
          <div className="flex items-center justify-between pt-3 border-t border-[var(--color-sand-200)] mt-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-[var(--color-sand-400)] block">
                Tarifa por noche
              </span>
              <span className="text-base font-bold text-[var(--color-terracotta-500)] font-['Outfit']">
                ${(accommodation.pricePerNight ?? 0).toLocaleString('es-AR')}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-[var(--color-sand-800)] bg-[var(--color-sand-100)] px-2.5 py-1 rounded-lg">
              <Users className="w-3.5 h-3.5 text-[var(--color-sand-400)]" />
              <span>Hasta {accommodation.maxGuests ?? 0} pers.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-[var(--color-sand-50)] border-t border-[var(--color-sand-200)] flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onToggleActive(accommodation.id)}
          title={accommodation.isActive ? 'Pausar publicación' : 'Activar publicación'}
          className="text-xs"
        >
          <Power className="w-3.5 h-3.5 text-[var(--color-sand-400)]" />
          <span>{accommodation.isActive ? 'Pausar' : 'Activar'}</span>
        </Button>

        <Button
          variant="terracotta"
          size="sm"
          onClick={() => onEdit(accommodation)}
          className="text-xs"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Editar</span>
        </Button>
      </div>
    </div>
  );
};
