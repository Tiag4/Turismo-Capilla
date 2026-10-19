import React from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '../../../ui/Input.tsx';
import { CustomSelect } from '../../../ui/CustomSelect.tsx';
import { MapLocationPicker } from '../MapLocationPicker.tsx';

export interface LocationSectionProps {
  address: string;
  setAddress: (val: string) => void;
  locality: string;
  setLocality: (val: string) => void;
  latitude: string;
  setLatitude: (val: string) => void;
  longitude: string;
  setLongitude: (val: string) => void;
}

const CAPILLA_ZONES = [
  { value: 'Barrio La Banda', label: 'Barrio La Banda' },
  { value: 'Camino a Los Terrones', label: 'Camino a Los Terrones' },
  { value: 'Valle del Sol', label: 'Valle del Sol' },
  { value: 'El Zapato / Dique El Cajón', label: 'El Zapato / Dique El Cajón' },
  { value: 'Las Gemelas', label: 'Las Gemelas' },
  { value: 'San Esteban', label: 'San Esteban' },
  { value: 'Centro / Casco Histórico', label: 'Centro / Casco Histórico' },
  { value: 'Aguas Azules', label: 'Aguas Azules' },
  { value: 'Villa Cielo', label: 'Villa Cielo' },
  { value: 'Capilla del Monte (General)', label: 'Capilla del Monte (General)' },
];

export const LocationSection: React.FC<LocationSectionProps> = ({
  address,
  setAddress,
  locality,
  setLocality,
  latitude,
  setLatitude,
  longitude,
  setLongitude,
}) => {
  const numericLat = parseFloat(latitude) || -30.8654;
  const numericLng = parseFloat(longitude) || -64.5241;

  const handleLocationChange = (lat: number, lng: number, suggestedAddress?: string) => {
    setLatitude(lat.toString());
    setLongitude(lng.toString());
    if (suggestedAddress && !address.trim()) {
      setAddress(suggestedAddress);
    }
  };

  return (
    <div className="bg-white border border-[var(--color-sand-200)] rounded-2xl p-5 sm:p-6 flex flex-col gap-5 shadow-xs">
      {/* Header without pastel container on icon */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--color-sand-200)]">
        <MapPin className="w-5 h-5 text-[var(--color-terracotta-500)] shrink-0" />
        <div>
          <h3 className="text-base font-bold text-[var(--color-sand-900)] font-['Outfit']">
            Ubicación Geográfica y Barrio
          </h3>
          <p className="text-xs text-[var(--color-sand-500)]">
            Permite a los turistas localizar el hospedaje en el mapa interactivo del portal
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Dirección física"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="ej. Camino a Los Terrones Km 3.5 o Los Quebrachos 120"
          required
        />
        <CustomSelect
          label="Zona o barrio de Capilla del Monte"
          value={locality}
          onChange={(val) => setLocality(val)}
          options={CAPILLA_ZONES}
        />
      </div>

      {/* Interactive Map with Leaflet and OpenStreetMap Nominatim */}
      <div className="flex flex-col gap-2 pt-1">
        <label className="text-xs font-semibold text-[var(--color-sand-800)]">
          Punto en mapa interactivo
        </label>
        <MapLocationPicker
          latitude={numericLat}
          longitude={numericLng}
          address={address}
          onLocationChange={handleLocationChange}
        />
      </div>

      {/* Numeric Coordinates display / manual fine-tuning */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div>
          <Input
            label="Latitud GPS (decimal)"
            type="number"
            step="0.000001"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="-30.8654"
          />
          <span className="text-[10px] text-[var(--color-sand-400)] mt-1 block">
            Latitud sur (ej. -30.8570)
          </span>
        </div>
        <div>
          <Input
            label="Longitud GPS (decimal)"
            type="number"
            step="0.000001"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="-64.5241"
          />
          <span className="text-[10px] text-[var(--color-sand-400)] mt-1 block">
            Longitud oeste (ej. -64.5150)
          </span>
        </div>
      </div>
    </div>
  );
};
