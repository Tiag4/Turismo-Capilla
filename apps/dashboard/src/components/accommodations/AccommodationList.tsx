import React, { useState } from 'react';
import { Plus, Home } from 'lucide-react';
import { useHostAccommodations } from '../../hooks/useHostAccommodations.ts';
import { AccommodationCard } from './AccommodationCard.tsx';
import { AccommodationModal } from './AccommodationModal.tsx';
import { Button } from '../ui/Button.tsx';
import type { Accommodation, CreateAccommodationDto } from '../../types/accommodation.types.ts';

export const AccommodationList: React.FC = () => {
  const {
    accommodations,
    isLoading,
    createAccommodation,
    updateAccommodation,
    toggleActive,
  } = useHostAccommodations();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccommodation, setEditingAccommodation] = useState<Accommodation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenCreate = () => {
    setEditingAccommodation(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (acc: Accommodation) => {
    setEditingAccommodation(acc);
    setIsModalOpen(true);
  };

  const handleSubmit = async (dto: CreateAccommodationDto) => {
    setIsSubmitting(true);
    try {
      if (editingAccommodation) {
        await updateAccommodation(editingAccommodation.id, dto);
      } else {
        await createAccommodation(dto);
      }
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-sand-900)] font-['Outfit']">
            Establecimientos y Cabañas
          </h2>
          <p className="text-xs text-[var(--color-sand-400)] font-medium">
            Administrá tus hospedajes habilitados y sus tarifas por noche
          </p>
        </div>
        <Button variant="terracotta" onClick={handleOpenCreate} size="md">
          <Plus className="w-4 h-4" />
          <span>Nuevo Alojamiento</span>
        </Button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-[var(--color-sand-400)] bg-white rounded-2xl border border-[var(--color-sand-200)]">
          Cargando establecimientos...
        </div>
      ) : accommodations.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[var(--color-sand-200)] flex flex-col items-center gap-3">
          <Home className="w-8 h-8 text-[var(--color-sand-400)]" />
          <p className="text-sm font-semibold text-[var(--color-sand-900)]">
            Aún no tenés alojamientos registrados.
          </p>
          <Button variant="terracotta" size="sm" onClick={handleOpenCreate}>
            Crear tu primer alojamiento
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accommodations.map((acc) => (
            <AccommodationCard
              key={acc.id}
              accommodation={acc}
              onEdit={handleOpenEdit}
              onToggleActive={toggleActive}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <AccommodationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        accommodation={editingAccommodation}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
};
