import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '../../ui/Button.tsx';
import type {
  Accommodation,
  AccommodationType,
  CreateAccommodationDto,
  AccommodationImage,
} from '../../../types/accommodation.types.ts';
import { GeneralInfoSection } from './sections/GeneralInfoSection.tsx';
import { LocationSection } from './sections/LocationSection.tsx';
import { PricingCapacitySection } from './sections/PricingCapacitySection.tsx';
import { CategorizedAmenitiesSection } from './sections/CategorizedAmenitiesSection.tsx';
import { ImageGalleryUploader } from '../ImageGalleryUploader.tsx';

export interface AccommodationEditorFormProps {
  initialData?: Accommodation | null;
  mode: 'create' | 'edit';
  onSubmit: (dto: CreateAccommodationDto) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const AccommodationEditorForm: React.FC<AccommodationEditorFormProps> = ({
  initialData,
  mode,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [type, setType] = useState<AccommodationType>(initialData?.type || 'CABIN');
  const [address, setAddress] = useState(initialData?.address || '');
  const [locality, setLocality] = useState(initialData?.locality || 'Barrio La Banda');
  const [latitude, setLatitude] = useState(initialData?.latitude != null ? String(initialData.latitude) : '-30.8570');
  const [longitude, setLongitude] = useState(initialData?.longitude != null ? String(initialData.longitude) : '-64.5150');
  const [pricePerNight, setPricePerNight] = useState(
    initialData?.pricePerNight ? String(initialData.pricePerNight) : '85000'
  );
  const [maxGuests, setMaxGuests] = useState(initialData?.maxGuests ? String(initialData.maxGuests) : '4');
  const [checkIn, setCheckIn] = useState('14:00 hs');
  const [checkOut, setCheckOut] = useState('10:00 hs');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialData?.amenities && initialData.amenities.length > 0
      ? initialData.amenities
      : [
          'Wi-Fi Starlink / Fibra óptica',
          'Piscina con solárium cercado',
          'Asador / Parrilla individual',
          'Vista al Cerro Uritorco',
          'Cochera individual cubierta',
        ]
  );
  const [images, setImages] = useState<AccommodationImage[]>(
    initialData?.images && initialData.images.length > 0
      ? initialData.images
      : [
          {
            id: 'img-def-1',
            url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
            isMain: true,
          },
          {
            id: 'img-def-2',
            url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
            isMain: false,
          },
        ]
  );

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
      locality,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      pricePerNight: Number(pricePerNight),
      maxGuests: Number(maxGuests),
      amenities: selectedAmenities,
      images,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header and Back navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--color-sand-200)]">
        <div>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-sand-600)] hover:text-[var(--color-sand-900)] transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al listado de cabañas</span>
          </button>

          <h2 className="text-2xl font-black text-[var(--color-sand-900)] font-['Outfit'] tracking-tight">
            {mode === 'edit'
              ? `Editar Alojamiento: ${initialData?.name || 'Establecimiento'}`
              : 'Registrar Nuevo Alojamiento Turístico'}
          </h2>
          <p className="text-xs text-[var(--color-sand-500)] mt-1">
            {mode === 'edit'
              ? 'Actualizá tarifas, fotos y comodidades vigentes para el portal de Capilla del Monte'
              : 'Completá la ficha técnica para dar de alta tu propiedad en el motor de reservas'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button type="button" variant="outline" size="md" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="terracotta"
            size="md"
            isLoading={isLoading}
            className="shadow-xs font-bold flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{mode === 'edit' ? 'Guardar Cambios' : 'Publicar Alojamiento'}</span>
          </Button>
        </div>
      </div>

      {/* Main Sections */}
      <div className="flex flex-col gap-6">
        <GeneralInfoSection
          name={name}
          setName={setName}
          type={type}
          setType={setType}
          description={description}
          setDescription={setDescription}
        />

        <LocationSection
          address={address}
          setAddress={setAddress}
          locality={locality}
          setLocality={setLocality}
          latitude={latitude}
          setLatitude={setLatitude}
          longitude={longitude}
          setLongitude={setLongitude}
        />

        <PricingCapacitySection
          pricePerNight={pricePerNight}
          setPricePerNight={setPricePerNight}
          maxGuests={maxGuests}
          setMaxGuests={setMaxGuests}
          checkIn={checkIn}
          setCheckIn={setCheckIn}
          checkOut={checkOut}
          setCheckOut={setCheckOut}
        />

        <CategorizedAmenitiesSection
          selectedAmenities={selectedAmenities}
          onToggleAmenity={handleToggleAmenity}
        />

        <div className="bg-white border border-[var(--color-sand-200)] rounded-2xl p-5 sm:p-6 shadow-xs">
          <ImageGalleryUploader images={images} onChange={setImages} />
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="p-4 sm:p-5 bg-white border border-[var(--color-sand-200)] rounded-2xl flex items-center justify-between shadow-sm sticky bottom-4 z-20">
        <span className="text-xs text-[var(--color-sand-500)] font-medium">
          Asegurate de que los precios y fotos reflejen fielmente las instalaciones actuales.
        </span>

        <div className="flex items-center gap-2.5">
          <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={isLoading}>
            Descartar
          </Button>
          <Button
            type="submit"
            variant="terracotta"
            size="md"
            isLoading={isLoading}
            className="shadow-xs font-bold"
          >
            {mode === 'edit' ? 'Guardar Modificaciones' : 'Confirmar y Publicar'}
          </Button>
        </div>
      </div>
    </form>
  );
};
