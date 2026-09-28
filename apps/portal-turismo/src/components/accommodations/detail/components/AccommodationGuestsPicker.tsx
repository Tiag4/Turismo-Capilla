import React, { useState, useRef, useEffect } from 'react';
import { User, Plus, Minus, ChevronDown } from 'lucide-react';
import { CustomSelect, type Option } from '../../../ui/CustomSelect';

export interface GuestsSelection {
  adults: number;
  childrenCount: number;
  childAges: (number | null)[];
  rooms: number;
}

interface AccommodationGuestsPickerProps {
  value: GuestsSelection;
  onChange: (val: GuestsSelection) => void;
}

const AGE_OPTIONS: Option[] = Array.from({ length: 18 }, (_, i) => ({
  value: String(i),
  label: `${i} ${i === 1 ? 'año' : 'años'}`,
}));

const CounterRow = ({
  label,
  value,
  min,
  onMinus,
  onPlus,
}: {
  label: string;
  value: number;
  min: number;
  onMinus: () => void;
  onPlus: () => void;
}) => (
  <div className="flex items-center justify-between">
    <span className="font-semibold text-sm text-stone-800">{label}</span>
    <div className="flex items-center gap-2.5 border border-stone-300 rounded-lg p-1">
      <button
        type="button"
        disabled={value <= min}
        onClick={onMinus}
        className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-stone-100 disabled:opacity-30 cursor-pointer"
      >
        <Minus className="w-3.5 h-3.5 text-stone-700" />
      </button>
      <span className="w-4 text-center font-bold text-sm text-stone-900">{value}</span>
      <button
        type="button"
        onClick={onPlus}
        className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-stone-100 cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5 text-stone-700" />
      </button>
    </div>
  </div>
);

export const AccommodationGuestsPicker: React.FC<AccommodationGuestsPickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Don't close if clicking inside a portal popup
      const target = e.target as HTMLElement;
      if (target?.closest('[role="listbox"]')) return;
      if (containerRef.current && !containerRef.current.contains(target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const updateAdults = (delta: number) =>
    onChange({ ...value, adults: Math.max(1, Math.min(10, value.adults + delta)) });
  const updateRooms = (delta: number) =>
    onChange({ ...value, rooms: Math.max(1, Math.min(5, value.rooms + delta)) });

  const updateChildren = (delta: number) => {
    const nextCount = Math.max(0, Math.min(6, value.childrenCount + delta));
    let nextAges = [...value.childAges];
    if (nextCount > nextAges.length) nextAges = [...nextAges, ...Array(nextCount - nextAges.length).fill(null)];
    else if (nextCount < nextAges.length) nextAges = nextAges.slice(0, nextCount);
    onChange({ ...value, childrenCount: nextCount, childAges: nextAges });
  };

  const updateChildAge = (idx: number, ageStr: string) => {
    const next = [...value.childAges];
    next[idx] = ageStr === '' ? null : Number(ageStr);
    onChange({ ...value, childAges: next });
  };

  const summary = `${value.adults} ad. · ${value.childrenCount} niñ. · ${value.rooms} hab.`;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-2 px-3 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 text-left flex items-center justify-between cursor-pointer group select-none"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <User className="w-4 h-4 text-stone-500 shrink-0" />
          <div className="truncate">
            <div className="text-[10px] font-semibold text-stone-500 uppercase">Ocupación</div>
            <div className="text-xs sm:text-sm font-bold text-stone-900 truncate">{summary}</div>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-stone-500 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-stone-200 p-4 space-y-3.5 w-full sm:w-[320px]">
          <CounterRow label="Adultos" value={value.adults} min={1} onMinus={() => updateAdults(-1)} onPlus={() => updateAdults(1)} />
          <CounterRow label="Niños" value={value.childrenCount} min={0} onMinus={() => updateChildren(-1)} onPlus={() => updateChildren(1)} />

          {value.childrenCount > 0 && (
            <div className="space-y-2 pt-1 border-t border-stone-100">
              <div className="grid grid-cols-2 gap-2">
                {value.childAges.map((age, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <CustomSelect
                      variant="compact"
                      label={`Edad niño ${idx + 1}`}
                      placeholder={`Edad (${idx + 1}°)...`}
                      value={age === null ? '' : String(age)}
                      onChange={(val) => updateChildAge(idx, val)}
                      options={AGE_OPTIONS}
                    />
                    {age === null && <span className="text-[10px] text-red-600 font-medium block">Seleccionar edad</span>}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-stone-500 leading-tight">
                Ingresá las edades para calcular el alojamiento y camas exactas al momento del check-out.
              </p>
            </div>
          )}

          <div className="pt-1 border-t border-stone-100">
            <CounterRow label="Habitaciones" value={value.rooms} min={1} onMinus={() => updateRooms(-1)} onPlus={() => updateRooms(1)} />
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Listo
          </button>
        </div>
      )}
    </div>
  );
};
