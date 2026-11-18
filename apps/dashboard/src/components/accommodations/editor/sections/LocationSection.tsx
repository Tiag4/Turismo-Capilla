import React, { useState } from 'react';
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

const PREDEFINED_ZONES = [
  'Barrio La Banda',
  'Camino a Los Terrones',
  'Valle del Sol',
  'El Zapato / Dique El Cajón',
  'Las Gemelas',
  'San Esteban',
  'Centro / Casco Histórico',
  'Aguas Azules',
  'Villa Cielo',
  'Capilla del Monte (General)',
];

const OTHER_ZONE_VALUE = '__OTHER__';

const CAPILLA_ZONES = [
  { value: OTHER_ZONE_VALUE, label: 'Otro' },
  ...PREDEFINED_ZONES.map((z) => ({ value: z, label: z })),
];

export const LocationSection: React.FC<LocationSectionProps> = ({
  address, setAddress, locality, setLocality, latitude, setLatitude, longitude, setLongitude,
}) => {
  const numericLat = parseFloat(latitude) || -30.8654;
  const numericLng = parseFloat(longitude) || -64.5241;
  const isPredefined = PREDEFINED_ZONES.includes(locality);
  const [isOtherSelected, setIsOtherSelected] = useState<boolean>(() => !isPredefined);
  const selectValue = isOtherSelected || !isPredefined ? OTHER_ZONE_VALUE : locality;

  const handleZoneChange = (val: string) => {
    if (val === OTHER_ZONE_VALUE) {
      setIsOtherSelected(true);
      if (PREDEFINED_ZONES.includes(locality)) setLocality('');
    } else {
      setIsOtherSelected(false);
      setLocality(val);
    }
  };

  const handleLocationChange = (lat: number, lng: number, suggestedAddress?: string) => {
    setLatitude(lat.toString());
    setLongitude(lng.toString());
    if (suggestedAddress && !address.trim()) setAddress(suggestedAddress);
  };

  return (
    <div className="bg-white border border-[var(--color-sand-200)] rounded-2xl p-5 sm:p-6 flex flex-col gap-5 shadow-xs">
      <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--color-sand-200)]">
        <MapPin className="w-5 h-5 text-[var(--color-terracotta-500)] shrink-0" aria-hidden="true" />
        <div>
          <h3 className="text-base font-bold text-[var(--color-sand-900)] font-['Outfit']">
            Ubicación Geográfica y Barrio
          </h3>
          <p className="text-xs text-[var(--color-sand-500)]">
            Permite a los turistas localizar el hospedaje en el mapa interactivo del portal
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <Input
          label="Dirección física"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="ej. Camino a Los Terrones Km 3.5 o Los Quebrachos 120"
          tooltip="Calle y altura o referencia clara para que el huésped llegue sin inconvenientes."
          required
        />
        <div className="flex flex-col gap-3">
          <CustomSelect
            label="Zona o barrio de Capilla del Monte"
            value={selectValue}
            onChange={handleZoneChange}
            options={CAPILLA_ZONES}
            tooltip="Zona turística o paraje serrano para los filtros del mapa y del catálogo."
          />
          {selectValue === OTHER_ZONE_VALUE && (
            <Input
              label="Nombre del barrio o paraje"
              value={isPredefined ? '' : locality}
              onChange={(e) => setLocality(e.target.value)}
              placeholder="Ej. Barrio Balumba, Atalaya, Las Flores..."
              helperText="Ingresá el nombre del barrio o zona donde se ubica el alojamiento."
              required
            />
          )}
        </div>
      </div>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div>
          <Input
            label="Latitud GPS (decimal)" type="number" step="0.000001"
            value={latitude} onChange={(e) => setLatitude(e.target.value)}
            placeholder="-30.8654" tooltip="Coordenada geográfica de latitud sur (ej. -30.8640)."
          />
          <span className="text-[10px] text-[var(--color-sand-400)] mt-1 block">Latitud sur (ej. -30.8570)</span>
        </div>
        <div>
          <Input
            label="Longitud GPS (decimal)" type="number" step="0.000001"
            value={longitude} onChange={(e) => setLongitude(e.target.value)}
            placeholder="-64.5241" tooltip="Coordenada geográfica de longitud oeste (ej. -64.5310)."
          />
          <span className="text-[10px] text-[var(--color-sand-400)] mt-1 block">Longitud oeste (ej. -64.5150)</span>
        </div>
      </div>
    </div>
  );
};
