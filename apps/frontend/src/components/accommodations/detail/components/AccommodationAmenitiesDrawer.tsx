import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, Check } from 'lucide-react';
import { ACCOMMODATION_SERVICES_CATALOG } from '../data/accommodation-services';

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
        className={`fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity duration-300 cursor-pointer ${
          isAnimating ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Drawer: Bottom-sheet on mobile / Slide-over on desktop */}
      <div
        className={`fixed bottom-0 left-0 right-0 md:left-auto md:top-0 md:bottom-0 md:right-0 w-full md:w-[500px] lg:w-[560px] bg-white shadow-2xl rounded-t-3xl md:rounded-t-none md:rounded-l-3xl border-t md:border-t-0 md:border-l border-stone-200 flex flex-col h-[94vh] max-h-[96vh] md:h-full md:max-h-full z-50 transition-all duration-300 ease-out transform ${
          isAnimating
            ? 'translate-y-0 opacity-100 md:translate-x-0 md:translate-y-0'
            : 'translate-y-full opacity-0 md:translate-x-full md:translate-y-0'
        }`}
      >
        {/* Mobile drag handle */}
        <div className="md:hidden pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-10 h-1 bg-stone-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-[#FAF8F5] shrink-0">
          <div>
            <h3 className="font-display font-black text-lg text-stone-900">Servicios e Instalaciones</h3>
            <p className="text-xs text-stone-500 font-medium">Equipamiento completo de {title}</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer"
            aria-label="Cerrar panel de servicios"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories list */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 overscroll-contain">
          {ACCOMMODATION_SERVICES_CATALOG.map((group) => (
            <section key={group.category} className="space-y-2.5 pb-4 border-b border-stone-100 last:border-0">
              <h4 className="font-display font-bold text-sm text-stone-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-terracotta-500" />
                <span>{group.category}</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {group.items.map((item) => (
                  <li key={item.name} className="p-2 rounded-xl bg-stone-50/80 border border-stone-200/60 flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-medium text-stone-800">{item.name}</span>
                        {item.badge && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                            item.badge === 'Gratis' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            item.badge === 'De pago' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">{item.description}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
};