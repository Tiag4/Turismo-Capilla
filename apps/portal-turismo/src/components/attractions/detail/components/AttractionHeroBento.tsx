import React from 'react';
import type { AttractionItem } from '../../types';

interface AttractionHeroBentoProps {
  item: AttractionItem;
}

export const AttractionHeroBento: React.FC<AttractionHeroBentoProps> = ({ item }) => {
  const images = item.galleryImages && item.galleryImages.length > 0
    ? item.galleryImages
    : [item.coverImage];

  const mainImg = images[0] || item.coverImage;
  const secondaryImg1 = images[1] || mainImg;
  const secondaryImg2 = images[2] || mainImg;

  const difficultyColors: Record<AttractionItem['difficulty'], string> = {
    Alta: 'bg-terracotta-600 text-white',
    Media: 'bg-amber-600 text-white',
    Baja: 'bg-uritorco-600 text-white',
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb de Navegación */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-sand-500 font-medium">
        <a href="/" className="hover:text-sand-900 transition-colors">Inicio</a>
        <span>/</span>
        <a href="/atractivos" className="hover:text-sand-900 transition-colors">Senderos & Paseos</a>
        <span>/</span>
        <span className="text-sand-900 font-semibold">{item.title}</span>
      </nav>

      {/* Título, Categoría y Rating */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-uritorco-700 bg-uritorco-100 px-2.5 py-1 rounded-md">
            {item.categoryLabel}
          </span>
          <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${difficultyColors[item.difficulty]}`}>
            Dificultad {item.difficulty}
          </span>
          <span className="text-xs text-sand-600 font-medium flex items-center gap-1">
            <svg className="w-4 h-4 text-amber-500 fill-amber-500" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <strong>{item.rating}</strong> ({item.reviewCount} reseñas)
          </span>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-sand-950 tracking-tight leading-tight">
          {item.title}
        </h1>
        <p className="text-sand-600 text-base sm:text-lg max-w-3xl leading-relaxed">
          {item.subtitle}
        </p>
      </div>

      {/* Bento Grid Fotográfico (Mobile 1 col, Desktop 3 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 rounded-2xl overflow-hidden h-[340px] sm:h-[440px]">
        <div className="md:col-span-2 relative h-full bg-sand-200 overflow-hidden group">
          <img
            src={mainImg}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="eager"
          />
        </div>
        <div className="hidden md:grid grid-rows-2 gap-3 sm:gap-4 h-full">
          <div className="relative h-full bg-sand-200 overflow-hidden group rounded-r-none">
            <img
              src={secondaryImg1}
              alt={`${item.title} detalle 1`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="relative h-full bg-sand-200 overflow-hidden group">
            <img
              src={secondaryImg2}
              alt={`${item.title} detalle 2`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
