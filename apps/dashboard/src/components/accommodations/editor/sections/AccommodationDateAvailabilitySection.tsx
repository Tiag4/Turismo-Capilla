import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  CalendarRange,
  Lock,
  Unlock,
  CalendarCheck,
  Plus,
  Building2,
  Bed,
  Filter,
  X,
  Layers,
} from 'lucide-react';
import { Input } from '../../../ui/Input.tsx';
import { CustomSelect } from '../../../ui/CustomSelect.tsx';
import { CustomDatePicker } from '../../../ui/CustomDatePicker.tsx';
import { Button } from '../../../ui/Button.tsx';
import { ConfirmDialog } from '../../../ui/ConfirmDialog.tsx';
import { Tooltip, InfoTooltip } from '../../../ui/Tooltip.tsx';
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

  // Selected room filter: '' means "Todo el complejo", string is roomTypeId
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string>('');
  const [unitsBlocked, setUnitsBlocked] = useState<number>(1);

  const selectedRoom = useMemo(
    () => roomTypes?.find((r) => r.id === selectedRoomTypeId),
    [roomTypes, selectedRoomTypeId],
  );

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

  // Date filters for bookings list
  const [dateFilterPreset, setDateFilterPreset] = useState<'ALL' | 'UPCOMING' | 'THIS_MONTH' | 'PAST' | 'CUSTOM'>('ALL');
  const [dateFilterFrom, setDateFilterFrom] = useState<string>('');
  const [dateFilterTo, setDateFilterTo] = useState<string>('');

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
  const cabinBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (b.status === 'CANCELLED') return false;
      const matchesId = b.accommodationId === accommodationId || b.accommodation?.id === accommodationId;
      const matchesName = b.accommodationName === accommodationName || b.accommodation?.name === accommodationName;
      return matchesId || matchesName;
    });
  }, [bookings, accommodationId, accommodationName]);

  // Date filter presets handler
  const handlePresetClick = (preset: 'ALL' | 'UPCOMING' | 'THIS_MONTH' | 'PAST') => {
    setDateFilterPreset(preset);
    const today = new Date().toISOString().substring(0, 10);

    if (preset === 'ALL') {
      setDateFilterFrom('');
      setDateFilterTo('');
    } else if (preset === 'UPCOMING') {
      setDateFilterFrom(today);
      setDateFilterTo('');
    } else if (preset === 'THIS_MONTH') {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().substring(0, 10);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().substring(0, 10);
      setDateFilterFrom(firstDay);
      setDateFilterTo(lastDay);
    } else if (preset === 'PAST') {
      setDateFilterFrom('');
      setDateFilterTo(today);
    }
  };

  const handleClearDateFilter = () => {
    setDateFilterPreset('ALL');
    setDateFilterFrom('');
    setDateFilterTo('');
  };

  // Filtered bookings applying room card filter and date range filter
  const filteredCabinBookings = useMemo(() => {
    return cabinBookings.filter((b) => {
      // 1. Room type filter
      if (selectedRoomTypeId) {
        const hasRoom = Boolean(
          b.items &&
          b.items.length > 0 &&
          b.items.some(
            (i) =>
              i.roomTypeId === selectedRoomTypeId ||
              (selectedRoom && i.roomTypeName && i.roomTypeName.toLowerCase().trim() === selectedRoom.name.toLowerCase().trim())
          )
        );
        if (!hasRoom) return false;
      }

      // 2. Date filters
      if (dateFilterFrom && b.checkOut < dateFilterFrom) return false;
      if (dateFilterTo && b.checkIn > dateFilterTo) return false;

      return true;
    });
  }, [cabinBookings, selectedRoomTypeId, selectedRoom, dateFilterFrom, dateFilterTo]);

  // Filtered date blocks based on room selection
  const filteredBlocks = useMemo(() => {
    return dateBlocks.filter((blk) => {
      if (!selectedRoomTypeId) return true;
      // Show blocks that target this room or general blocks that close the property
      return blk.roomTypeId === selectedRoomTypeId || !blk.roomTypeId;
    });
  }, [dateBlocks, selectedRoomTypeId]);

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

      const scopeName = selectedRoom ? selectedRoom.name : 'toda la propiedad';
      showSuccess(`Fechas bloqueadas con éxito para ${scopeName} (${startDate} al ${endDate}).`);
      setNotes('');
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
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-bold text-[var(--color-sand-900)] font-['Outfit']">
                Disponibilidad de Fechas, Ocupación y Bloqueos
              </h3>
              <InfoTooltip content="Consultá las fechas con reservas vigentes y administrá bloqueos manuales por mantenimiento, remodelación o uso propio." />
            </div>
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

      {/* Selector Visual de Habitaciones (Carrusel / Cards Row para Multi-Habitación) */}
      {isMultiRoom && (
        <div className="flex flex-col gap-2.5 p-3.5 sm:p-4 rounded-xl bg-[var(--color-sand-50)] border border-[var(--color-sand-200)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[var(--color-terracotta-500)]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-sand-900)]">
                Filtrar por Habitación e Inventario
              </span>
              <InfoTooltip content="Hacé clic en una habitación para ver sus reservas específicas o registrar un bloqueo que afecte únicamente a sus unidades disponibles." />
            </div>
            <span className="text-[11px] text-[var(--color-sand-500)]">
              Hacé clic en una habitación para ver sus reservas específicas o bloquear sus unidades
            </span>
          </div>

          <div role="tablist" aria-label="Filtrar reservas y bloqueos por habitación" className="flex items-stretch gap-2.5 overflow-x-auto pb-1.5 pt-1">
            {/* Card "Todo el Complejo" */}
            <Tooltip content="Ver todas las reservas y bloqueos de todo el establecimiento" position="top">
              <button
                type="button"
                role="tab"
                aria-selected={selectedRoomTypeId === ''}
                onClick={() => {
                  setSelectedRoomTypeId('');
                  setUnitsBlocked(1);
                }}
                className={`shrink-0 w-52 sm:w-60 p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                  selectedRoomTypeId === ''
                    ? 'bg-white border-[var(--color-terracotta-500)] shadow-xs ring-2 ring-[var(--color-terracotta-500)]/15'
                    : 'bg-white/80 border-[var(--color-sand-200)] hover:border-[var(--color-sand-400)] hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        selectedRoomTypeId === ''
                          ? 'bg-[var(--color-terracotta-500)] text-white'
                          : 'bg-[var(--color-sand-100)] text-[var(--color-sand-700)]'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-[var(--color-sand-900)] block font-['Outfit']">
                        Todo el Complejo
                      </span>
                      <span className="text-[10px] text-[var(--color-sand-500)]">
                        Todas las habitaciones
                      </span>
                    </div>
                  </div>
                  {selectedRoomTypeId === '' && (
                    <span className="w-2 h-2 rounded-full bg-[var(--color-terracotta-500)] shrink-0 mt-1" />
                  )}
                </div>

                <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--color-sand-600)] pt-2 border-t border-[var(--color-sand-100)]">
                  <span>{cabinBookings.length} {cabinBookings.length === 1 ? 'reserva' : 'reservas'}</span>
                  <span>·</span>
                  <span>{dateBlocks.length} {dateBlocks.length === 1 ? 'bloqueo' : 'bloqueos'}</span>
                </div>
              </button>
            </Tooltip>

            {/* Cards por RoomType */}
            {roomTypes?.map((rt) => {
              const roomBookings = cabinBookings.filter(
                (b) =>
                  b.items &&
                  b.items.some(
                    (i) =>
                      i.roomTypeId === rt.id ||
                      (i.roomTypeName && i.roomTypeName.toLowerCase().trim() === rt.name.toLowerCase().trim()),
                  ),
              );
              const roomBlocks = dateBlocks.filter((blk) => blk.roomTypeId === rt.id);
              const isSelected = selectedRoomTypeId === rt.id;

              return (
                <Tooltip
                  key={rt.id}
                  content={`Ver reservas y bloqueos para ${rt.name} (${rt.totalStock || 1} ${rt.totalStock === 1 ? 'unidad' : 'unidades'})`}
                  position="top"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => {
                      setSelectedRoomTypeId(rt.id);
                      setUnitsBlocked(1);
                    }}
                    className={`shrink-0 w-56 sm:w-64 p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                      isSelected
                        ? 'bg-white border-[var(--color-terracotta-500)] shadow-xs ring-2 ring-[var(--color-terracotta-500)]/15'
                        : 'bg-white/80 border-[var(--color-sand-200)] hover:border-[var(--color-sand-400)] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-[var(--color-terracotta-500)] text-white'
                              : 'bg-[var(--color-sand-100)] text-[var(--color-sand-700)]'
                          }`}
                        >
                          <Bed className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <span className="font-bold text-xs text-[var(--color-sand-900)] block truncate font-['Outfit']">
                            {rt.name}
                          </span>
                          <span className="text-[10px] text-[var(--color-sand-500)] block">
                            {rt.totalStock || 1} {rt.totalStock === 1 ? 'unidad disponible' : 'unidades disponibles'}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-[var(--color-terracotta-500)] shrink-0 mt-1" />
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--color-sand-600)] pt-2 border-t border-[var(--color-sand-100)]">
                      <span>{roomBookings.length} {roomBookings.length === 1 ? 'reserva' : 'reservas'}</span>
                      <span>·</span>
                      <span>{roomBlocks.length} {roomBlocks.length === 1 ? 'bloqueo' : 'bloqueos'}</span>
                    </div>
                  </button>
                </Tooltip>
              );
            })}
          </div>
        </div>
      )}

      {/* Formulario para Bloquear Rango de Fechas */}
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

          {/* Contexto de la habitación que se va a bloquear */}
          {isMultiRoom && (
            <div className="p-3 rounded-xl bg-white border border-[var(--color-sand-200)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {selectedRoom ? (
                  <>
                    <div className="w-8 h-8 rounded-lg bg-[var(--color-terracotta-500)] text-white flex items-center justify-center shrink-0">
                      <Bed className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[var(--color-sand-900)] block">
                        Bloqueando habitación: {selectedRoom.name}
                      </span>
                      <span className="text-[11px] text-[var(--color-sand-500)]">
                        Unidades totales: {selectedRoom.totalStock || 1} {selectedRoom.totalStock === 1 ? 'habitación' : 'habitaciones'}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-lg bg-[var(--color-sand-800)] text-white flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[var(--color-sand-900)] block">
                        Bloqueando: Todo el Complejo (Cierre General)
                      </span>
                      <span className="text-[11px] text-[var(--color-sand-500)]">
                        Inhabilitará reservas en todas las habitaciones en ese período
                      </span>
                    </div>
                  </>
                )}
              </div>

              {selectedRoom && (
                <div className="w-full sm:w-48 shrink-0">
                  <Input
                    type="number"
                    min="1"
                    max={String(selectedRoom.totalStock || 1)}
                    label="Unidades a bloquear"
                    tooltip="Cantidad de habitaciones de esta categoría que no podrán ser reservadas durante este rango."
                    value={String(unitsBlocked)}
                    onChange={(e) => setUnitsBlocked(Math.max(1, Number(e.target.value) || 1))}
                    required
                    helperText={`Máximo: ${selectedRoom.totalStock || 1}`}
                  />
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <CustomDatePicker
              label="Fecha de inicio"
              tooltip="Primer día en que el alojamiento o habitación queda bloqueado."
              value={startDate}
              onChange={(val) => {
                setStartDate(val);
                if (endDate && val && endDate < val) {
                  setEndDate('');
                }
              }}
              minDate={new Date().toISOString().substring(0, 10)}
            />
            <CustomDatePicker
              label="Fecha de fin"
              tooltip="Último día del bloqueo. La disponibilidad se restablece al día siguiente."
              value={endDate}
              onChange={(val) => setEndDate(val)}
              minDate={startDate || new Date().toISOString().substring(0, 10)}
            />
            <div>
              <CustomSelect
                label="Motivo del bloqueo"
                tooltip="Razón por la cual se bloquea el calendario (mantenimiento, uso propio, etc.)."
                value={reason}
                onChange={(val) => setReason(val as DateBlockReason)}
                options={REASON_OPTIONS}
              />
            </div>
          </div>

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
                className="font-bold shadow-xs cursor-pointer"
              >
                Confirmar bloqueo
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Grid de 2 columnas: 1) Reservas Solicitadas / Ocupadas | 2) Bloqueos Manuales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* Columna A: Reservas Activas y Solicitadas */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <CalendarCheck className="w-4 h-4 text-[var(--color-emerald-portal-600)]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-sand-800)]">
                Fechas Solicitadas por Huéspedes ({filteredCabinBookings.length})
              </span>
              <InfoTooltip content="Reservas efectuadas por turistas en el portal que ocupan fechas en este establecimiento." />
            </div>

            {(dateFilterFrom || dateFilterTo || dateFilterPreset !== 'ALL') && (
              <button
                type="button"
                onClick={handleClearDateFilter}
                className="text-[11px] text-[var(--color-terracotta-600)] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Limpiar filtro</span>
              </button>
            )}
          </div>

          {/* Barra de Filtro de Fechas */}
          <div className="p-3 rounded-xl bg-[var(--color-sand-50)] border border-[var(--color-sand-200)] flex flex-col gap-2.5">
            <div role="group" aria-label="Filtro rápido de fechas" className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-sand-500)] mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" />
                <span>Rango:</span>
              </span>
              {[
                { id: 'ALL', label: 'Todas' },
                { id: 'UPCOMING', label: 'Próximas' },
                { id: 'THIS_MONTH', label: 'Este mes' },
                { id: 'PAST', label: 'Históricas' },
              ].map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePresetClick(preset.id as any)}
                  aria-pressed={dateFilterPreset === preset.id}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                    dateFilterPreset === preset.id
                      ? 'bg-[var(--color-sand-900)] text-white shadow-xs'
                      : 'bg-white border border-[var(--color-sand-200)] text-[var(--color-sand-700)] hover:border-[var(--color-sand-400)]'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[var(--color-sand-200)]/60">
              <CustomDatePicker
                label="Desde fecha"
                value={dateFilterFrom}
                onChange={(val) => {
                  setDateFilterFrom(val);
                  setDateFilterPreset('CUSTOM');
                }}
                clearable
                placeholder="dd/mm/aaaa"
              />
              <CustomDatePicker
                label="Hasta fecha"
                value={dateFilterTo}
                onChange={(val) => {
                  setDateFilterTo(val);
                  setDateFilterPreset('CUSTOM');
                }}
                minDate={dateFilterFrom}
                clearable
                placeholder="dd/mm/aaaa"
              />
            </div>
          </div>

          <div className="divide-y divide-[var(--color-sand-200)] border border-[var(--color-sand-200)] rounded-xl overflow-hidden bg-white">
            {isLoadingBookings ? (
              <div className="p-4 text-center text-xs text-[var(--color-sand-400)]">
                Consultando reservas...
              </div>
            ) : filteredCabinBookings.length === 0 ? (
              <div className="p-4 text-center text-xs text-[var(--color-sand-500)]">
                {selectedRoom
                  ? `No hay reservas registradas para la habitación "${selectedRoom.name}" con los filtros actuales.`
                  : 'No hay solicitudes de reserva activas para este alojamiento con los filtros actuales.'}
              </div>
            ) : (
              filteredCabinBookings.map((b) => (
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

                  {/* Detalle de unidades reservadas en multi-habitación */}
                  {b.items && b.items.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      {b.items.map((it) => (
                        <span
                          key={it.id || it.roomTypeId}
                          className="px-2 py-0.5 rounded-md bg-[var(--color-sand-100)] text-[var(--color-sand-800)] text-[10px] font-bold"
                        >
                          {it.quantity}x {it.roomTypeName || 'Habitación'}
                        </span>
                      ))}
                    </div>
                  )}

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
                Fechas Bloqueadas Manualmente ({filteredBlocks.length})
              </span>
              <InfoTooltip content="Períodos donde inhabilitaste manualmente la recepción de reservas para este alojamiento o habitación." />
            </div>
            {selectedRoom && (
              <span className="text-[10px] font-semibold text-[var(--color-terracotta-600)]">
                Mostrando: {selectedRoom.name}
              </span>
            )}
          </div>

          <div className="divide-y divide-[var(--color-sand-200)] border border-[var(--color-sand-200)] rounded-xl overflow-hidden bg-white">
            {isLoadingBlocks ? (
              <div className="p-4 text-center text-xs text-[var(--color-sand-400)]">
                Consultando bloqueos...
              </div>
            ) : filteredBlocks.length === 0 ? (
              <div className="p-4 text-center text-xs text-[var(--color-sand-500)]">
                {selectedRoom
                  ? `No hay bloqueos manuales activos para la habitación "${selectedRoom.name}".`
                  : 'No hay bloqueos manuales. Todas las fechas libres admiten reservas online.'}
              </div>
            ) : (
              filteredBlocks.map((blk) => (
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
                          Todo el complejo
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
