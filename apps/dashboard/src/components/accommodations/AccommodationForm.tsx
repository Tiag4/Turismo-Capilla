import React, { useState } from 'react';
import { Button } from '../ui/Button.tsx';
import { Input } from '../ui/Input.tsx';
import { Select } from '../ui/Select.tsx';
import type { Accommodation, AccommodationType, CreateAccommodationDto } from '../../types/accommodation.types.ts';

export interface AccommodationFormProps {
  initialData?: Accommodation | null;
  onSubmit: (dto: CreateAccommodationDto) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const AVAILABLE_AMENITIES = [
  'Piscina',
  'Vista al Cerro Uritorco',
  'Wi-Fi Starlink',
  'Parrilla individual',
  'Cochera cubierta',
  'Aire acondicionado',
  'Calefacción a leña',
  'Desayuno serrano',
  'Pet Friendly',
];

export const AccommodationForm: React.FC<AccommodationFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [type, setType] = useState<AccommodationType>(initialData?.type || 'CABIN');
  const [address, setAddress] = useState(initialData?.address || '');
  const [pricePerNight, setPricePerNight] = useState(initialData?.pricePerNight ? String(initialData.pricePerNight) : '75000');
  const [maxGuests, setMaxGuests] = useState(initialData?.maxGuests ? String(initialData.maxGuests) : '4');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialData?.amenities || ['Piscina', 'Wi-Fi Starlink', 'Parrilla individual']);
  const [imageUrl, setImageUrl] = useState(initialData?.images?.[0]?.url || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80');

  const handleToggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name,
      description,
      type,
      address,
      locality: 'Capilla del Monte',
      pricePerNight: Number(pricePerNight),
      maxGuests: Number(maxGuests),
      amenities: selectedAmenities,
      images: imageUrl ? [imageUrl] : [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Nombre del Establecimiento"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="ej. Cabañas Pircas del Uritorco"
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Tipo de Alojamiento"
          value={type}
          onChange={(e) => setType(e.target.value as AccommodationType)}
          options={[
            { value: 'CABIN', label: 'Cabaña' },
            { value: 'HOTEL', label: 'Hotel / Posada' },
            { value: 'APARTMENT', label: 'Departamento' },
            { value: 'HOSTEL', label: 'Hostel' },
            { value: 'CAMPING', label: 'Camping' },
          ]}
        />
        <Input
          label="Dirección en Capilla del Monte"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="ej. Camino a Los Terrones Km 2"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Tarifa por Noche (ARS)"
          type="number"
          value={pricePerNight}
          onChange={(e) => setPricePerNight(e.target.value)}
          required
        />
        <Input
          label="Capacidad Máxima (Personas)"
          type="number"
          min="1"
          max="20"
          value={maxGuests}
          onChange={(e) => setMaxGuests(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-sand-800)] block mb-2">
          Comodidades y Servicios
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {AVAILABLE_AMENITIES.map((amenity) => {
            const isChecked = selectedAmenities.includes(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => handleToggleAmenity(amenity)}
                className={`text-xs px-3 py-2 rounded-xl border text-left transition-colors cursor-pointer ${
                  isChecked
                    ? 'border-[var(--color-terracotta-500)] bg-[var(--color-terracotta-50)] text-[var(--color-terracotta-700)] font-semibold'
                    : 'border-[var(--color-sand-300)] bg-white text-[var(--color-sand-800)] hover:bg-[var(--color-sand-100)]'
                }`}
              >
                {isChecked ? '✓ ' : '+ '}
                {amenity}
              </button>
            );
          })}
        </div>
      </div>

      <Input
        label="URL de Fotografía Principal"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="https://..."
      />

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-sand-800)] block mb-1.5">
          Descripción del Hospedaje
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-xl border border-[var(--color-sand-300)] bg-white px-3.5 py-2.5 text-sm text-[var(--color-sand-900)] focus:outline-none focus:border-[var(--color-terracotta-500)]"
          placeholder="Describí las características de tu cabaña, vistas serranas, comodidades..."
          required
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-sand-200)]">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="terracotta" isLoading={isLoading}>
          {initialData ? 'Guardar Modificaciones' : 'Publicar Alojamiento'}
        </Button>
      </div>
    </form>
  );
};
