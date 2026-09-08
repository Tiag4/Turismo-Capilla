import React from 'react';
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
  const mainPhoto = gallery[0];
  const secondaryPhotos = gallery.slice(1, 5);

  return (
    <section className="w-full max-w-[1360px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4">
        {/* Foto Principal (50% izquierda) */}
        <div
          onClick={() => onOpenGallery(0)}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer group h-[320px] sm:h-[400px] lg:h-[460px] shadow-sm bg-stone-100"
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
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4 h-[320px] sm:h-[400px] lg:h-[460px]">
          {secondaryPhotos.map((photoUrl, idx) => {
            const photoIndex = idx + 1;
            const isLast = idx === secondaryPhotos.length - 1;

            return (
              <div
                key={photoUrl + idx}
                onClick={() => onOpenGallery(photoIndex)}
                className="relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer group h-[152px] sm:h-[192px] lg:h-[222px] shadow-sm bg-stone-100"
              >
                <img
                  src={photoUrl}
                  alt={`${title} — Foto ${photoIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/10 transition-colors" />

                {/* Botón Flotante en la última foto */}
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
