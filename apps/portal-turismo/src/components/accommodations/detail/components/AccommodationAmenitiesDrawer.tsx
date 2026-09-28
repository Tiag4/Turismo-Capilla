import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Wifi,
  Car,
  Coffee,
  UtensilsCrossed,
  Waves,
  Wind,
  Flame,
  Trees,
  Mountain,
  Tv,
  ShieldCheck,
  Footprints,
  DoorOpen,
  Briefcase,
  Fish,
  Gamepad2,
  Luggage,
  Check,
  Sparkles,
} from 'lucide-react';
import { ACCOMMODATION_SERVICES_CATALOG } from '../data/accommodation-services';

function getAmenityIcon(itemName: string, categoryIcon: string) {
  const lower = itemName.toLowerCase();
  if (lower.includes('wi-fi') || lower.includes('internet')) return Wifi;
  if (lower.includes('parking') || lower.includes('cochera') || lower.includes('aparcamiento')) return Car;
  if (lower.includes('cafetería') || lower.includes('bar') || lower.includes('café')) return Coffee;
  if (lower.includes('restaurante') || lower.includes('buffet') || lower.includes('menú') || lower.includes('cocina')) return UtensilsCrossed;
  if (lower.includes('piscina') || lower.includes('pileta')) return Waves;
  if (lower.includes('aire') || lower.includes('clima')) return Wind;
  if (lower.includes('calefacción') || lower.includes('fuego') || lower.includes('leña') || lower.includes('asador')) return Flame;
  if (lower.includes('terraza') || lower.includes('jardín') || lower.includes('parque')) return Trees;
  if (lower.includes('senderismo') || lower.includes('trekking') || lower.includes('paseo')) return Footprints;
  if (lower.includes('pesca')) return Fish;
  if (lower.includes('sala de juegos')) return Gamepad2;
  if (lower.includes('tv') || lower.includes('televisión')) return Tv;
  if (lower.includes('seguridad') || lower.includes('cámara') || lower.includes('extintor') || lower.includes('detector') || lower.includes('llave') || lower.includes('caja fuerte')) return ShieldCheck;
  if (lower.includes('equipaje') || lower.includes('maleta')) return Luggage;
  if (lower.includes('reuniones') || lower.includes('negocios')) return Briefcase;
  if (lower.includes('habitación') || lower.includes('silla de ruedas') || lower.includes('acceso')) return DoorOpen;
  if (lower.includes('limpieza') || lower.includes('lavandería')) return Sparkles;
  
  if (categoryIcon === 'mountain') return Mountain;
  if (categoryIcon === 'trees') return Trees;
  if (categoryIcon === 'coffee') return Coffee;
  if (categoryIcon === 'car') return Car;
  if (categoryIcon === 'wifi') return Wifi;
  if (categoryIcon === 'waves') return Waves;
  if (categoryIcon === 'shield') return ShieldCheck;
  return Check;
}

interface AccommodationAmenitiesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export const AccommodationAmenitiesDrawer: React.FC<AccommodationAmenitiesDrawerProps> = ({
  isOpen,
  onClose,
  title,
}) => {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimating(true));
      });
      return () => cancelAnimationFrame(raf);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, handleClose]);

  if (!isRendered || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Servicios e Instalaciones">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-stone-950/60 transition-opacity duration-300 cursor-pointer ${
          isAnimating ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Drawer: Recto en todos sus lados (sin bordes redondeados ni saltos de altura) */}
      <div
        className={`fixed top-0 bottom-0 right-0 w-full sm:w-[480px] md:w-[540px] bg-white shadow-2xl rounded-none border-l border-stone-200 flex flex-col h-full z-50 transition-transform duration-300 ease-out transform ${
          isAnimating ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header flush con el tope */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-sand-50 shrink-0">
          <div>
            <h3 className="font-display font-extrabold text-lg text-stone-900 leading-tight">Servicios e Instalaciones</h3>
            <p className="text-xs text-stone-500 mt-0.5">{title}</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer"
            aria-label="Cerrar panel de servicios"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories list limpia, sin puntitos naranjas ni cajas anidadas vibecoded */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 overscroll-contain">
          {ACCOMMODATION_SERVICES_CATALOG.map((group) => (
            <section key={group.category} className="space-y-3 pb-5 border-b border-stone-100 last:border-0">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-stone-700">
                {group.category}
              </h4>
              <ul className="space-y-1 text-xs">
                {group.items.map((item) => {
                  const Icon = getAmenityIcon(item.name, group.iconName);
                  return (
                    <li key={item.name} className="py-2 px-2.5 rounded-lg hover:bg-stone-100/50 transition-colors flex items-start gap-2.5">
                      <Icon className="w-4 h-4 text-uritorco-700 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-stone-900 text-xs sm:text-sm">{item.name}</span>
                        {item.badge && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider ${
                            item.badge === 'De pago' ? 'bg-stone-900 text-white' : 'bg-emerald-800 text-white'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{item.description}</p>
                      )}
                    </div>
                  </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
};