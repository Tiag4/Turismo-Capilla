import React, { useState } from 'react';
import { Camera, Maximize2 } from 'lucide-react';
import type { AttractionItem } from '../../types';
import { AttractionGalleryModal } from './AttractionGalleryModal';

interface AttractionHeroBentoProps {
  item: AttractionItem;
}

export const AttractionHeroBento: React.FC<AttractionHeroBentoProps> = ({ item }) => {
  const images = item.galleryImages && item.galleryImages.length > 0
    ? item.galleryImages
    : [item.coverImage];

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);

  const handleOpenGallery = (index: number) => {
    setActivePhotoIndex(index);
    setIsGalleryOpen(true);
  };

  const handleMobileScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const scrollLeft = el.scrollLeft;
    const width = el.clientWidth;
    if (width > 0) {
      const idx = Math.round(scrollLeft / width);
      setMobileActiveIndex(idx);
    }
  };

  const difficultyTextColors: Record<AttractionItem['difficulty'], string> = {
    Alta: 'text-terracotta-600',
    Media: 'text-amber-700',
    Baja: 'text-uritorco-700',
  };

  const isUrban = !item.isTrekking && item.category === 'cultura';
  const isCasonasHeritage = item.slug === 'casonas' || item.slug === 'calle-techada' || item.id === 'att-8';

  return (
    <div className="space-y-5">
      {/* Breadcrumb Limpio */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-sand-600 font-medium">
        <a href="/" className="hover:text-sand-950 transition-colors">Inicio</a>
        <span>/</span>
        <a href="/atractivos" className="hover:text-sand-950 transition-colors">Senderos & Paseos</a>
        <span>/</span>
        <span className="text-sand-950 font-bold">{item.title}</span>
      </nav>

      {/* Cabecera Editorial Limpia */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          {!isCasonasHeritage && (
            <>
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-sand-900 text-white">
                {item.categoryLabel}
              </span>
              {!isUrban && (
                <span className={`text-xs font-extrabold uppercase tracking-wider ${difficultyTextColors[item.difficulty]}`}>
                  · Dificultad {item.difficulty}
                </span>
              )}
            </>
          )}
          <span className="text-xs text-sand-700 font-bold flex items-center gap-1 ml-1">
            <svg className="w-3.5 h-3.5 text-amber-500 fill-amber-500" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{item.rating}</span>
            <span className="text-sand-500 font-normal">({item.reviewCount} reseñas)</span>
          </span>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-sand-950 tracking-tight leading-tight">
          {item.title}
        </h1>
        <p className="text-sand-600 text-base sm:text-lg max-w-3xl leading-relaxed">
          {item.subtitle}
        </p>
      </div>

      {/* 1. VERSIÓN MOBILE: Carrusel Táctil Swipeable con Snap Scroll e Indicador */}
      <div className="md:hidden relative rounded-2xl overflow-hidden shadow-xs bg-sand-200 border border-sand-200">
        <div
          onScroll={handleMobileScroll}
          className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar h-[280px] sm:h-[340px]"
          style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
        >
          {images.map((imgUrl, idx) => (
            <div
              key={imgUrl + idx}
              onClick={() => handleOpenGallery(idx)}
              className="w-full shrink-0 snap-center h-full relative cursor-pointer group"
            >
              <img
                src={imgUrl}
                alt={`${item.title} — Foto ${idx + 1}`}
                className="w-full h-full object-cover"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 bg-sand-950/0 active:bg-sand-950/20 transition-colors" />
            </div>
          ))}
        </div>

        {/* Badge Indicador de Fotos en Mobile */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleOpenGallery(mobileActiveIndex)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sand-950/80 backdrop-blur-md text-white text-xs font-semibold select-none cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-terracotta-400" />
            <span>{mobileActiveIndex + 1} / {images.length}</span>
            <Maximize2 className="w-3 h-3 text-sand-300 ml-0.5" />
          </button>
        </div>
      </div>

      {/* 2. VERSIÓN DESKTOP: Bento Grid Fotográfico Equilibrado (Máximo 4 imágenes en preview) */}
      <div className="hidden md:block relative">
        {images.length === 1 && (
          <div
            onClick={() => handleOpenGallery(0)}
            className="relative w-full h-[440px] lg:h-[520px] rounded-2xl sm:rounded-3xl overflow-hidden bg-sand-200 border border-sand-200/90 cursor-pointer group shadow-xs"
          >
            <img
              src={images[0]}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
              loading="eager"
            />
            <div className="absolute inset-0 bg-sand-950/0 group-hover:bg-sand-950/10 transition-colors" />
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-sand-950/60 backdrop-blur-xs p-2 rounded-xl text-white pointer-events-none">
              <Maximize2 className="w-4 h-4" />
            </div>
          </div>
        )}

        {images.length === 2 && (
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4 h-[440px] lg:h-[520px] rounded-2xl sm:rounded-3xl overflow-hidden border border-sand-200/90 shadow-xs">
            {images.map((imgUrl, idx) => (
              <div
                key={imgUrl + idx}
                onClick={() => handleOpenGallery(idx)}
                className="relative h-full min-h-0 bg-sand-200 overflow-hidden cursor-pointer group rounded-xl sm:rounded-2xl"
              >
                <img
                  src={imgUrl}
                  alt={`${item.title} — Foto ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-sand-950/0 group-hover:bg-sand-950/10 transition-colors" />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-sand-950/60 backdrop-blur-xs p-2 rounded-xl text-white pointer-events-none">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {images.length === 3 && (
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4 h-[460px] lg:h-[520px] rounded-2xl sm:rounded-3xl overflow-hidden border border-sand-200/90 shadow-xs">
            {/* Foto Principal (50% izquierda) */}
            <div
              onClick={() => handleOpenGallery(0)}
              className="relative h-full min-h-0 bg-sand-200 overflow-hidden cursor-pointer group rounded-xl sm:rounded-2xl"
            >
              <img
                src={images[0]}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                loading="eager"
              />
              <div className="absolute inset-0 bg-sand-950/0 group-hover:bg-sand-950/10 transition-colors" />
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-sand-950/60 backdrop-blur-xs p-2 rounded-xl text-white pointer-events-none">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>

            {/* 2 Fotos Secundarias (50% derecha, 2 filas de 50% de alto cada una) */}
            <div className="flex flex-col gap-3.5 sm:gap-4 h-full min-h-0">
              {[1, 2].map((idx) => (
                <div
                  key={images[idx] + idx}
                  onClick={() => handleOpenGallery(idx)}
                  className="flex-1 min-h-0 relative bg-sand-200 overflow-hidden cursor-pointer group rounded-xl sm:rounded-2xl"
                >
                  <img
                    src={images[idx]}
                    alt={`${item.title} — Foto ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-sand-950/0 group-hover:bg-sand-950/10 transition-colors" />
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-sand-950/60 backdrop-blur-xs p-2 rounded-xl text-white pointer-events-none">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {images.length >= 4 && (
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4 h-[460px] sm:h-[500px] lg:h-[540px] rounded-2xl sm:rounded-3xl overflow-hidden border border-sand-200/90 shadow-xs">
            {/* Foto Principal (50% izquierda, altura completa con proporción cómoda) */}
            <div
              onClick={() => handleOpenGallery(0)}
              className="relative h-full min-h-0 bg-sand-200 overflow-hidden cursor-pointer group rounded-xl sm:rounded-2xl"
            >
              <img
                src={images[0]}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                loading="eager"
              />
              <div className="absolute inset-0 bg-sand-950/0 group-hover:bg-sand-950/10 transition-colors" />
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-sand-950/60 backdrop-blur-xs p-2 rounded-xl text-white pointer-events-none">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>

            {/* Columna Derecha (50% ancho, 2 filas de 50% de alto exactas e inamovibles) */}
            <div className="flex flex-col gap-3.5 sm:gap-4 h-full min-h-0">
              {/* Foto 2 (Fila superior: ocupa el 50% de la altura total) */}
              <div
                onClick={() => handleOpenGallery(1)}
                className="flex-1 min-h-0 relative bg-sand-200 overflow-hidden cursor-pointer group rounded-xl sm:rounded-2xl"
              >
                <img
                  src={images[1]}
                  alt={`${item.title} — Foto 2`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-sand-950/0 group-hover:bg-sand-950/10 transition-colors" />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-sand-950/60 backdrop-blur-xs p-2 rounded-xl text-white pointer-events-none">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              {/* Fila inferior (50% de la altura total, dividida en 2 fotos de igual ancho) */}
              <div className="flex-1 min-h-0 grid grid-cols-2 gap-3.5 sm:gap-4">
                {/* Foto 3 */}
                <div
                  onClick={() => handleOpenGallery(2)}
                  className="h-full min-h-0 relative bg-sand-200 overflow-hidden cursor-pointer group rounded-xl sm:rounded-2xl"
                >
                  <img
                    src={images[2]}
                    alt={`${item.title} — Foto 3`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-sand-950/0 group-hover:bg-sand-950/10 transition-colors" />
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-sand-950/60 backdrop-blur-xs p-2 rounded-xl text-white pointer-events-none">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                {/* Foto 4 */}
                <div
                  onClick={() => handleOpenGallery(3)}
                  className="h-full min-h-0 relative bg-sand-200 overflow-hidden cursor-pointer group rounded-xl sm:rounded-2xl"
                >
                  <img
                    src={images[3]}
                    alt={`${item.title} — Foto 4`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-sand-950/0 group-hover:bg-sand-950/10 transition-colors" />
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-sand-950/60 backdrop-blur-xs p-2 rounded-xl text-white pointer-events-none">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botón Flotante para Expandir Galería Completa */}
        <div className="absolute bottom-3.5 right-3.5 z-10 pointer-events-auto">
          <button
            type="button"
            onClick={() => handleOpenGallery(0)}
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-sand-950/85 hover:bg-sand-950 text-white text-xs font-bold shadow-lg backdrop-blur-md transition-all cursor-pointer select-none hover:scale-102 active:scale-98 border border-white/20"
          >
            <Camera className="w-3.5 h-3.5 text-terracotta-400" />
            <span>Ver galería ({images.length} fotos)</span>
          </button>
        </div>
      </div>

      {/* Modal de Galería Pantalla Completa (LightBox con object-contain) */}
      <AttractionGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        gallery={images}
        activeIndex={activePhotoIndex}
        onSelectIndex={setActivePhotoIndex}
        title={item.title}
      />
    </div>
  );
};
