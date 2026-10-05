import React from 'react';
import { Sparkles, Flame, Trees, Wifi, Shield } from 'lucide-react';

export interface CategorizedAmenitiesSectionProps {
  selectedAmenities: string[];
  onToggleAmenity: (amenity: string) => void;
}

interface AmenityCategoryDefinition {
  title: string;
  icon: React.ElementType;
  items: string[];
}

const AMENITY_CATEGORIES: AmenityCategoryDefinition[] = [
  {
    title: 'Climatización & Calidez',
    icon: Flame,
    items: [
      'Hogar a leña / Salamandra nórdica',
      'Aire acondicionado frío/calor',
      'Calefacción a gas / tiro balanceado',
      'Ventilador de techo',
    ],
  },
  {
    title: 'Exteriores & Vistas Serranas',
    icon: Trees,
    items: [
      'Vista al Cerro Uritorco',
      'Piscina con solárium cercado',
      'Asador / Parrilla individual',
      'Parque arbolado autóctono',
      'Deck / Terraza privada',
      'Pet Friendly (Acepta mascotas)',
    ],
  },
  {
    title: 'Conectividad & Cocina',
    icon: Wifi,
    items: [
      'Wi-Fi Starlink / Fibra óptica',
      'Cocina equipada completa con horno',
      'Heladera con freezer y microondas',
      'Pava eléctrica y cafetera',
      'Desayuno serrano incluido',
    ],
  },
  {
    title: 'Seguridad & Comodidad',
    icon: Shield,
    items: [
      'Cochera individual cubierta',
      'Predio perimetrado con portón',
      'Ropa blanca y toallas incluidas',
      'Caja de seguridad',
    ],
  },
];

export const CategorizedAmenitiesSection: React.FC<CategorizedAmenitiesSectionProps> = ({
  selectedAmenities,
  onToggleAmenity,
}) => {
  return (
    <div className="bg-white border border-[var(--color-sand-200)] rounded-2xl p-5 sm:p-6 flex flex-col gap-5 shadow-xs">
      <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--color-sand-200)]">
        <div className="p-2 rounded-xl bg-[var(--color-sand-100)] text-[var(--color-terracotta-600)]">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[var(--color-sand-900)] font-['Outfit']">
            Comodidades y Servicios del Establecimiento
          </h3>
          <p className="text-xs text-[var(--color-sand-500)]">
            Organizadas en categorías temáticas para que el turista las identifique rápidamente
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {AMENITY_CATEGORIES.map((category) => {
          const CategoryIcon = category.icon;
          return (
            <div
              key={category.title}
              className="p-4 rounded-xl bg-[var(--color-sand-50)] border border-[var(--color-sand-200)] flex flex-col gap-2.5"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-sand-800)] uppercase tracking-wider">
                <CategoryIcon className="w-4 h-4 text-[var(--color-terracotta-500)]" />
                <span>{category.title}</span>
              </div>

              <div className="flex flex-col gap-1.5 pt-1">
                {category.items.map((item) => {
                  const isChecked = selectedAmenities.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => onToggleAmenity(item)}
                      className={`text-xs px-3 py-2 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'border-[var(--color-terracotta-500)] bg-[var(--color-terracotta-50)] text-[var(--color-terracotta-700)] font-bold'
                          : 'border-[var(--color-sand-300)] bg-white text-[var(--color-sand-700)] hover:bg-[var(--color-sand-100)]'
                      }`}
                    >
                      <span>{item}</span>
                      <span
                        className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
                          isChecked
                            ? 'bg-[var(--color-terracotta-600)] text-white'
                            : 'text-[var(--color-sand-400)]'
                        }`}
                      >
                        {isChecked ? '✓' : '+'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
