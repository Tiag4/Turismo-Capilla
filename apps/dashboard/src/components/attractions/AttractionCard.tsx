import React from 'react';
import { Star, Clock, DollarSign, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button.tsx';
import type { Attraction, AttractionCategory, AttractionStatus } from '../../types/attraction.types.ts';

const CATEGORY_LABELS: Record<AttractionCategory, string> = {
  HILL: 'Cerro / Montaña',
  NATURE_TRAIL: 'Sendero / Trekking',
  RIVER_BEACH: 'Río / Balneario',
  CULTURAL: 'Cultural / Histórico',
  NIGHT: 'Nocturno / Astroturismo',
};

const STATUS_BADGES: Record<AttractionStatus, { label: string; badgeClass: string }> = {
  OPEN: { label: 'Habilitado', badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  WEATHER_RESTRICTED: { label: 'Con Precaución', badgeClass: 'bg-amber-50 text-amber-800 border-amber-200' },
  CLOSED: { label: 'Clausurado', badgeClass: 'bg-rose-50 text-rose-800 border-rose-200' },
};

export interface AttractionCardProps {
  item: Attraction;
  onToggleFeatured: (item: Attraction) => void;
  onQuickStatusChange: (item: Attraction, newStatus: AttractionStatus) => void;
  onEdit: (item: Attraction) => void;
  onDelete: (item: Attraction) => void;
}

export const AttractionCard: React.FC<AttractionCardProps> = ({
  item,
  onToggleFeatured,
  onEdit,
  onDelete,
}) => {
  const currentStatus = item.status || 'OPEN';
  const statusConfig = STATUS_BADGES[currentStatus] || STATUS_BADGES.OPEN;
  const coverImg = item.images?.[0]?.url || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-white rounded-xl border border-sand-300 hover:border-sand-400 shadow-xs transition-all flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Cover Photo */}
        <div className="relative aspect-16/10 bg-sand-200 overflow-hidden">
          <img
            src={coverImg}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
            loading="lazy"
          />

          {/* Featured Toggle Button */}
          <button
            type="button"
            onClick={() => onToggleFeatured(item)}
            title={item.isFeatured ? 'Quitar de destacados' : 'Destacar en portada'}
            className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ${
              item.isFeatured
                ? 'bg-amber-400 text-sand-950'
                : 'bg-black/60 text-sand-200 hover:text-white'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${item.isFeatured ? 'fill-sand-950' : ''}`} />
            <span>{item.isFeatured ? 'Destacado' : 'Destacar'}</span>
          </button>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3">
          {/* Category & Status Row */}
          <div className="flex items-center justify-between gap-2 text-[11px]">
            <span className="font-semibold text-sand-500">
              {CATEGORY_LABELS[item.category] || item.category}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${statusConfig.badgeClass}`}
            >
              {statusConfig.label}
            </span>
          </div>

          {/* Title & Difficulty */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-base text-sand-900 font-['Outfit'] leading-snug">
              {item.name}
            </h3>
            {item.difficulty && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold text-sand-600 bg-sand-100 shrink-0">
                {item.difficulty}
              </span>
            )}
          </div>

          <p className="text-sand-600 text-xs line-clamp-2 leading-relaxed">
            {item.description || 'Sin descripción detallada.'}
          </p>

          {item.statusNotice && currentStatus !== 'OPEN' && (
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-tight flex items-start gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>{item.statusNotice}</span>
            </div>
          )}

          {/* Practical Info Strip */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-sand-100 text-sand-600">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sand-400 shrink-0" />
              <span className="truncate">{item.estimatedDuration || 'Libre'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-sand-400 shrink-0" />
              <span className="font-semibold text-sand-800 font-['Outfit']">
                {item.admissionFee && item.admissionFee > 0 ? `$${item.admissionFee.toLocaleString('es-AR')}` : 'Acceso Libre'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-4 py-2.5 bg-sand-50/80 border-t border-sand-200 flex items-center justify-between gap-2 text-xs">
        <span className="text-[11px] text-sand-500 font-medium">
          {item.requiresGuide ? 'Guía obligatorio' : 'Autoguiado'}
        </span>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(item)}
            className="px-2.5 py-1 text-xs font-bold text-terracotta-700 hover:text-terracotta-800 hover:border-terracotta-400"
          >
            <Edit2 className="w-3 h-3 mr-1" />
            <span>Editar</span>
          </Button>
          <button
            type="button"
            onClick={() => onDelete(item)}
            className="p-1.5 text-sand-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Eliminar paseo"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
