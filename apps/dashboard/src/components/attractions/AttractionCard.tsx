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
    <div className="bg-white rounded-xl border border-sand-300 overflow-hidden shadow-xs hover:border-sand-400 transition-all flex flex-col justify-between group">
      <div>
        <div className="relative aspect-16/9 bg-sand-200 overflow-hidden">
          <img
            src={coverImg}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />

          <button
            type="button"
            onClick={() => onToggleFeatured(item)}
            title={item.isFeatured ? 'Quitar de destacados' : 'Destacar en portada'}
            className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              item.isFeatured
                ? 'bg-amber-400 text-sand-950 shadow-xs'
                : 'bg-black/50 text-sand-200 hover:text-white'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${item.isFeatured ? 'fill-sand-950' : ''}`} />
            <span>{item.isFeatured ? 'Destacado' : 'Destacar'}</span>
          </button>

          <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded text-[11px] font-bold bg-black/60 text-white backdrop-blur-xs">
            {CATEGORY_LABELS[item.category] || item.category}
          </span>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-base text-sand-900 font-['Outfit'] leading-snug">
              {item.name}
            </h3>
            {item.difficulty && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-sand-100 text-sand-700 shrink-0">
                {item.difficulty}
              </span>
            )}
          </div>

          <p className="text-sand-600 text-xs line-clamp-2 leading-relaxed">
            {item.description || 'Sin descripción detallada.'}
          </p>

          <div className="pt-2 border-t border-sand-100">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-sand-500 mb-1">
              Estado Operativo
            </label>
            <select
              value={currentStatus}
              onChange={(e) => onQuickStatusChange(item, e.target.value as AttractionStatus)}
              className={`w-full text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer focus:outline-none ${
                currentStatus === 'OPEN'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : currentStatus === 'WEATHER_RESTRICTED'
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-rose-50 text-rose-800 border-rose-300'
              }`}
            >
              <option value="OPEN">Abierto y Habilitado</option>
              <option value="WEATHER_RESTRICTED">Precaución Meteorológica</option>
              <option value="CLOSED">Clausurado Temporalmente</option>
            </select>
          </div>

          {item.statusNotice && currentStatus !== 'OPEN' && (
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-tight flex items-start gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>{item.statusNotice}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs pt-1 text-sand-600">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sand-400 shrink-0" />
              <span className="truncate">{item.estimatedDuration || 'Libre'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-sand-400 shrink-0" />
              <span className="font-semibold text-sand-800">
                {item.admissionFee && item.admissionFee > 0 ? `$${item.admissionFee.toLocaleString('es-AR')}` : 'Acceso Libre'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-2.5 bg-sand-50 border-t border-sand-200 flex items-center justify-between gap-2">
        <span className="text-[11px] text-sand-500 font-medium">
          {item.requiresGuide ? 'Requiere guía habilitado' : 'Circuito autoguiado'}
        </span>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="sm" onClick={() => onEdit(item)} className="px-2 py-1 text-xs font-bold">
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
