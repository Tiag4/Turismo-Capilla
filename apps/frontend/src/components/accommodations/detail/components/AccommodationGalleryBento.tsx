import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface AccommodationGalleryBentoProps {
  gallery: string[];
  title: string;
  onOpenGallery: (index: number) => void;
}

export const AccommodationGalleryBento: React.FC<AccommodationGalleryBentoProps> = ({
  gallery,
  title,
  onOpenGallery,
}) => {
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const mainPhoto = gallery[0];
  const secondaryPhotos = gallery.slice(1, 5);

  const handleMobileScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const scrollLeft = el.scrollLeft;
    const width = el.clientWidth;
    if (width > 0) {
      const idx = Math.round(scrollLeft / width);
      setMobileActiveIndex(idx);
    }
  };

  return (
    <section className="w-full max-w-[1360px] mx-auto">
      {/* 1. Versión Mobile: Carrusel Swipeable Snap-Scroll con indicador (1/5) */}
      <div className="md:hidden relative rounded-2xl overflow-hidden shadow-sm bg-stone-100">
        <div
          onScroll={handleMobileScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none h-[280px] sm:h-[340px]"
          style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
        >
          {gallery.map((photoUrl, idx) => (
            <div
              key={photoUrl + idx}
              onClick={() => onOpenGallery(idx)}
              className="w-full shrink-0 snap-center h-full relative cursor-pointer"
            >
              <img
                src={photoUrl}
                alt={`${title} — Foto ${idx + 1}`}
                className="w-full h-full object-cover"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>

        {/* Badge Indicador de Foto 1/5 */}
        <div className="absolute bottom-3 right-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-950/75 backdrop-blur-md text-white text-xs font-semibold select-none">
            <ImageIcon className="w-3.5 h-3.5 text-terracotta-400" />
            <span>{mobileActiveIndex + 1} / {gallery.length}</span>
          </span>
        </div>
      </div>

      {/* 2. Versión Desktop: Grilla Asimétrica Bento de 5 Fotos */}
      <div className="hidden md:grid md:grid-cols-2 gap-3.5 sm:gap-4">
        {/* Foto Principal (50% izquierda) */}
        <div
          onClick={() => onOpenGallery(0)}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer group h-[400px] lg:h-[460px] shadow-sm bg-stone-100"
        >
          <img
            src={mainPhoto}
            alt={`${title} — Vista principal terraza`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="eager"
          />
          <div className="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/10 transition-colors" />
        </div>

        {/* 4 Fotos Secundarias en Grilla 2x2 (50% derecha) */}
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4 h-[400px] lg:h-[460px]">
          {secondaryPhotos.map((photoUrl, idx) => {
            const photoIndex = idx + 1;
            const isLast = idx === secondaryPhotos.length - 1;

            return (
              <div
                key={photoUrl + idx}
                onClick={() => onOpenGallery(photoIndex)}
                className="relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer group h-[192px] lg:h-[222px] shadow-sm bg-stone-100"
              >
                <img
                  src={photoUrl}
                  alt={`${title} — Foto ${photoIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/10 transition-colors" />

                {isLast && (
                  <div className="absolute bottom-3 right-3 z-10">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenGallery(0);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md text-stone-900 border border-stone-200 text-xs font-bold shadow-md hover:bg-white transition-all cursor-pointer select-none"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-terracotta-600" />
                      <span>Ver {gallery.length} fotos</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
