import React, { useState, useEffect, useRef } from 'react';
import { BedDouble, Plus, Minus, Trash2 } from 'lucide-react';
import {
  type BedroomConfigItem,
  ROOM_NAME_PRESETS,
  BED_FIELDS,
  parseSummaryToRooms,
  formatRoomBedsText,
  serializeRoomsToSummary,
} from './bedroomsDistribution.utils.ts';

export interface BedroomsDistributionBuilderProps {
  value: string;
  onChange: (summary: string) => void;
}

export const BedroomsDistributionBuilder: React.FC<BedroomsDistributionBuilderProps> = ({
  value,
  onChange,
}) => {
  const [rooms, setRooms] = useState<BedroomConfigItem[]>(() => parseSummaryToRooms(value));
  const lastEmittedRef = useRef<string>(value);

  useEffect(() => {
    if (value !== lastEmittedRef.current) {
      lastEmittedRef.current = value;
      setRooms(parseSummaryToRooms(value));
    }
  }, [value]);

  const commitRooms = (next: BedroomConfigItem[]) => {
    const serialized = serializeRoomsToSummary(next);
    lastEmittedRef.current = serialized;
    setRooms(next);
    onChange(serialized);
  };

  const updateRoom = (id: string, patch: Partial<BedroomConfigItem>) => {
    commitRooms(rooms.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const handleAddRoom = () => {
    const used = new Set(rooms.map((r) => r.roomName));
    const nextName = ROOM_NAME_PRESETS.find((p) => !used.has(p)) || `Ambiente ${rooms.length + 1}`;
    commitRooms([
      ...rooms,
      { id: `room-${Date.now()}`, roomName: nextName, doubleBeds: 0, singleBeds: 1, bunkBeds: 0, sofaBeds: 0 },
    ]);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-xs font-semibold text-[var(--color-sand-800)] flex items-center gap-1.5">
          <BedDouble className="w-3.5 h-3.5 text-[var(--color-terracotta-500)]" aria-hidden="true" />
          <span>Distribución de dormitorios y camas</span>
        </label>
        <button
          type="button"
          onClick={handleAddRoom}
          className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-terracotta-600)] hover:text-[var(--color-terracotta-700)] cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Agregar dormitorio o ambiente</span>
        </button>
      </div>

      <div className="rounded-xl border border-[var(--color-sand-200)] bg-[var(--color-sand-50)] divide-y divide-[var(--color-sand-200)]">
        {rooms.map((room, idx) => {
          const roomOptions = ROOM_NAME_PRESETS.includes(room.roomName)
            ? ROOM_NAME_PRESETS
            : [room.roomName, ...ROOM_NAME_PRESETS];
          return (
            <div key={room.id} className="p-3.5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                  <select
                    aria-label={`Nombre del ambiente ${idx + 1}`}
                    value={room.roomName}
                    onChange={(e) => updateRoom(room.id, { roomName: e.target.value })}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-[var(--color-sand-300)] text-xs font-bold text-[var(--color-sand-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta-500)]"
                  >
                    {roomOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <span className="text-[11px] font-medium text-[var(--color-sand-600)] truncate">
                    {formatRoomBedsText(room)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => rooms.length > 1 && commitRooms(rooms.filter((r) => r.id !== room.id))}
                  disabled={rooms.length <= 1}
                  aria-label={`Eliminar ${room.roomName}`}
                  className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {BED_FIELDS.map(({ key, label }) => {
                  const count = room[key];
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-[var(--color-sand-200)]"
                    >
                      <span className="text-[11px] font-semibold text-[var(--color-sand-700)] truncate">{label}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => updateRoom(room.id, { [key]: Math.max(0, count - 1) })}
                          disabled={count <= 0}
                          aria-label={`Restar cama ${label} en ${room.roomName}`}
                          className="w-6 h-6 rounded-md border border-[var(--color-sand-200)] flex items-center justify-center text-[var(--color-sand-700)] hover:bg-[var(--color-sand-100)] disabled:opacity-30 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-4 text-center text-xs font-bold text-[var(--color-sand-900)]">{count}</span>
                        <button
                          type="button"
                          onClick={() => updateRoom(room.id, { [key]: Math.min(10, count + 1) })}
                          disabled={count >= 10}
                          aria-label={`Sumar cama ${label} en ${room.roomName}`}
                          className="w-6 h-6 rounded-md border border-[var(--color-sand-200)] flex items-center justify-center text-[var(--color-sand-700)] hover:bg-[var(--color-sand-100)] disabled:opacity-30 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div className="px-3.5 py-2 text-[11px] text-[var(--color-sand-600)]">
          <span className="font-bold text-[var(--color-sand-800)]">Vista previa en ficha: </span>
          {rooms.map((r) => `${r.roomName}: ${formatRoomBedsText(r)}`).join(' · ')}
        </div>
      </div>
    </div>
  );
};
