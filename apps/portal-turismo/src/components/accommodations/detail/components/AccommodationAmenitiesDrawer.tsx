import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Check } from 'lucide-react';
import { getAccommodationAmenitiesCatalog, type AmenityCategoryDisplay } from '../utils/amenitiesCatalog';

interface AccommodationAmenitiesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  amenities?: string[];
  hasBreakfast?: boolean;
}

export const AccommodationAmenitiesDrawer: React.FC<AccommodationAmenitiesDrawerProps> = ({
  isOpen,
  onClose,
  title,
  amenities,
  hasBreakfast,
}) => {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  const catalog = useMemo(
    () => getAccommodationAmenitiesCatalog(amenities, hasBreakfast),
    [amenities, hasBreakfast],
  );

  const totalCount = useMemo(
    () => catalog.reduce((acc, cat) => acc + cat.items.length, 0),
    [catalog],
  );

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setIsAnimating(true)));
      return () => cancelAnimationFrame(raf);
    }
    setIsAnimating(false);
    const timer = setTimeout(() => setIsRendered(false), 300);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;


    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', onKey);
    return () => {

      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, handleClose]);

  if (!isRendered || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Servicios e Instalaciones">
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-stone-950/60 transition-opacity duration-300 cursor-pointer ${
          isAnimating ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      <div
        className={`fixed top-0 bottom-0 right-0 w-full sm:w-[480px] md:w-[540px] bg-white shadow-2xl rounded-none border-l border-stone-200 flex flex-col h-full z-50 transition-transform duration-300 ease-out transform ${
          isAnimating ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-sand-50 shrink-0">
          <div>
            <h3 className="font-display font-extrabold text-lg text-stone-900 leading-tight">Servicios e Instalaciones</h3>
            <p className="text-xs text-stone-500 mt-0.5">{title} — <strong className="text-stone-700">{totalCount} verificados</strong></p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
            aria-label="Cerrar panel de servicios"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1 overscroll-contain">
          {catalog.length > 0 ? (
            catalog.map((group: AmenityCategoryDisplay) => {
              const CategoryIcon = group.icon;
              return (
                <section key={group.title} className="space-y-3 pb-5 border-b border-stone-100 last:border-0">
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="w-4 h-4 text-terracotta-600" />
                    <h4 className="font-display font-bold text-xs uppercase tracking-wider text-stone-800">{group.title}</h4>
                  </div>
                  <ul className="space-y-2 text-xs">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.id} className="py-2 px-2.5 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-200/60 transition-colors flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-sand-100 flex items-center justify-center text-stone-700 shrink-0 mt-0.5">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-stone-900 text-xs sm:text-sm">{item.name}</span>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-uritorco-100 text-uritorco-800 inline-flex items-center gap-1">
                                <Check className="w-2.5 h-2.5" />
                                <span>{item.badge}</span>
                              </span>
                            </div>
                            <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{item.description}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-stone-500">No se registraron servicios detallados para este alojamiento.</div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};
