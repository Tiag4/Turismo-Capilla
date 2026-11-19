import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin } from 'lucide-react';
import { InteractiveMapContainer } from '../../map/InteractiveMapContainer';
import { useAnimatedPresence } from '../../../hooks/useAnimatedPresence';
import { useBodyScrollLock } from '../../../hooks/useBodyScrollLock';

interface AccommodationsMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccommodationsMapModal: React.FC<AccommodationsMapModalProps> = ({ isOpen, onClose }) => {
  const { shouldRender, isVisible } = useAnimatedPresence(isOpen, 200);
  useBodyScrollLock(shouldRender);
  // Scroll Lock obligatorio (AGENTS.md 8.2)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!shouldRender || typeof document === 'undefined') return null;

  return createPortal(
    <div className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Contenedor del Modal / Bottomsheet en móvil */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mapa Territorial de Alojamientos"
        className={`relative w-full max-w-6xl h-[92vh] sm:h-[90vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col z-10 transition-all duration-200 ease-out ${isVisible ? 'scale-100 translate-y-0 opacity-100' : 'sm:scale-95 translate-y-full sm:translate-y-3 opacity-0'}`}
      >
        {/* Mobile Drag Handle Pill */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center shrink-0 bg-[#FAF8F5]">
          <div className="w-12 h-1.5 bg-stone-300 rounded-full" />
        </div>

        {/* Barra Superior */}
        <div className="px-6 py-4 border-b border-stone-200 bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-terracotta-100 text-terracotta-700 rounded-xl">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-stone-900 leading-tight">
                Mapa Territorial de Alojamientos
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Pines de ubicación al pie del Cerro Uritorco con relieve topográfico Esri
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer"
            aria-label="Cerrar mapa"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mapa Interactivo */}
        <div className="flex-1 w-full h-full relative">
          <InteractiveMapContainer />
        </div>
      </div>
    </div>,
    document.body
  );
};
