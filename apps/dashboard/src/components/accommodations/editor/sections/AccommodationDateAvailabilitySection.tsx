import React, { useState, useEffect, useCallback } from 'react';
import { CalendarRange, Lock, Unlock, CalendarCheck, Plus } from 'lucide-react';
import { Input } from '../../../ui/Input.tsx';
import { CustomSelect } from '../../../ui/CustomSelect.tsx';
import { Button } from '../../../ui/Button.tsx';
import { ConfirmDialog } from '../../../ui/ConfirmDialog.tsx';
import { useHostBookings } from '../../../../hooks/useHostBookings.ts';
import { useToast } from '../../../../context/ToastContext.tsx';
import { dateBlocksService } from '../../../../services/date-blocks.service.ts';
import type { DateBlock, DateBlockReason } from '../../../../types/date-block.types.ts';
import { DATE_BLOCK_REASON_LABELS } from '../../../../types/date-block.types.ts';
import type { InventoryMode, RoomTypeConfig } from '../../../../types/accommodation.types.ts';

export interface AccommodationDateAvailabilitySectionProps {
  accommodationId: string;
  accommodationName: string;
  inventoryMode?: InventoryMode;
  roomTypes?: RoomTypeConfig[];
}

const REASON_OPTIONS = Object.entries(DATE_BLOCK_REASON_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export const AccommodationDateAvailabilitySection: React.FC<AccommodationDateAvailabilitySectionProps> = ({
  accommodationId,
  accommodationName,
  inventoryMode,
  roomTypes,
}) => {
  const { bookings, isLoading: isLoadingBookings } = useHostBookings();
  const { showSuccess, showError } = useToast();

  const isMultiRoom = inventoryMode === 'MULTI_ROOM' && Boolean(roomTypes && roomTypes.length > 0);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string>('');
  const [unitsBlocked, setUnitsBlocked] = useState<number>(1);

  const [dateBlocks, setDateBlocks] = useState<DateBlock[]>([]);
  const [isLoadingBlocks, setIsLoadingBlocks] = useState(false);

  // New block form state
  const [startDate, setStartDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().substring(0, 10);
  });
  const [reason, setReason] = useState<DateBlockReason>('MAINTENANCE');
  const [notes, setNotes] = useState('');
  const [isCreatingBlock, setIsCreatingBlock] = useState(false);
  const [showBlockForm, setShowBlockForm] = useState(false);

  // Deletion confirm dialog
  const [targetBlockToDelete, setTargetBlockToDelete] = useState<DateBlock | null>(null);
  const [isDeletingBlock, setIsDeletingBlock] = useState(false);

  // Fetch blocks for this accommodation
  const fetchBlocks = useCallback(async () => {
    if (!accommodationId) return;
    setIsLoadingBlocks(true);
    try {
      const allBlocks = await dateBlocksService.getAll([accommodationId]);
      setDateBlocks(allBlocks.filter((b) => b.accommodationId === accommodationId));
    } catch {
      // Fallback handled in service
    } finally {
      setIsLoadingBlocks(false);
    }
  }, [accommodationId]);

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  // Filter bookings for this accommodation
  const cabinBookings = bookings.filter((b) => {
    if (b.status === 'CANCELLED') return false;
    const matchesId = b.accommodationId === accommodationId || b.accommodation?.id === accommodationId;
    const matchesName = b.accommodationName === accommodationName || b.accommodation?.name === accommodationName;
    return matchesId || matchesName;
  });

  const handleCreateBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      showError('Completá las fechas de inicio y fin.');
      return;
    }
    if (endDate <= startDate) {
      showError('La fecha de fin debe ser posterior a la fecha de inicio.');
      return;
    }

    setIsCreatingBlock(true);
    try {
      await dateBlocksService.create({
        accommodationId,
        accommodationName,
        roomTypeId: selectedRoomTypeId || undefined,
        unitsBlocked: selectedRoomTypeId ? unitsBlocked : undefined,
        startDate,
        endDate,
        reason,
        notes: notes.trim() || undefined,
      });
      showSuccess(`Fechas bloqueadas con éxito del ${startDate} al ${endDate}.`);
      setNotes('');
      setSelectedRoomTypeId('');
      setUnitsBlocked(1);
      setShowBlockForm(false);
      await fetchBlocks();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al bloquear fechas.';
      showError(msg);
    } finally {
      setIsCreatingBlock(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!targetBlockToDelete) return;
    setIsDeletingBlock(true);
    try {
      await dateBlocksService.delete(targetBlockToDelete.id);
      showSuccess('Fechas desbloqueadas correctamente. Vuelven a estar disponibles para reservas.');
      setTargetBlockToDelete(null);
      await fetchBlocks();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al desbloquear las fechas.';
      showError(msg);
    } finally {
      setIsDeletingBlock(false);
    }
  };

  return (
    <div className="bg-white border border-[var(--color-sand-200)] rounded-2xl p-5 sm:p-6 flex flex-col gap-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-sand-200)]">
        <div className="flex items-center gap-2.5">
          <CalendarRange className="w-5 h-5 text-[var(--color-terracotta-500)] shrink-0" />
          <div>
            <h3 className="text-base font-bold text-[var(--color-sand-900)] font-['Outfit']">
              Disponibilidad de Fechas, Ocupación y Bloqueos
            </h3>
            <p className="text-xs text-[var(--color-sand-500)]">
              Consultá las fechas con reservas vigentes y administrá bloqueos manuales para este alojamiento
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowBlockForm(!showBlockForm)}
          className="text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          {showBlockForm ? (
            <span>Ocultar formulario</span>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5 text-[var(--color-terracotta-600)]" />
              <span>Bloquear nuevas fechas</span>
            </>
          )}
        </Button>
      </div>

      {/* Formulario rápido para Bloquear Rango de Fechas */}
      {showBlockForm && (
        <form
          onSubmit={handleCreateBlock}
          className="p-4 sm:p-5 rounded-xl border border-[var(--color-sand-300)] bg-[var(--color-sand-50)] flex flex-col gap-4 animate-in fade-in duration-150"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-sand-700)] block">
              Bloquear Rango de Fechas (Mantenimiento / Uso Propio)
            </span>
            <span className="text-[11px] text-[var(--color-sand-500)] block mt-0.5">
              Las fechas seleccionadas quedarán deshabilitadas en el motor de reservas y los turistas no podrán solicitarlas.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              type="date"
              label="Fecha de inicio"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <Input
              type="date"
              label="Fecha de fin"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
            <div>
              <label className="text-xs font-semibold text-[var(--color-sand-800)] block mb-1.5">
                Motivo del bloqueo
              </label>
              <CustomSelect
                value={reason}
                onChange={(val) => setReason(val as DateBlockReason)}
                options={REASON_OPTIONS}
              />
            </div>
          </div>

          {isMultiRoom && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-white border border-[var(--color-sand-200)]">
              <div>
                <label className="text-xs font-semibold text-[var(--color-sand-800)] block mb-1.5">
                  Ámbito del bloqueo
                </label>
                <CustomSelect
                  value={selectedRoomTypeId}
                  onChange={(val) => {
                    setSelectedRoomTypeId(val);
                    setUnitsBlocked(1);
                  }}
                  options={[
                    { value: '', label: 'Toda la propiedad (Cierre general / Fuera de temporada)' },
                    ...(roomTypes || []).map((rt) => ({
                      value: rt.id,
                      label: `${rt.name} (Cupo total: ${rt.totalStock || 1})`,
                    })),
                  ]}
                  helperText="Elegí si cerrás todo el complejo o solo una tipología."
                />
              </div>

              {selectedRoomTypeId ? (
                <div>
                  <Input
                    type="number"
                    min="1"
                    max={String(roomTypes?.find((r) => r.id === selectedRoomTypeId)?.totalStock || 1)}
                    label="Unidades / Habitaciones a bloquear"
                    value={String(unitsBlocked)}
                    onChange={(e) => setUnitsBlocked(Math.max(1, Number(e.target.value) || 1))}
                    required
                    helperText={`Cupo total de esta habitación: ${roomTypes?.find((r) => r.id === selectedRoomTypeId)?.totalStock || 1} unidades.`}
                  />
                </div>
              ) : (
                <div className="text-xs text-[var(--color-sand-600)] p-3 rounded-lg bg-[var(--color-sand-50)] border border-[var(--color-sand-200)] flex items-center self-end mb-1">
                  <span>Bloqueará todo el complejo e impedirá reservas en cualquier categoría.</span>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-3">
            <div className="flex-1">
              <Input
                label="Notas internas (opcional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="ej. Pintura general y recambio de colchones"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setShowBlockForm(false)}
                disabled={isCreatingBlock}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="terracotta"
                size="md"
                isLoading={isCreatingBlock}
                className="font-bold shadow-xs"
              >
                Confirmar bloqueo
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Grid de 2 columnas: 1) Reservas Solicitadas / Ocupadas | 2) Bloqueos Manuales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Columna A: Reservas Activas y Solicitadas */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <CalendarCheck className="w-4 h-4 text-[var(--color-emerald-portal-600)]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-sand-800)]">
                Fechas Solicitadas por Huéspedes ({cabinBookings.length})
              </span>
            </div>
          </div>

          <div className="divide-y divide-[var(--color-sand-200)] border border-[var(--color-sand-200)] rounded-xl overflow-hidden bg-white">
            {isLoadingBookings ? (
              <div className="p-4 text-center text-xs text-[var(--color-sand-400)]">
                Consultando reservas...
              </div>
            ) : cabinBookings.length === 0 ? (
              <div className="p-4 text-center text-xs text-[var(--color-sand-500)]">
                No hay solicitudes de reserva activas para esta cabaña.
              </div>
            ) : (
              cabinBookings.map((b) => (
                <div key={b.id} className="p-3 sm:p-3.5 flex flex-col gap-1.5 hover:bg-[var(--color-sand-50)] transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-['Outfit'] font-bold text-xs tabular-nums text-[var(--color-sand-900)]">
                      {b.bookingCode}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase ${
                        b.status === 'CONFIRMED'
                          ? 'bg-[var(--color-emerald-portal-600)] text-white'
                          : 'bg-amber-600 text-white'
                      }`}
                    >
                      {b.status === 'CONFIRMED' ? 'Confirmada' : 'Pendiente'}
                    </span>
                  </div>
                  <div className="text-xs text-[var(--color-sand-800)] font-medium">
                    <span>{b.guestName}</span> · <span className="text-[var(--color-sand-500)]">{b.guestPhone || b.guestEmail}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[var(--color-sand-600)] pt-1 border-t border-[var(--color-sand-100)]">
                    <span className="font-semibold text-[var(--color-sand-900)]">
                      {b.checkIn} al {b.checkOut}
                    </span>
                    <span className="tabular-nums font-bold text-[var(--color-sand-900)]">
                      {b.totalNights} {b.totalNights === 1 ? 'noche' : 'noches'} · ${(b.totalAmount ?? 0).toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Columna B: Fechas Bloqueadas Manualmente */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-sand-800)]">
                Fechas Bloqueadas Manualmente ({dateBlocks.length})
              </span>
            </div>
          </div>

          <div className="divide-y divide-[var(--color-sand-200)] border border-[var(--color-sand-200)] rounded-xl overflow-hidden bg-white">
            {isLoadingBlocks ? (
              <div className="p-4 text-center text-xs text-[var(--color-sand-400)]">
                Consultando bloqueos...
              </div>
            ) : dateBlocks.length === 0 ? (
              <div className="p-4 text-center text-xs text-[var(--color-sand-500)]">
                No hay bloqueos manuales. Todas las fechas libres admiten reservas online.
              </div>
            ) : (
              dateBlocks.map((blk) => (
                <div key={blk.id} className="p-3 sm:p-3.5 flex items-center justify-between gap-3 hover:bg-[var(--color-sand-50)] transition-colors">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-xs text-[var(--color-sand-900)]">
                        {blk.startDate} al {blk.endDate}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[var(--color-sand-800)] text-white uppercase">
                        {DATE_BLOCK_REASON_LABELS[blk.reason || 'MAINTENANCE']}
                      </span>
                      {blk.roomTypeName ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[var(--color-terracotta-500)] text-white">
                          Habitación: {blk.roomTypeName} ({blk.unitsBlocked ?? 1} {blk.unitsBlocked === 1 ? 'unidad' : 'unidades'})
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[var(--color-sand-200)] text-[var(--color-sand-800)]">
                          Toda la propiedad
                        </span>
                      )}
                    </div>
                    {blk.notes && (
                      <span className="text-[11px] text-[var(--color-sand-600)] block mt-0.5 italic">
                        {blk.notes}
                      </span>
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setTargetBlockToDelete(blk)}
                    title="Desbloquear estas fechas"
                    className="text-xs text-rose-700 hover:text-rose-900 shrink-0 cursor-pointer flex items-center gap-1"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Liberar</span>
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Confirm Dialog to Delete/Unlock Dates */}
      <ConfirmDialog
        isOpen={Boolean(targetBlockToDelete)}
        onClose={() => setTargetBlockToDelete(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeletingBlock}
        variant="warning"
        title="¿Liberar y desbloquear fechas?"
        description={
          targetBlockToDelete
            ? `Las fechas del ${targetBlockToDelete.startDate} al ${targetBlockToDelete.endDate} volverán a estar habilitadas en el portal para que los turistas puedan enviar solicitudes de reserva.`
            : ''
        }
        confirmLabel="Sí, desbloquear fechas"
        cancelLabel="Conservar bloqueo"
      />
    </div>
  );
};
