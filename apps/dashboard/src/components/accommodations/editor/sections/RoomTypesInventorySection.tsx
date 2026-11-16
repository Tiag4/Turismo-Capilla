import React from 'react';
import { Building2, Home, Plus, Trash2, BedDouble, Users, DollarSign, Layers } from 'lucide-react';
import type { InventoryMode, RoomTypeConfig } from '../../../../types/accommodation.types.ts';

interface RoomTypesInventorySectionProps {
  inventoryMode: InventoryMode;
  setInventoryMode: (mode: InventoryMode) => void;
  roomTypes: RoomTypeConfig[];
  onChangeRoomTypes: (rooms: RoomTypeConfig[]) => void;
}

export const RoomTypesInventorySection: React.FC<RoomTypesInventorySectionProps> = ({
  inventoryMode,
  setInventoryMode,
  roomTypes,
  onChangeRoomTypes,
}) => {
  const handleAddRoomType = () => {
    const newRoom: RoomTypeConfig = {
      id: `rt-${Date.now()}`,
      name: `Categoría ${roomTypes.length + 1} (Ej. Superior Vista Sierra)`,
      maxGuests: 3,
      bedsSummary: '1 Cama Queen + 1 Individual',
      pricePerNight: 95000,
      totalStock: 3,
      breakfastIncluded: true,
    };
    onChangeRoomTypes([...roomTypes, newRoom]);
  };

  const handleRemoveRoomType = (id: string) => {
    onChangeRoomTypes(roomTypes.filter((r) => r.id !== id));
  };

  const handleUpdateRoom = <K extends keyof RoomTypeConfig>(
    id: string,
    field: K,
    value: RoomTypeConfig[K]
  ) => {
    onChangeRoomTypes(
      roomTypes.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  return (
    <div className="bg-white border border-[var(--color-sand-200)] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--color-sand-200)]">
        <div>
          <h3 className="text-base font-bold text-[var(--color-sand-900)] font-['Outfit']">
            Modalidad de Inventario y Tipos de Habitación
          </h3>
          <p className="text-xs text-[var(--color-sand-500)] mt-0.5">
            Configurá si alquilás la propiedad como unidad única o como complejo/hotel con múltiples habitaciones y cupos
          </p>
        </div>

        {/* Selector de Modalidad */}
        <div className="flex items-center gap-2 bg-[var(--color-sand-100)] p-1.5 rounded-xl">
          <button
            type="button"
            onClick={() => setInventoryMode('SINGLE_UNIT')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              inventoryMode === 'SINGLE_UNIT'
                ? 'bg-[var(--color-sand-900)] text-white'
                : 'text-[var(--color-sand-700)] hover:text-[var(--color-sand-900)]'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Unidad Única</span>
          </button>

          <button
            type="button"
            onClick={() => setInventoryMode('MULTI_ROOM')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              inventoryMode === 'MULTI_ROOM'
                ? 'bg-[var(--color-terracotta-500)] text-white'
                : 'text-[var(--color-sand-700)] hover:text-[var(--color-sand-900)]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Multi-Habitación / Complejo</span>
          </button>
        </div>
      </div>

      {inventoryMode === 'SINGLE_UNIT' ? (
        <div className="p-4 rounded-xl bg-[var(--color-sand-50)] border border-[var(--color-sand-200)] text-xs text-[var(--color-sand-700)] flex items-center justify-between gap-4">
          <div>
            <span className="font-bold text-[var(--color-sand-900)] block">
              Alquiler de Unidad Completa (SINGLE_UNIT)
            </span>
            <span>
              El turista reserva el establecimiento entero utilizando la tarifa base y capacidad máxima general.
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-[var(--color-sand-900)] text-white text-[10px] font-extrabold uppercase shrink-0">
            Cupo: 1 propiedad
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--color-sand-700)]">
              Categorías de habitación y cupos (Allotment) ({roomTypes.length})
            </span>
            <button
              type="button"
              onClick={handleAddRoomType}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--color-terracotta-500)] hover:bg-[var(--color-terracotta-600)] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar Categoría de Habitación</span>
            </button>
          </div>

          <div className="space-y-3">
            {roomTypes.map((room) => (
              <div
                key={room.id}
                className="p-4 rounded-xl bg-[var(--color-sand-50)] border border-[var(--color-sand-200)] grid grid-cols-1 md:grid-cols-12 gap-3 items-end"
              >
                <div className="md:col-span-4">
                  <label className="block text-[11px] font-bold text-[var(--color-sand-700)] mb-1">
                    Nombre de Categoría / Unidad
                  </label>
                  <div className="relative">
                    <BedDouble className="w-3.5 h-3.5 text-[var(--color-sand-500)] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={room.name}
                      onChange={(e) => handleUpdateRoom(room.id, 'name', e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-[var(--color-sand-300)] text-xs text-[var(--color-sand-900)] font-semibold"
                    />
                  </div>
                </div>

                <div className="md:col-span-3">
                  <label className="block text-[11px] font-bold text-[var(--color-sand-700)] mb-1">
                    Configuración de Camas
                  </label>
                  <input
                    type="text"
                    value={room.bedsSummary}
                    onChange={(e) => handleUpdateRoom(room.id, 'bedsSummary', e.target.value)}
                    placeholder="Ej. 1 King + 1 Single"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[var(--color-sand-300)] text-xs text-[var(--color-sand-900)]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-[var(--color-sand-700)] mb-1">
                    Tarifa / Noche ($)
                  </label>
                  <div className="relative">
                    <DollarSign className="w-3.5 h-3.5 text-[var(--color-sand-500)] absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      min={1000}
                      step={1000}
                      value={room.pricePerNight}
                      onChange={(e) =>
                        handleUpdateRoom(room.id, 'pricePerNight', Math.max(0, Number(e.target.value)))
                      }
                      className="w-full pl-7 pr-2.5 py-2 rounded-xl bg-white border border-[var(--color-sand-300)] text-xs font-bold text-[var(--color-sand-900)]"
                    />
                  </div>
                </div>

                <div className="md:col-span-1">
                  <label className="block text-[11px] font-bold text-[var(--color-sand-700)] mb-1">
                    Capacidad
                  </label>
                  <div className="relative">
                    <Users className="w-3 h-3 text-[var(--color-sand-500)] absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={room.maxGuests}
                      onChange={(e) =>
                        handleUpdateRoom(room.id, 'maxGuests', Math.max(1, Number(e.target.value)))
                      }
                      className="w-full pl-7 pr-2 py-2 rounded-xl bg-white border border-[var(--color-sand-300)] text-xs font-bold text-[var(--color-sand-900)]"
                    />
                  </div>
                </div>

                <div className="md:col-span-1">
                  <label className="block text-[11px] font-bold text-[var(--color-sand-700)] mb-1">
                    Cupo (Stock)
                  </label>
                  <div className="relative">
                    <Layers className="w-3 h-3 text-[var(--color-sand-500)] absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={room.totalStock}
                      onChange={(e) =>
                        handleUpdateRoom(room.id, 'totalStock', Math.max(1, Number(e.target.value)))
                      }
                      className="w-full pl-7 pr-2 py-2 rounded-xl bg-white border border-[var(--color-sand-300)] text-xs font-bold text-[var(--color-sand-900)]"
                    />
                  </div>
                </div>

                <div className="md:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveRoomType(room.id)}
                    disabled={roomTypes.length <= 1}
                    aria-label="Eliminar categoría de habitación"
                    className="p-2 rounded-xl text-rose-700 hover:bg-rose-100 disabled:opacity-30 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
