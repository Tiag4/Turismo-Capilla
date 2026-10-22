import React from 'react';
import { Star, AlertTriangle, Clock, DollarSign, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button.tsx';
import type { Attraction, AttractionCategory, AttractionStatus } from '../../types/attraction.types.ts';

const CATEGORY_LABELS: Record<AttractionCategory, string> = {
  HILL: 'Cerro / Montaña',
  NATURE_TRAIL: 'Sendero / Trekking',
  RIVER_BEACH: 'Río / Balneario',
  CULTURAL: 'Cultural / Histórico',
  NIGHT: 'Nocturno / Astroturismo',
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
  onQuickStatusChange,
  onEdit,
  onDelete,
}) => {
  const currentStatus = item.status || 'OPEN';
  const coverImg = item.images?.[0]?.url || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-sand-200)] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <div className="relative aspect-16/9 bg-[var(--color-sand-200)] overflow-hidden">
          <img src={coverImg} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          <button
            type="button"
            onClick={() => onToggleFeatured(item)}
            title={item.isFeatured ? 'Quitar de destacados' : 'Destacar en portada'}
            className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1 backdrop-blur-xs transition-colors cursor-pointer ${
              item.isFeatured ? 'bg-amber-400 text-sand-950 shadow-xs' : 'bg-black/40 text-sand-300 hover:text-white'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${item.isFeatured ? 'fill-sand-950' : ''}`} />
            <span>{item.isFeatured ? 'Destacado' : 'Destacar'}</span>
          </button>

          <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-black/60 text-white backdrop-blur-xs">
            {CATEGORY_LABELS[item.category] || item.category}
          </span>
        </div>

        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-black text-lg text-[var(--color-sand-900)] leading-snug">{item.name}</h3>
            {item.difficulty && (
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-[var(--color-sand-100)] text-[var(--color-sand-700)] shrink-0">
                {item.difficulty}
              </span>
            )}
          </div>

          <p className="text-[var(--color-sand-600)] text-xs line-clamp-2 leading-relaxed">
            {item.description || 'Sin descripción detallada.'}
          </p>

          <div className="pt-2 border-t border-[var(--color-sand-100)]">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-sand-500)] mb-1">
              Disponibilidad Operativa
            </label>
            <select
              value={currentStatus}
              onChange={(e) => onQuickStatusChange(item, e.target.value as AttractionStatus)}
              className={`w-full text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer focus:outline-none ${
                currentStatus === 'OPEN'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 focus:ring-emerald-400'
                  : currentStatus === 'WEATHER_RESTRICTED'
                  ? 'bg-amber-50 text-amber-800 border-amber-200 focus:ring-amber-400'
                  : 'bg-rose-50 text-rose-800 border-rose-200 focus:ring-rose-400'
              }`}
            >
              <option value="OPEN">🟢 Abierto y Habilitado</option>
              <option value="WEATHER_RESTRICTED">🟡 Con Precaución Meteorológica</option>
              <option value="CLOSED">🔴 Clausurado Temporalmente</option>
            </select>
          </div>

          {item.statusNotice && currentStatus !== 'OPEN' && (
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-tight flex items-start gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>{item.statusNotice}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs pt-1 text-[var(--color-sand-600)]">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[var(--color-sand-400)] shrink-0" />
              <span className="truncate">{item.estimatedDuration || 'Libre'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-[var(--color-sand-400)] shrink-0" />
              <span>{item.admissionFee && item.admissionFee > 0 ? `$${item.admissionFee.toLocaleString('es-AR')}` : 'Gratis'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-3 bg-[var(--color-sand-50)] border-t border-[var(--color-sand-200)] flex items-center justify-between gap-2">
        <span className="text-[11px] text-[var(--color-sand-500)] font-medium">
          {item.requiresGuide ? 'Requiere guía' : 'Autoguiado'}
        </span>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="sm" onClick={() => onEdit(item)} className="gap-1 px-2.5 py-1 text-xs">
            <Edit2 className="w-3.5 h-3.5" />
            <span>Editar</span>
          </Button>
          <button
            type="button"
            onClick={() => onDelete(item)}
            className="p-1.5 text-[var(--color-sand-400)] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Eliminar atractivo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
