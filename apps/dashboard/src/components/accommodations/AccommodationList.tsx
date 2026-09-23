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

type FilterStatus = 'ALL' | 'ACTIVE' | 'IN_REVIEW';

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
  const [filter, setFilter] = useState<FilterStatus>('ALL');

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

  const filteredAccommodations = useMemo(() => {
    if (filter === 'ACTIVE') {
      return enrichedAccommodations.filter((acc) => acc.isActive);
    }
    if (filter === 'IN_REVIEW') {
      return enrichedAccommodations.filter((acc) => acc.complianceStatus === 'IN_REVIEW');
    }
    return enrichedAccommodations;
  }, [enrichedAccommodations, filter]);

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

  const activeCount = enrichedAccommodations.filter((a) => a.isActive).length;
  const inReviewCount = enrichedAccommodations.filter((a) => a.complianceStatus === 'IN_REVIEW').length;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[var(--color-sand-200)]">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-black text-[var(--color-sand-900)] font-['Outfit'] tracking-tight">
              {isAdmin ? 'Prestadores y Alojamientos' : 'Mis Cabañas y Hospedajes'}
            </h2>
            <span className="text-xs font-bold text-[var(--color-terracotta-600)] bg-[var(--color-sand-100)] border border-[var(--color-sand-200)] px-2.5 py-0.5 rounded-full">
              {enrichedAccommodations.length} {enrichedAccommodations.length === 1 ? 'unidad' : 'unidades'}
            </span>
          </div>
          <p className="text-xs text-[var(--color-sand-500)] font-medium mt-1">
            {isAdmin
              ? 'Padrón de prestadores y fiscalización de habilitaciones técnicas municipales'
              : 'Administrá tus alojamientos turísticos, fotos y tarifas vigentes por noche'}
          </p>
        </div>

        <Button
          variant={isAdmin ? 'emerald' : 'terracotta'}
          onClick={handleOpenCreate}
          size="md"
          className="shadow-xs font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdmin ? 'Registrar Prestador' : 'Nuevo Alojamiento'}</span>
        </Button>
      </div>

      {/* Filter Chips Bar */}
      {enrichedAccommodations.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'ALL'
                ? 'bg-[var(--color-sand-900)] text-white shadow-xs'
                : 'bg-white text-[var(--color-sand-600)] hover:bg-[var(--color-sand-100)] border border-[var(--color-sand-200)]'
            }`}
          >
            Todos ({enrichedAccommodations.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('ACTIVE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'ACTIVE'
                ? 'bg-[#005530] text-white shadow-xs'
                : 'bg-white text-[var(--color-sand-600)] hover:bg-[var(--color-sand-100)] border border-[var(--color-sand-200)]'
            }`}
          >
            Activos ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('IN_REVIEW')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'IN_REVIEW'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-[var(--color-sand-600)] hover:bg-[var(--color-sand-100)] border border-[var(--color-sand-200)]'
            }`}
          >
            En Revisión ({inReviewCount})
          </button>
        </div>
      )}

      {/* Accommodations Grid */}
      {isLoading ? (
        <div className="p-16 text-center text-xs text-[var(--color-sand-400)] bg-white rounded-2xl border border-[var(--color-sand-200)] flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--color-terracotta-500)] border-t-transparent animate-spin" />
          <span className="font-semibold">Cargando establecimientos...</span>
        </div>
      ) : filteredAccommodations.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-[var(--color-sand-200)] flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-sand-100)] flex items-center justify-center text-[var(--color-sand-400)]">
            <Home className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-[var(--color-sand-900)] font-['Outfit']">
            {filter === 'ALL'
              ? 'Aún no hay alojamientos registrados'
              : 'No se encontraron alojamientos para este filtro'}
          </p>
          <p className="text-xs text-[var(--color-sand-500)] max-w-sm">
            {filter === 'ALL'
              ? 'Registrá tu primera cabaña u hospedaje para comenzar a recibir solicitudes de reserva directas.'
              : 'Probá seleccionando otro filtro o creá un nuevo alojamiento.'}
          </p>
          {filter === 'ALL' && (
            <Button variant="terracotta" size="sm" onClick={handleOpenCreate} className="mt-2 font-bold">
              Crear el primer alojamiento
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAccommodations.map((acc) => (
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

      {/* Modals */}
      <AccommodationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        accommodation={editingAccommodation}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />

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
