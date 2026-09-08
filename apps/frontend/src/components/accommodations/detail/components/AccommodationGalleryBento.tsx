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
    <section className="relative rounded-3xl overflow-hidden shadow-xl border border-stone-200/80 bg-stone-100">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:h-[460px] lg:h-[520px]">
        {/* Foto Principal (Gran escala, ocupa 2 columnas) */}
        <div
          onClick={() => onOpenGallery(0)}
          className="md:col-span-2 h-72 md:h-full relative overflow-hidden group cursor-pointer"
        >
          <img
            src={mainPhoto}
            alt={`${title} — Vista principal`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* 4 Fotos Secundarias en Grilla 2x2 */}
        <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2 h-full">
          {secondaryPhotos.map((photoUrl, idx) => {
            const photoIndex = idx + 1;
            const isLast = idx === secondaryPhotos.length - 1;

            return (
              <div
                key={photoUrl + idx}
                onClick={() => onOpenGallery(photoIndex)}
                className="relative overflow-hidden group cursor-pointer h-[225px] lg:h-[255px]"
              >
                <img
                  src={photoUrl}
                  alt={`${title} — Foto ${photoIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/20 transition-colors" />

                {/* Botón Flotante en la última foto */}
                {isLast && (
                  <div className="absolute bottom-3 right-3 z-10">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenGallery(0);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-md text-stone-900 border border-stone-300 text-xs font-bold shadow-lg hover:bg-white hover:scale-105 transition-all cursor-pointer select-none"
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
