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
} from 'lucide-react';

export const AccommodationCenterCol: React.FC = () => {
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
          className="gap-y-6 gap-x-2 text-center"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          }}
        >
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
  );
};
