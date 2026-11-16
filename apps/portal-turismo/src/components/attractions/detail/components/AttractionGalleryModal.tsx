import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { useAnimatedPresence } from '../../../../hooks/useAnimatedPresence';
import { useBodyScrollLock } from '../../../../hooks/useBodyScrollLock';

export interface AttractionGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  gallery: string[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  title: string;
}

export const AttractionGalleryModal: React.FC<AttractionGalleryModalProps> = ({
  isOpen,
  onClose,
  gallery,
  activeIndex,
  onSelectIndex,
  title,
}) => {
  const { shouldRender, isVisible } = useAnimatedPresence(isOpen, 200);
  useBodyScrollLock(shouldRender);

  const handlePrev = useCallback(() => {
    if (gallery.length === 0) return;
    const prev = (activeIndex - 1 + gallery.length) % gallery.length;
    onSelectIndex(prev);
  }, [activeIndex, gallery.length, onSelectIndex]);

  const handleNext = useCallback(() => {
    if (gallery.length === 0) return;
    const next = (activeIndex + 1) % gallery.length;
    onSelectIndex(next);
  }, [activeIndex, gallery.length, onSelectIndex]);

  useEffect(() => {
    if (!shouldRender) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shouldRender, onClose, handleNext, handlePrev]);

  if (!shouldRender || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md p-3 sm:p-6 flex flex-col justify-between transition-opacity duration-200 select-none ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={`Galería de fotos de ${title}`}
      onClick={onClose}
    >
      {/* Barra Superior */}
      <div
        className="flex items-center justify-between text-white pb-3 border-b border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <Camera className="w-4 h-4 text-terracotta-400 shrink-0" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="font-display font-bold text-sm sm:text-base text-white truncate max-w-[200px] sm:max-w-md">
              {title}
            </span>
            <span className="text-xs text-stone-400">
              Foto {activeIndex + 1} de {gallery.length}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          aria-label="Cerrar galería"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Imagen Principal en Contenedor Seguro (object-contain sin recortes) */}
      <div
        className="relative flex-1 flex items-center justify-center py-2 sm:py-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {gallery.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 z-10 p-2.5 sm:p-3 rounded-full bg-stone-900/80 hover:bg-stone-900 text-white transition-transform hover:scale-110 cursor-pointer shadow-xl border border-white/10"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        <img
          src={gallery[activeIndex]}
          alt={`${title} — Foto ${activeIndex + 1}`}
          className="max-w-full max-h-[68vh] sm:max-h-[74vh] object-contain rounded-xl sm:rounded-2xl shadow-2xl transition-all"
        />

        {gallery.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 sm:right-6 z-10 p-2.5 sm:p-3 rounded-full bg-stone-900/80 hover:bg-stone-900 text-white transition-transform hover:scale-110 cursor-pointer shadow-xl border border-white/10"
            aria-label="Foto siguiente"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>

      {/* Tira de Miniaturas Inferior */}
      {gallery.length > 1 && (
        <div
          className="flex items-center justify-center gap-2 overflow-x-auto py-2 px-1 no-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          {gallery.map((url, idx) => (
            <button
              key={url + idx}
              type="button"
              onClick={() => onSelectIndex(idx)}
              className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                idx === activeIndex
                  ? 'border-terracotta-500 scale-105 opacity-100 shadow-md ring-2 ring-terracotta-500/30'
                  : 'border-transparent opacity-50 hover:opacity-90'
              }`}
              aria-label={`Ver foto ${idx + 1}`}
            >
              <img src={url} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  );
};
