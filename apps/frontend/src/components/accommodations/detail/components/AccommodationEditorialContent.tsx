import React from 'react';
import {
  CheckCircle2,
  Wifi,
  UtensilsCrossed,
  Bath,
  CircleParking,
  BedDouble,
  Sofa,
  Mountain,
  ShieldCheck,
} from 'lucide-react';
import type { AccommodationDetailData } from '../types';

interface AccommodationEditorialContentProps {
  data: AccommodationDetailData;
}

export const AccommodationEditorialContent: React.FC<AccommodationEditorialContentProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      {/* Columna Izquierda: Título, Badge, Descripción y Distribución de Dormitorios */}
      <div className="space-y-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-stone-900 tracking-tight leading-tight">
            {data.title}
          </h1>

          {/* Badge Verified Host idéntico a la comp */}
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 fill-blue-600 text-white shrink-0" />
            <span>Verified Host</span>
          </div>
        </div>

        {/* Párrafo descriptivo fiel a la captura */}
        <p className="text-sm text-stone-600 leading-relaxed font-normal pt-1">
          {data.fullDescription?.[0] ?? `${data.title} is an luxury rustic mountain cabin rental. 5-photo terrace. Construction and modern amenities to provide private vacation in Capilla del Monte, Cordoba, Argentina.`}
        </p>

        {/* Sección Bedroom en columna izquierda */}
        <div className="pt-4 space-y-1.5 border-t border-stone-100">
          <h3 className="font-display font-bold text-base text-stone-900">Bedroom</h3>
          <p className="text-sm text-stone-600 font-medium">Bedroom 1: King Bed</p>
          <p className="text-sm text-stone-600 font-medium">Bedroom 2: Twin Beds</p>
        </div>
      </div>

      {/* Columna Central: Bedroom y Clean Amenities (grilla 4x2) */}
      <div className="space-y-6">
        {/* Bedroom (duplicado/expandido idéntico a la captura) */}
        <div className="space-y-1.5">
          <h3 className="font-display font-bold text-base text-stone-900">Bedroom</h3>
          <p className="text-sm text-stone-600 font-medium">Bedroom 1: King Bed</p>
          <p className="text-sm text-stone-600 font-medium">Bedroom 2: Twin Beds</p>
        </div>

        {/* Clean Amenities con grilla de 8 íconos en 4 columnas */}
        <div className="space-y-4 pt-1">
          <h3 className="font-display font-bold text-base text-stone-900">Clean Amenities</h3>
          <div className="grid grid-cols-4 gap-y-6 gap-x-2 text-center">
            {/* Fila 1 */}
            <div className="flex flex-col items-center space-y-1.5">
              <Wifi className="w-5 h-5 text-stone-700" strokeWidth={1.75} />
              <span className="text-[11px] font-medium text-stone-700 leading-tight">Free Wi-Fi</span>
            </div>

            <div className="flex flex-col items-center space-y-1.5">
              <UtensilsCrossed className="w-5 h-5 text-stone-700" strokeWidth={1.75} />
              <span className="text-[11px] font-medium text-stone-700 leading-tight">Fully Equipped Kitchen</span>
            </div>

            <div className="flex flex-col items-center space-y-1.5">
              <Bath className="w-5 h-5 text-stone-700" strokeWidth={1.75} />
              <span className="text-[11px] font-medium text-stone-700 leading-tight">Hot Tub</span>
            </div>

            <div className="flex flex-col items-center space-y-1.5">
              <CircleParking className="w-5 h-5 text-stone-700" strokeWidth={1.75} />
              <span className="text-[11px] font-medium text-stone-700 leading-tight">Parking</span>
            </div>

            {/* Fila 2 */}
            <div className="flex flex-col items-center space-y-1.5">
              <BedDouble className="w-5 h-5 text-stone-700" strokeWidth={1.75} />
              <span className="text-[11px] font-medium text-stone-700 leading-tight">Bedroom / Rooms</span>
            </div>

            <div className="flex flex-col items-center space-y-1.5">
              <Sofa className="w-5 h-5 text-stone-700" strokeWidth={1.75} />
              <span className="text-[11px] font-medium text-stone-700 leading-tight">Living / Fireplace</span>
            </div>

            <div className="flex flex-col items-center space-y-1.5">
              <Mountain className="w-5 h-5 text-stone-700" strokeWidth={1.75} />
              <span className="text-[11px] font-medium text-stone-700 leading-tight">Scenic Views</span>
            </div>

            <div className="flex flex-col items-center space-y-1.5">
              <ShieldCheck className="w-5 h-5 text-stone-700" strokeWidth={1.75} />
              <span className="text-[11px] font-medium text-stone-700 leading-tight">Private Access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
