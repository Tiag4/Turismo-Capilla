import React from 'react';
import { Users, MapPin, Edit3, Power, Camera, ShieldCheck, Coffee, Star } from 'lucide-react';
import type { Accommodation } from '../../types/accommodation.types.ts';
import { Button } from '../ui/Button.tsx';
import { ComplianceStatusBadge } from './ComplianceStatusBadge.tsx';
import { Tooltip } from '../ui/Tooltip.tsx';

export interface AccommodationCardProps {
  accommodation: Accommodation;
  onEdit: (accommodation: Accommodation) => void;
  onToggleActive: (accommodation: Accommodation) => void;
  onToggleFeatured?: (accommodation: Accommodation) => void;
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
  onToggleFeatured,
  isAdmin = false,
  onAudit,
}) => {
  const mainImage =
    accommodation.images?.find((img) => img.isMain)?.url ||
    accommodation.images?.[0]?.url ||
    '/images/accommodations/el-aguaribay/el-aguaribay-01.jpg';
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
          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap max-w-[55%]">
            <span className="bg-[#1C1A18]/90 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider border border-white/10 shadow-xs">
              {TYPE_LABELS[accommodation.type] || 'Alojamiento'}
            </span>
            {hasBreakfast && (
              <span className="bg-amber-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1 shadow-xs">
                <Coffee className="w-3 h-3 text-white" />
                <span>Desayuno</span>
              </span>
            )}
          </div>

          {/* Featured Toggle (Admin) or Featured Badge (Host/Public) */}
          {isAdmin && onToggleFeatured ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFeatured(accommodation);
              }}
              title={accommodation.isFeatured ? 'Quitar de destacados en portada' : 'Destacar en portada del portal'}
              className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md border ${
                accommodation.isFeatured
                  ? 'bg-amber-400 hover:bg-amber-300 text-sand-950 border-amber-300 font-extrabold'
                  : 'bg-black/60 hover:bg-black/80 text-sand-200 hover:text-white border-white/20'
              }`}
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  accommodation.isFeatured ? 'fill-sand-950 text-sand-950' : 'text-amber-400'
                }`}
              />
              <span>{accommodation.isFeatured ? 'Destacado' : 'Destacar'}</span>
            </button>
          ) : accommodation.isFeatured ? (
            <div className="absolute top-3 right-3">
              <span className="bg-amber-500 text-sand-950 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1 shadow-xs border border-amber-300">
                <Star className="w-3 h-3 fill-current text-sand-950" />
                <span>Destacado</span>
              </span>
            </div>
          ) : null}

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
        <Tooltip
          content={accommodation.isActive ? 'Pausar visibilidad en el portal' : 'Publicar en el portal para recibir reservas'}
          position="top"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleActive(accommodation)}
            className="text-xs cursor-pointer shrink-0"
          >
            <Power className="w-3.5 h-3.5 text-[var(--color-sand-500)]" />
            <span>{accommodation.isActive ? 'Pausar' : 'Activar'}</span>
          </Button>
        </Tooltip>

        <div className="flex items-center gap-2 shrink-0">
          {isAdmin && onAudit && (
            <Tooltip content="Auditar matrícula municipal y cumplimiento de normas" position="top">
              <Button
                variant="emerald"
                size="sm"
                onClick={() => onAudit(accommodation)}
                className="text-xs cursor-pointer shrink-0"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Auditar</span>
              </Button>
            </Tooltip>
          )}
          <Tooltip content="Editar fotos, tarifas, disponibilidad y políticas" position="top">
            <Button
              variant="terracotta"
              size="sm"
              onClick={() => onEdit(accommodation)}
              className="text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editar</span>
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
