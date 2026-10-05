import React from 'react';
import { MapPin, Compass } from 'lucide-react';
import { Input } from '../../../ui/Input.tsx';
import { Select } from '../../../ui/Select.tsx';
import { Button } from '../../../ui/Button.tsx';

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
  const handleSetDefaultCoords = () => {
    // Coordenadas céntricas oficiales de Capilla del Monte
    setLatitude('-30.8570');
    setLongitude('-64.5150');
  };

  return (
    <div className="bg-white border border-[var(--color-sand-200)] rounded-2xl p-5 sm:p-6 flex flex-col gap-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--color-sand-200)]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[var(--color-sand-100)] text-[var(--color-terracotta-600)]">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--color-sand-900)] font-['Outfit']">
              Ubicación Geográfica y Barrio
            </h3>
            <p className="text-xs text-[var(--color-sand-500)]">
              Permite a los turistas localizar el hospedaje en el mapa interactivo del portal
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSetDefaultCoords}
          className="text-xs hidden sm:flex items-center gap-1.5"
          title="Fijar coordenadas céntricas de Capilla del Monte"
        >
          <Compass className="w-3.5 h-3.5 text-[var(--color-terracotta-500)]" />
          <span>Fijar coordenadas centro</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Dirección Física"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="ej. Camino a Los Terrones Km 3.5 o Calle Los Quebrachos 120"
          required
        />
        <Select
          label="Zona / Barrio de Capilla del Monte"
          value={locality}
          onChange={(e) => setLocality(e.target.value)}
          options={CAPILLA_ZONES}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div>
          <Input
            label="Latitud GPS (Decimal)"
            type="number"
            step="0.0001"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="-30.8570"
          />
          <span className="text-[11px] text-[var(--color-sand-400)] block mt-1">
            Latitud sur (ej. -30.8570).
          </span>
        </div>
        <div>
          <Input
            label="Longitud GPS (Decimal)"
            type="number"
            step="0.0001"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="-64.5150"
          />
          <span className="text-[11px] text-[var(--color-sand-400)] block mt-1">
            Longitud oeste (ej. -64.5150).
          </span>
        </div>
      </div>
    </div>
  );
};
