import React from 'react';
import { BedDouble, Flame, Trees, Wifi, Shield, Check, Plus } from 'lucide-react';

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
    title: 'Climatización y Confort Térmico',
    icon: Flame,
    items: [
      'Hogar a leña / Salamandra nórdica',
      'Aire acondicionado frío/calor',
      'Calefacción a gas / tiro balanceado',
      'Ventilador de techo',
    ],
  },
  {
    title: 'Exteriores y Vistas Serranas',
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
    title: 'Conectividad y Cocina',
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
    title: 'Seguridad y Servicios',
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
    <div className="bg-white border border-[var(--color-sand-200)] rounded-2xl p-5 sm:p-6 flex flex-col gap-6 shadow-xs">
      {/* Header with bare semantic icon, no sparkles */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--color-sand-200)]">
        <BedDouble className="w-5 h-5 text-[var(--color-terracotta-500)] shrink-0" />
        <div>
          <h3 className="text-base font-bold text-[var(--color-sand-900)] font-['Outfit']">
            Comodidades y Servicios del Establecimiento
          </h3>
          <p className="text-xs text-[var(--color-sand-500)]">
            Seleccioná los servicios confirmados para que los turistas los filtren en el catálogo
          </p>
        </div>
      </div>

      {/* Flat Categories Grid: No box-in-a-box nesting */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {AMENITY_CATEGORIES.map((category) => {
          const CategoryIcon = category.icon;
          return (
            <div key={category.title} className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-sand-800)]">
                <CategoryIcon className="w-4 h-4 text-[var(--color-terracotta-500)] shrink-0" />
                <span>{category.title}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => {
                  const isChecked = selectedAmenities.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => onToggleAmenity(item)}
                      className={`text-xs px-3 py-2 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 font-medium ${
                        isChecked
                          ? 'bg-[var(--color-terracotta-500)] text-white shadow-xs'
                          : 'bg-[var(--color-sand-100)] text-[var(--color-sand-800)] hover:bg-[var(--color-sand-200)]'
                      }`}
                    >
                      {isChecked ? (
                        <Check className="w-3.5 h-3.5 text-white shrink-0" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 text-[var(--color-sand-500)] shrink-0" />
                      )}
                      <span>{item}</span>
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
