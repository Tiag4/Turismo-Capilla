import React, { useState, useMemo } from 'react';
import { Plus, Home } from 'lucide-react';
import { useHostAccommodations } from '../../hooks/useHostAccommodations.ts';
import { useAdminAudit } from '../../hooks/useAdminAudit.ts';
import { useAuth } from '../../hooks/useAuth.ts';
import { AccommodationCard } from './AccommodationCard.tsx';
import { AccommodationModal } from './AccommodationModal.tsx';
import { AccommodationAuditModal } from './AccommodationAuditModal.tsx';
import { Button } from '../ui/Button.tsx';
import type {
  Accommodation,
  CreateAccommodationDto,
  ComplianceStatus,
  ComplianceChecklist,
} from '../../types/accommodation.types.ts';

export const AccommodationList: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const {
    accommodations,
    isLoading,
    createAccommodation,
    updateAccommodation,
    toggleActive,
  } = useHostAccommodations();

  const { saveAudit, getSavedAudits, isSubmitting: isAuditSubmitting } = useAdminAudit();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccommodation, setEditingAccommodation] = useState<Accommodation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Audit state
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [auditingAccommodation, setAuditingAccommodation] = useState<Accommodation | null>(null);
  const [auditRevision, setAuditRevision] = useState(0);

  const savedAudits = useMemo(() => getSavedAudits(), [getSavedAudits, auditRevision]);

  const enrichedAccommodations = useMemo(() => {
    return accommodations.map((acc) => {
      const record = savedAudits[acc.id];
      if (record) {
        return {
          ...acc,
          complianceStatus: record.status,
          auditRecord: record,
        };
      }
      return acc;
    });
  }, [accommodations, savedAudits]);

  const handleOpenCreate = () => {
    setEditingAccommodation(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (acc: Accommodation) => {
    setEditingAccommodation(acc);
    setIsModalOpen(true);
  };

  const handleOpenAudit = (acc: Accommodation) => {
    setAuditingAccommodation(acc);
    setIsAuditModalOpen(true);
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

  const handleSaveAudit = async (
    accommodationId: string,
    status: ComplianceStatus,
    checklist: ComplianceChecklist,
    notes: string
  ) => {
    await saveAudit(accommodationId, status, checklist, notes);
    setAuditRevision((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-sand-900)] font-['Outfit']">
            {isAdmin ? 'Prestadores y Alojamientos Adheridos' : 'Establecimientos y Cabañas'}
          </h2>
          <p className="text-xs text-[var(--color-sand-400)] font-medium">
            {isAdmin
              ? 'Padrón de prestadores y fiscalización de habilitaciones técnicas municipales'
              : 'Administrá tus hospedajes habilitados y sus tarifas por noche'}
          </p>
        </div>
        <Button variant={isAdmin ? 'emerald' : 'terracotta'} onClick={handleOpenCreate} size="md">
          <Plus className="w-4 h-4" />
          <span>{isAdmin ? 'Registrar Prestador' : 'Nuevo Alojamiento'}</span>
        </Button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-[var(--color-sand-400)] bg-white rounded-2xl border border-[var(--color-sand-200)]">
          Cargando establecimientos...
        </div>
      ) : enrichedAccommodations.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[var(--color-sand-200)] flex flex-col items-center gap-3">
          <Home className="w-8 h-8 text-[var(--color-sand-400)]" />
          <p className="text-sm font-semibold text-[var(--color-sand-900)]">
            Aún no hay alojamientos registrados.
          </p>
          <Button variant="terracotta" size="sm" onClick={handleOpenCreate}>
            Crear el primer alojamiento
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrichedAccommodations.map((acc) => (
            <AccommodationCard
              key={acc.id}
              accommodation={acc}
              onEdit={handleOpenEdit}
              onToggleActive={toggleActive}
              isAdmin={isAdmin}
              onAudit={handleOpenAudit}
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

      {/* Audit Modal for Commission */}
      <AccommodationAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        accommodation={auditingAccommodation}
        onSaveAudit={handleSaveAudit}
        isLoading={isAuditSubmitting}
      />
    </div>
  );
};
