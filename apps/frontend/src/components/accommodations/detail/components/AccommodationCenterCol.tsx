import React from 'react';
import {
  Wifi,
  UtensilsCrossed,
  Bath,
  CircleParking,
  BedDouble,
  Sofa,
  Mountain,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface AccommodationCenterColProps {
  onOpenAmenities?: () => void;
}

export const AccommodationCenterCol: React.FC<AccommodationCenterColProps> = ({ onOpenAmenities }) => {
  return (
    <div className="space-y-6">
      {/* Bedroom (duplicado/expandido idéntico a la captura) */}
      <div className="space-y-1.5">
        <h3 className="font-display font-bold text-base text-stone-900">Bedroom</h3>
        <p className="text-sm text-stone-600 font-medium">Bedroom 1: King Bed</p>
        <p className="text-sm text-stone-600 font-medium">Bedroom 2: Twin Beds</p>
      </div>

      {/* Clean Amenities con grilla fija de 4 columnas */}
      <div className="space-y-4 pt-1">
        <h3 className="font-display font-bold text-base text-stone-900">Clean Amenities</h3>
        <div
          className="gap-y-4 gap-x-2 text-center"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          }}
        >
          {/* Fila 1 */}
          <div className="flex flex-col items-center group">
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800 mb-1 group-hover:bg-terracotta-50 group-hover:text-terracotta-700 transition-colors">
              <Wifi className="w-5 h-5" strokeWidth={1.8} />
            </div>
            <span className="text-[11px] font-semibold text-stone-800 leading-tight">Free Wi-Fi</span>
          </div>

          <div className="flex flex-col items-center group">
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800 mb-1 group-hover:bg-terracotta-50 group-hover:text-terracotta-700 transition-colors">
              <UtensilsCrossed className="w-5 h-5" strokeWidth={1.8} />
            </div>
            <span className="text-[11px] font-semibold text-stone-800 leading-tight">Fully Equipped Kitchen</span>
          </div>

          <div className="flex flex-col items-center group">
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800 mb-1 group-hover:bg-terracotta-50 group-hover:text-terracotta-700 transition-colors">
              <Bath className="w-5 h-5" strokeWidth={1.8} />
            </div>
            <span className="text-[11px] font-semibold text-stone-800 leading-tight">Hot Tub</span>
          </div>

          <div className="flex flex-col items-center group">
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800 mb-1 group-hover:bg-terracotta-50 group-hover:text-terracotta-700 transition-colors">
              <CircleParking className="w-5 h-5" strokeWidth={1.8} />
            </div>
            <span className="text-[11px] font-semibold text-stone-800 leading-tight">Parking</span>
          </div>

          {/* Fila 2 */}
          <div className="flex flex-col items-center group">
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800 mb-1 group-hover:bg-terracotta-50 group-hover:text-terracotta-700 transition-colors">
              <BedDouble className="w-5 h-5" strokeWidth={1.8} />
            </div>
            <span className="text-[11px] font-semibold text-stone-800 leading-tight">Bedroom / Rooms</span>
          </div>

          <div className="flex flex-col items-center group">
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800 mb-1 group-hover:bg-terracotta-50 group-hover:text-terracotta-700 transition-colors">
              <Sofa className="w-5 h-5" strokeWidth={1.8} />
            </div>
            <span className="text-[11px] font-semibold text-stone-800 leading-tight">Living / Fireplace</span>
          </div>

          <div className="flex flex-col items-center group">
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800 mb-1 group-hover:bg-terracotta-50 group-hover:text-terracotta-700 transition-colors">
              <Mountain className="w-5 h-5" strokeWidth={1.8} />
            </div>
            <span className="text-[11px] font-semibold text-stone-800 leading-tight">Scenic Views</span>
          </div>

          <div className="flex flex-col items-center group">
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800 mb-1 group-hover:bg-terracotta-50 group-hover:text-terracotta-700 transition-colors">
              <ShieldCheck className="w-5 h-5" strokeWidth={1.8} />
            </div>
            <span className="text-[11px] font-semibold text-stone-800 leading-tight">Private Access</span>
          </div>
        </div>

        {onOpenAmenities && (
          <button
            type="button"
            onClick={onOpenAmenities}
            className="w-full mt-2 py-2.5 px-4 rounded-xl border border-stone-200 hover:border-stone-400 bg-stone-50/50 hover:bg-stone-100 text-stone-800 font-display font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer select-none"
          >
            <span>Ver los 40+ servicios completos</span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
          </button>
        )}
      </div>
    </div>
  );
};
