import React from 'react';
import { Users, MapPin, Edit3, Power, Camera, ShieldCheck, Coffee } from 'lucide-react';
import type { Accommodation } from '../../types/accommodation.types.ts';
import { Button } from '../ui/Button.tsx';
import { ComplianceStatusBadge } from './ComplianceStatusBadge.tsx';

export interface AccommodationCardProps {
  accommodation: Accommodation;
  onEdit: (accommodation: Accommodation) => void;
  onToggleActive: (accommodation: Accommodation) => void;
  isAdmin?: boolean;
  onAudit?: (accommodation: Accommodation) => void;
}

const TYPE_LABELS: Record<string, string> = {
  CABIN: 'Cabaña',
  HOTEL: 'Hotel / Posada',
  APARTMENT: 'Departamento',
  HOSTEL: 'Hostel',
  CAMPING: 'Camping',
};

export const AccommodationCard: React.FC<AccommodationCardProps> = ({
  accommodation,
  onEdit,
  onToggleActive,
  isAdmin = false,
  onAudit,
}) => {
  const mainImage =
    accommodation.images?.find((img) => img.isMain)?.url ||
    accommodation.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80';
  const hasBreakfast = Boolean(
    accommodation.hasBreakfast ||
      accommodation.amenities?.some((a) => a.toLowerCase().includes('desayuno'))
  );

  return (
    <div className="group bg-white border border-[var(--color-sand-200)] hover:border-[var(--color-sand-300)] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="relative h-48 sm:h-52 w-full bg-[var(--color-sand-200)] overflow-hidden">
          <img
            src={mainImage}
            alt={accommodation.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25 pointer-events-none" />

          {/* Property Type and Breakfast tags */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap max-w-[85%]">
            <span className="bg-[#1C1A18]/90 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider border border-white/10 shadow-xs">
              {TYPE_LABELS[accommodation.type] || 'Alojamiento'}
            </span>
            {hasBreakfast && (
              <span className="bg-amber-600 text-white text-[10px] font-extrabold px-2 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1 shadow-xs">
                <Coffee className="w-3 h-3 text-white" />
                <span>Desayuno</span>
              </span>
            )}
          </div>

          {accommodation.images && accommodation.images.length > 0 && (
            <div className="absolute bottom-2.5 right-2.5">
              <span className="bg-black/65 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1.5 shadow-xs border border-white/10">
                <Camera className="w-3 h-3 text-white/90" />
                <span>
                  {accommodation.images.length} {accommodation.images.length === 1 ? 'foto' : 'fotos'}
                </span>
              </span>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5 flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <ComplianceStatusBadge
              status={accommodation.complianceStatus}
              isActive={accommodation.isActive}
            />
            {accommodation.auditRecord?.auditedAt && (
              <span className="text-[10px] text-[var(--color-sand-500)] font-medium">
                Auditado: {new Date(accommodation.auditRecord.auditedAt).toLocaleDateString('es-AR')}
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-[var(--color-sand-900)] font-['Outfit'] group-hover:text-[var(--color-terracotta-600)] transition-colors line-clamp-1">
            {accommodation.name}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-[var(--color-sand-600)]">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-[var(--color-terracotta-500)]" />
            <span className="truncate">{accommodation.address}</span>
          </div>

          <p className="text-xs text-[var(--color-sand-700)] line-clamp-2 leading-relaxed min-h-[2.25rem]">
            {accommodation.description}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-[var(--color-sand-200)] mt-1">
            <div>
              <span className="text-[10px] uppercase font-bold text-[var(--color-sand-400)] tracking-wider block leading-none">
                Tarifa por noche
              </span>
              <span className="text-lg font-black text-[var(--color-terracotta-600)] font-['Outfit'] leading-tight mt-0.5 block">
                ${(accommodation.pricePerNight ?? 0).toLocaleString('es-AR')}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-sand-700)]">
              <Users className="w-4 h-4 text-[var(--color-sand-500)]" />
              <span>Hasta {accommodation.maxGuests ?? 0} pers.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 sm:px-5 sm:py-3 bg-[var(--color-sand-50)] border-t border-[var(--color-sand-200)] flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onToggleActive(accommodation)}
          className="text-xs"
        >
          <Power className="w-3.5 h-3.5 text-[var(--color-sand-500)]" />
          <span>{accommodation.isActive ? 'Pausar' : 'Activar'}</span>
        </Button>

        <div className="flex items-center gap-2">
          {isAdmin && onAudit && (
            <Button
              variant="emerald"
              size="sm"
              onClick={() => onAudit(accommodation)}
              className="text-xs"
              title="Auditar habilitación municipal"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Auditar</span>
            </Button>
          )}
          <Button
            variant="terracotta"
            size="sm"
            onClick={() => onEdit(accommodation)}
            className="text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editar</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
