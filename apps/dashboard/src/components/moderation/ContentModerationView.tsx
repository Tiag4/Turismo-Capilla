import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { usePhotoModeration } from '../../hooks/usePhotoModeration.ts';
import { ModerationCard } from './ModerationCard.tsx';
import { ObservationModal } from './ObservationModal.tsx';
import type { ModerationItem, ModerationStatus } from '../../types/moderation.types.ts';

export const ContentModerationView: React.FC = () => {
  const {
    items,
    isLoading,
    filter,
    setFilter,
    approvePhoto,
    requestChanges,
  } = usePhotoModeration();

  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenObservation = (item: ModerationItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleSubmitObservation = async (id: string, notes: string) => {
    setIsSubmitting(true);
    try {
      await requestChanges(id, notes);
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs: { id: ModerationStatus | 'ALL'; label: string }[] = [
    { id: 'PENDING', label: 'Pendientes de Revisión' },
    { id: 'APPROVED', label: 'Aprobadas' },
    { id: 'REJECTED', label: 'Observadas' },
    { id: 'ALL', label: 'Todas las Fotos' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[var(--color-sand-900)] font-['Outfit']">
          Supervisión y Moderación de Contenidos
        </h2>
        <p className="text-xs text-[var(--color-sand-400)] font-medium">
          Control de calidad de fotografías y fichas publicadas por cabañeros en el portal oficial
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--color-sand-200)] pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              filter === tab.id
                ? 'bg-[var(--color-emerald-portal-600)] text-white shadow-xs'
                : 'text-[var(--color-sand-800)] hover:bg-[var(--color-sand-100)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of photos */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-[var(--color-sand-400)] bg-white rounded-2xl border border-[var(--color-sand-200)]">
          Cargando catálogo para moderación...
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[var(--color-sand-200)] flex flex-col items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-[var(--color-sand-400)]" />
          <p className="text-sm font-semibold text-[var(--color-sand-900)]">
            No hay elementos bajo este estado de moderación.
          </p>
          <span className="text-xs text-[var(--color-sand-400)]">
            Todas las fotografías del segmento han sido procesadas por el equipo de turismo.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ModerationCard
              key={item.id}
              item={item}
              onApprove={approvePhoto}
              onRequestObservation={handleOpenObservation}
            />
          ))}
        </div>
      )}

      {/* Observation Modal */}
      <ObservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
        onSubmit={handleSubmitObservation}
        isLoading={isSubmitting}
      />
    </div>
  );
};
