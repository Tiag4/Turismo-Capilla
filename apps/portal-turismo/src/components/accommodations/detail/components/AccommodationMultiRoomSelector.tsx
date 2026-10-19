import React from 'react';
import {
  Users,
  BedDouble,
  Maximize2,
  Coffee,
  Check,
  Plus,
  Minus,
  AlertTriangle,
  Building2,
  Home,
} from 'lucide-react';
import type { InventoryMode, RoomTypeInventoryItem } from '../types';

interface AccommodationMultiRoomSelectorProps {
  inventoryMode: InventoryMode;
  roomTypes: RoomTypeInventoryItem[];
  roomQuantities: Record<string, number>;
  onChangeQuantity: (roomId: string, quantity: number) => void;
  totalSelectedRooms: number;
  totalSelectedCapacity: number;
  totalRequestedGuests: number;
  isCapacitySufficient: boolean;
}

export const AccommodationMultiRoomSelector: React.FC<AccommodationMultiRoomSelectorProps> = ({
  inventoryMode,
  roomTypes,
  roomQuantities,
  onChangeQuantity,
  totalSelectedRooms,
  totalSelectedCapacity,
  totalRequestedGuests,
  isCapacitySufficient,
}) => {
  if (!roomTypes || roomTypes.length === 0) return null;

  return (
    <section
      id="inventario-habitaciones"
      aria-labelledby="inventory-heading"
      className="space-y-5 pt-6 border-t border-stone-200/80"
    >
      {/* Cabecera de Inventario */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2
              id="inventory-heading"
              className="font-display font-black text-xl sm:text-2xl text-stone-900"
            >
              {inventoryMode === 'MULTI_ROOM'
                ? 'Seleccioná tus Habitaciones y Unidades'
                : 'Modalidad de Alojamiento'}
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-stone-900 text-white text-xs font-extrabold">
              {inventoryMode === 'MULTI_ROOM' ? (
                <>
                  <Building2 className="w-3.5 h-3.5 text-terracotta-400" />
                  <span>Inventario Multi-Habitación</span>
                </>
              ) : (
                <>
                  <Home className="w-3.5 h-3.5 text-terracotta-400" />
                  <span>Unidad Completa Exclusiva</span>
                </>
              )}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 font-medium">
            {inventoryMode === 'MULTI_ROOM'
              ? 'Compará tipos de habitación disponibles, combiná cantidades y armá tu estadía a medida'
              : 'Este establecimiento se alquila como propiedad completa e independiente'}
          </p>
        </div>

        {/* Estado de Capacidad en Tiempo Real */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-sand-100 border border-sand-300 text-xs">
          {isCapacitySufficient ? (
            <>
              <span className="px-2 py-0.5 rounded-md bg-uritorco-600 text-white text-[10px] font-extrabold uppercase">
                Capacidad OK
              </span>
              <span className="font-bold text-stone-900">
                {totalSelectedRooms} {totalSelectedRooms === 1 ? 'unidad' : 'unidades'} (hasta{' '}
                {totalSelectedCapacity} huéspedes)
              </span>
            </>
          ) : (
            <>
              <span className="px-2 py-0.5 rounded-md bg-amber-600 text-white text-[10px] font-extrabold uppercase">
                Falta cupo
              </span>
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="font-bold text-stone-900">
                Seleccionado para {totalSelectedCapacity} de {totalRequestedGuests} huéspedes
              </span>
            </>
          )}
        </div>
      </div>

      {/* Grilla de Tipos de Habitación */}
      <div className="space-y-4">
        {roomTypes.map((room) => {
          const qty = roomQuantities[room.id] ?? 0;
          const isSelected = qty > 0;
          const remainingStock = Math.max(0, room.availableStock - qty);

          return (
            <article
              key={room.id}
              className={`rounded-2xl bg-sand-50 border transition-colors p-4 sm:p-5 flex flex-col lg:flex-row gap-5 items-stretch lg:items-center justify-between ${
                isSelected ? 'border-terracotta-500 ring-1 ring-terracotta-500/30' : 'border-sand-300/80'
              }`}
            >
              {/* Foto + Detalles de la Categoría */}
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="w-full sm:w-44 h-32 rounded-xl overflow-hidden shrink-0 bg-sand-200 relative">
                  <img
                    src={room.imageUrl}
                    alt={room.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {room.breakfastIncluded && (
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-uritorco-600 text-white text-[10px] font-extrabold shadow-xs">
                      <Coffee className="w-3 h-3" />
                      <span>Desayuno</span>
                    </span>
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display font-black text-base sm:text-lg text-stone-900">
                      {room.name}
                    </h3>
                    {room.availableStock <= 2 && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-600 text-white text-[10px] font-extrabold">
                        ¡Últimas {room.availableStock} disponibles!
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">{room.description}</p>

                  {/* Metadatos: Capacidad, Camas, Superficie */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-stone-800 pt-0.5">
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-terracotta-600" />
                      Hasta {room.maxGuests} personas
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <BedDouble className="w-3.5 h-3.5 text-terracotta-600" />
                      {room.bedsSummary}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-stone-500" />
                      {room.sizeSqm} m²
                    </span>
                  </div>

                  {/* Comodidades de la habitación */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {room.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-sand-200/80 text-stone-800 text-[11px] font-semibold"
                      >
                        <Check className="w-3 h-3 text-uritorco-600" />
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tarifa por Noche y Selector de Cantidad */}
              <div className="flex sm:flex-row lg:flex-col items-center sm:justify-between lg:items-end justify-between gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l border-sand-200 lg:pl-6 shrink-0">
                <div className="text-left lg:text-right">
                  <span className="text-[11px] font-semibold text-stone-500 block">
                    Tarifa por noche
                  </span>
                  <div className="font-display font-black text-xl text-stone-900">
                    ${room.pricePerNight.toLocaleString('es-AR')} ARS
                  </div>
                  <span className="text-[11px] font-medium text-stone-500">
                    Cupo disp.: {remainingStock} de {room.totalStock}
                  </span>
                </div>

                {/* Control de Cantidad */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onChangeQuantity(room.id, qty - 1)}
                    disabled={qty <= 0}
                    aria-label={`Quitar una unidad de ${room.name}`}
                    className="w-9 h-9 rounded-xl bg-stone-200 hover:bg-stone-300 disabled:opacity-40 text-stone-900 flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span
                    className="w-10 text-center font-display font-black text-base text-stone-900"
                    aria-live="polite"
                  >
                    {qty}
                  </span>

                  <button
                    type="button"
                    onClick={() => onChangeQuantity(room.id, qty + 1)}
                    disabled={qty >= room.availableStock}
                    aria-label={`Agregar una unidad de ${room.name}`}
                    className="w-9 h-9 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-40 text-white flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
