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

      {/* 2. VERSIÓN DESKTOP: Bento Grid Fotográfico Adaptativo según cantidad de imágenes reales */}
      <div className="hidden md:block relative">
        {images.length === 1 && (
          <div
            onClick={() => handleOpenGallery(0)}
            className="relative w-full h-[400px] lg:h-[480px] rounded-2xl sm:rounded-3xl overflow-hidden bg-sand-200 border border-sand-200/90 cursor-pointer group shadow-xs"
          >
            <img
              src={images[0]}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
              loading="eager"
            />
            <div className="absolute inset-0 bg-sand-950/0 group-hover:bg-sand-950/10 transition-colors" />
          </div>
        )}

        {images.length === 2 && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 h-[400px] lg:h-[460px] rounded-2xl sm:rounded-3xl overflow-hidden border border-sand-200/90 shadow-xs">
            {images.map((imgUrl, idx) => (
              <div
                key={imgUrl + idx}
                onClick={() => handleOpenGallery(idx)}
                className="relative h-full bg-sand-200 overflow-hidden cursor-pointer group"
              >
                <img
                  src={imgUrl}
                  alt={`${item.title} — Foto ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-sand-950/0 group-hover:bg-sand-950/10 transition-colors" />
              </div>
            ))}
          </div>
        )}

        {images.length === 3 && (
          <div className="grid grid-cols-12 gap-3 sm:gap-4 h-[420px] lg:h-[480px] rounded-2xl sm:rounded-3xl overflow-hidden border border-sand-200/90 shadow-xs">
            {/* Foto Principal */}
            <div
              onClick={() => handleOpenGallery(0)}
              className="col-span-7 relative h-full bg-sand-200 overflow-hidden cursor-pointer group"
            >
              <img
                src={images[0]}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                loading="eager"
              />
              <div className="absolute inset-0 bg-sand-950/0 group-hover:bg-sand-950/10 transition-colors" />
            </div>

            {/* 2 Fotos Secundarias Apiladas */}
            <div className="col-span-5 grid grid-rows-2 gap-3 sm:gap-4 h-full">
              {[1, 2].map((idx) => (
                <div
                  key={images[idx] + idx}
                  onClick={() => handleOpenGallery(idx)}
                  className="relative h-full bg-sand-200 overflow-hidden cursor-pointer group"
                >
                  <img
                    src={images[idx]}
                    alt={`${item.title} — Foto ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-sand-950/0 group-hover:bg-sand-950/10 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        )}

        {images.length === 4 && (
          <div className="grid grid-cols-12 gap-3 sm:gap-4 h-[420px] lg:h-[490px] rounded-2xl sm:rounded-3xl overflow-hidden border border-sand-200/90 shadow-xs">
            {/* Foto Principal (A la izquierda, con proporción balanceada) */}
            <div
              onClick={() => handleOpenGallery(0)}
              className="col-span-7 relative h-full bg-sand-200 overflow-hidden cursor-pointer group"
            >
              <img
                src={images[0]}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                loading="eager"
              />
              <div className="absolute inset-0 bg-sand-950/0 group-hover:bg-sand-950/10 transition-colors" />
            </div>

            {/* Columna Derecha de 3 Fotos: Foto 1 arriba (apaisada), Foto 2 y 3 abajo (verticales en 2 columnas) */}
            <div className="col-span-5 grid grid-rows-2 gap-3 sm:gap-4 h-full">
              {/* Foto 1 (Fila superior completa) */}
              <div
                onClick={() => handleOpenGallery(1)}
                className="relative h-full bg-sand-200 overflow-hidden cursor-pointer group rounded-xl sm:rounded-2xl"
              >
                <img
                  src={images[1]}
                  alt={`${item.title} — Foto 2`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-sand-950/0 group-hover:bg-sand-950/10 transition-colors" />
              </div>

              {/* Fila inferior dividida en 2 fotos verticales */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 h-full">
                {[2, 3].map((idx) => (
                  <div
                    key={images[idx] + idx}
                    onClick={() => handleOpenGallery(idx)}
                    className="relative h-full bg-sand-200 overflow-hidden cursor-pointer group rounded-xl sm:rounded-2xl"
                  >
                    <img
                      src={images[idx]}
                      alt={`${item.title} — Foto ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-sand-950/0 group-hover:bg-sand-950/10 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {images.length >= 5 && (
          <div className="grid grid-cols-12 gap-3 sm:gap-4 h-[420px] lg:h-[490px] rounded-2xl sm:rounded-3xl overflow-hidden border border-sand-200/90 shadow-xs">
            {/* Foto Principal */}
            <div
              onClick={() => handleOpenGallery(0)}
              className="col-span-6 relative h-full bg-sand-200 overflow-hidden cursor-pointer group"
            >
              <img
                src={images[0]}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                loading="eager"
              />
              <div className="absolute inset-0 bg-sand-950/0 group-hover:bg-sand-950/10 transition-colors" />
            </div>

            {/* 4 Fotos Secundarias en Grilla 2x2 */}
            <div className="col-span-6 grid grid-cols-2 grid-rows-2 gap-3 sm:gap-4 h-full">
              {images.slice(1, 5).map((imgUrl, idx) => {
                const photoIdx = idx + 1;
                return (
                  <div
                    key={imgUrl + idx}
                    onClick={() => handleOpenGallery(photoIdx)}
                    className="relative h-full bg-sand-200 overflow-hidden cursor-pointer group rounded-xl sm:rounded-2xl"
                  >
                    <img
                      src={imgUrl}
                      alt={`${item.title} — Foto ${photoIdx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-sand-950/0 group-hover:bg-sand-950/10 transition-colors" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Botón Flotante para Expandir Galería Completa */}
        <div className="absolute bottom-3.5 right-3.5 z-10 pointer-events-auto">
          <button
            type="button"
            onClick={() => handleOpenGallery(0)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/95 hover:bg-white text-sand-900 border border-sand-300/80 text-xs font-bold shadow-lg backdrop-blur-md transition-all cursor-pointer select-none hover:shadow-xl hover:scale-102 active:scale-98"
          >
            <Camera className="w-4 h-4 text-terracotta-600" />
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
