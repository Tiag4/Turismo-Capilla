import React from 'react';
import { MapPin } from 'lucide-react';
import { InteractiveMapContainer } from '../../map/InteractiveMapContainer';
import { AdaptiveModal } from '../../ui/AdaptiveModal';
import type { MapPlace } from '../../../data/mock-places';

interface AccommodationsMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  places?: MapPlace[];
}

export const AccommodationsMapModal: React.FC<AccommodationsMapModalProps> = ({ isOpen, onClose, places }) => {
  return (
    <AdaptiveModal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      heightClassName="h-[92vh] sm:h-[90vh]"
      headerClassName="bg-[#FAF8F5]"
      bodyClassName="p-0 relative w-full h-full"
      title={
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-terracotta-100 text-terracotta-700 rounded-xl shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="font-display font-black text-lg text-stone-900 leading-tight block">
              Mapa Territorial de Alojamientos
            </span>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Pines de ubicación al pie del Cerro Uritorco con relieve topográfico Esri
            </p>
          </div>
        </div>
      }
    >
      <div className="w-full h-full min-h-[400px] relative">
        <InteractiveMapContainer places={places} showFilters={false} heightClassName="h-full" />
      </div>
    </AdaptiveModal>
  );
};
