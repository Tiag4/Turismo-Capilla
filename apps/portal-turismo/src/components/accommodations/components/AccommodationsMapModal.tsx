import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin } from 'lucide-react';
import { InteractiveMapContainer } from '../../map/InteractiveMapContainer';

interface AccommodationsMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccommodationsMapModal: React.FC<AccommodationsMapModalProps> = ({ isOpen, onClose }) => {
  // Scroll Lock obligatorio (AGENTS.md 8.2)
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in-0 duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Contenedor del Modal */}
      <div className="relative w-full max-w-6xl h-[90vh] bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col z-10">
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
