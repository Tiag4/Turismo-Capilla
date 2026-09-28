import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface AccommodationGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  gallery: string[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  onNext: () => void;
  onPrev: () => void;
  title: string;
}

export const AccommodationGalleryModal: React.FC<AccommodationGalleryModalProps> = ({
  isOpen,
  onClose,
  gallery,
  activeIndex,
  onSelectIndex,
  onNext,
  onPrev,
  title,
}) => {
  // Scroll Lock obligatorio (AGENTS.md 8.2)
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md p-4 sm:p-6 flex flex-col justify-between animate-in fade-in-0 duration-200"
      role="dialog"
      aria-modal="true"
      aria-label={`Galería de ${title}`}
    >
      {/* Barra Superior */}
      <div className="flex items-center justify-between text-white pb-3 border-b border-white/10">
        <div>
          <span className="font-display font-black text-base text-white">{title}</span>
          <span className="text-xs text-stone-400 ml-2">
            Foto {activeIndex + 1} de {gallery.length}
          </span>
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

      {/* Imagen Principal con Flechas */}
      <div className="relative flex-1 flex items-center justify-center py-4 overflow-hidden">
        <button
          type="button"
          onClick={onPrev}
          className="absolute left-2 sm:left-6 z-10 p-3 rounded-full bg-stone-900/80 hover:bg-stone-900 text-white transition-transform hover:scale-110 cursor-pointer shadow-xl"
          aria-label="Foto anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <img
          src={gallery[activeIndex]}
          alt={`${title} — Foto ${activeIndex + 1}`}
          className="max-w-full max-h-[72vh] object-contain rounded-2xl shadow-2xl transition-all select-none"
        />

        <button
          type="button"
          onClick={onNext}
          className="absolute right-2 sm:right-6 z-10 p-3 rounded-full bg-stone-900/80 hover:bg-stone-900 text-white transition-transform hover:scale-110 cursor-pointer shadow-xl"
          aria-label="Foto siguiente"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Tira de Miniaturas Inferior */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
        {gallery.map((url, idx) => (
          <button
            key={url + idx}
            type="button"
            onClick={() => onSelectIndex(idx)}
            className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
              idx === activeIndex
                ? 'border-terracotta-500 scale-105 opacity-100 shadow-md'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <img src={url} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
};
