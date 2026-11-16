import React, { useState, useRef, useEffect } from 'react';
import { Star, Clock, DollarSign, Edit2, Trash2, AlertTriangle, ChevronDown, Check, X } from 'lucide-react';
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
  onSetFeatured: (item: Attraction, isFeatured: boolean, theme?: 'DARK' | 'LIGHT') => void;
  onQuickStatusChange: (item: Attraction, newStatus: AttractionStatus) => void;
  onEdit: (item: Attraction) => void;
  onDelete: (item: Attraction) => void;
}

export const AttractionCard: React.FC<AttractionCardProps> = ({
  item,
  onSetFeatured,
  onEdit,
  onDelete,
}) => {
  const currentStatus = item.status || 'OPEN';
  const statusConfig = STATUS_BADGES[currentStatus] || STATUS_BADGES.OPEN;
  const coverImg =
    item.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80';

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <div className="bg-white rounded-xl border border-sand-300 hover:border-sand-400 shadow-xs transition-all flex flex-col justify-between overflow-visible group relative">
      <div>
        {/* Cover Photo */}
        <div className="relative aspect-16/10 bg-sand-200 rounded-t-xl overflow-hidden">
          <img
            src={coverImg}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
            loading="lazy"
          />

          {/* Featured Dropdown Trigger & Menu */}
          <div className="absolute top-2.5 right-2.5 z-20" ref={menuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen((prev) => !prev);
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                item.isFeatured
                  ? item.featuredBadgeTheme === 'LIGHT'
                    ? 'bg-amber-400 text-sand-950 hover:bg-amber-300'
                    : 'bg-sand-950 text-amber-300 hover:bg-sand-900 border border-sand-700'
                  : 'bg-black/65 text-sand-200 hover:text-white backdrop-blur-xs'
              }`}
              title="Configurar opciones de destacado"
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  item.isFeatured
                    ? item.featuredBadgeTheme === 'LIGHT'
                      ? 'fill-sand-950'
                      : 'fill-amber-300'
                    : ''
                }`}
              />
              <span>
                {item.isFeatured
                  ? item.featuredBadgeTheme === 'LIGHT'
                    ? 'Destacado Claro'
                    : 'Destacado Oscuro'
                  : 'Destacar'}
              </span>
              <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-sand-200 p-1.5 z-50 space-y-1 animate-in fade-in-50 zoom-in-95 duration-100">
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-sand-400 border-b border-sand-100 mb-1">
                  Opciones de Destacado
                </div>

                {/* Opción 1: Destacado Oscuro */}
                <button
                  type="button"
                  onClick={() => {
                    onSetFeatured(item, true, 'DARK');
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                    item.isFeatured && item.featuredBadgeTheme !== 'LIGHT'
                      ? 'bg-sand-100 text-sand-950 font-semibold'
                      : 'hover:bg-sand-100 text-sand-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sand-950 text-amber-300 shadow-xs shrink-0">
                      ★ Oscuro
                    </span>
                    <span className="text-xs font-bold leading-tight text-sand-900">Destacado Oscuro</span>
                  </div>
                  {item.isFeatured && item.featuredBadgeTheme !== 'LIGHT' && (
                    <Check className="w-4 h-4 text-sand-900 stroke-[3] shrink-0 ml-1" />
                  )}
                </button>

                {/* Opción 2: Destacado Claro */}
                <button
                  type="button"
                  onClick={() => {
                    onSetFeatured(item, true, 'LIGHT');
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                    item.isFeatured && item.featuredBadgeTheme === 'LIGHT'
                      ? 'bg-amber-50 text-amber-950 font-semibold'
                      : 'hover:bg-sand-100 text-sand-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-sand-950 shadow-xs shrink-0">
                      ★ Claro
                    </span>
                    <span className="text-xs font-bold leading-tight text-sand-900">Destacado Claro</span>
                  </div>
                  {item.isFeatured && item.featuredBadgeTheme === 'LIGHT' && (
                    <Check className="w-4 h-4 text-amber-700 stroke-[3] shrink-0 ml-1" />
                  )}
                </button>

                {/* Opción 3: No destacar */}
                <button
                  type="button"
                  onClick={() => {
                    onSetFeatured(item, false);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg transition-colors flex items-center justify-between cursor-pointer border-t border-sand-100 pt-1.5 ${
                    !item.isFeatured
                      ? 'bg-sand-50 text-sand-600 font-semibold'
                      : 'hover:bg-rose-50/70 text-sand-700 hover:text-rose-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sand-100 text-sand-500 flex items-center justify-center shrink-0">
                      <X className="w-3 h-3" />
                    </span>
                    <div>
                      <span className="block text-xs font-bold leading-tight">No destacar</span>
                      <span className="block text-[10px] text-sand-500">Paseo regular sin insignia</span>
                    </div>
                  </div>
                  {!item.isFeatured && (
                    <Check className="w-4 h-4 text-sand-600 stroke-[3] shrink-0 ml-1" />
                  )}
                </button>
              </div>
            )}
          </div>
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
                {item.admissionFee && item.admissionFee > 0
                  ? `$${item.admissionFee.toLocaleString('es-AR')}`
                  : 'Acceso Libre'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-4 py-2.5 bg-sand-50/80 border-t border-sand-200 flex items-center justify-between gap-2 text-xs rounded-b-xl">
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
