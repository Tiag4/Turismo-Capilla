import React from 'react';
import {
  Wifi,
  Flame,
  Waves,
  Car,
  Coffee,
  Trees,
  Shield,
  Wind,
  Tv,
  Utensils,
  CheckCircle2,
} from 'lucide-react';
import type { AmenityCategory, AmenityItem } from '../types';

interface AccommodationAmenitiesListProps {
  categories: AmenityCategory[];
}

function renderAmenityIcon(iconName: AmenityItem['iconName']) {
  const iconProps = { className: 'w-4 h-4 text-primary-700 shrink-0' };
  switch (iconName) {
    case 'wifi':
      return <Wifi {...iconProps} />;
    case 'flame':
      return <Flame {...iconProps} />;
    case 'waves':
      return <Waves {...iconProps} />;
    case 'car':
      return <Car {...iconProps} />;
    case 'coffee':
      return <Coffee {...iconProps} />;
    case 'trees':
      return <Trees {...iconProps} />;
    case 'shield':
      return <Shield {...iconProps} />;
    case 'wind':
      return <Wind {...iconProps} />;
    case 'tv':
      return <Tv {...iconProps} />;
    case 'utensils':
      return <Utensils {...iconProps} />;
    default:
      return <CheckCircle2 {...iconProps} />;
  }
}

export const AccommodationAmenitiesList: React.FC<AccommodationAmenitiesListProps> = ({ categories }) => {
  return (
    <section className="space-y-6 pt-6 border-t border-stone-200/80">
      <div>
        <h2 className="font-display font-black text-xl text-stone-900">
          Comodidades y Servicios incluidos
        </h2>
        <p className="text-xs text-stone-500 font-medium mt-0.5">
          Equipamiento verificado para estadías de descanso y desconexión
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.category}
            className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3"
          >
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-terracotta-700">
              {cat.category}
            </h3>

            <ul className="space-y-2.5 text-xs text-stone-700 font-semibold">
              {cat.items.map((item) => (
                <li key={item.label} className="flex items-center gap-2.5">
                  {renderAmenityIcon(item.iconName)}
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};
