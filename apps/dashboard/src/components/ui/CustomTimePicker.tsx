import React, { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';

export interface CustomTimePickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
  disabled?: boolean;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

export const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  label,
  value,
  onChange,
  error,
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse hour and minute from value (e.g. "14:00 hs", "14:00", etc.)
  const cleanValue = value.replace(/\s*hs$/i, '').trim();
  const [currentHour = '14', currentMinute = '00'] = cleanValue.split(':');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleHourSelect = (h: string) => {
    const newTime = `${h}:${currentMinute} hs`;
    onChange(newTime);
  };

  const handleMinuteSelect = (m: string) => {
    const newTime = `${currentHour}:${m} hs`;
    onChange(newTime);
  };

  const handlePresetSelect = (timeStr: string) => {
    onChange(`${timeStr} hs`);
    setIsOpen(false);
  };

  const formattedDisplay = value ? (value.includes('hs') ? value : `${value} hs`) : 'Seleccionar horario';

  return (
    <div className={`flex flex-col gap-1.5 w-full relative ${className}`} ref={containerRef}>
      {label && (
        <label className="text-xs font-semibold text-[var(--color-sand-800)]">
          {label}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between rounded-xl border bg-white px-3.5 py-2.5 text-sm transition-all cursor-pointer ${
          disabled
            ? 'opacity-60 cursor-not-allowed bg-[var(--color-sand-50)] border-[var(--color-sand-200)]'
            : error
            ? 'border-rose-600 focus:border-rose-600 ring-1 ring-rose-500'
            : isOpen
            ? 'border-[var(--color-terracotta-500)] ring-2 ring-[var(--color-terracotta-500)]/20 shadow-xs'
            : 'border-[var(--color-sand-300)] hover:border-[var(--color-sand-400)]'
        }`}
      >
        <span className={`font-mono text-xs ${value ? 'text-[var(--color-sand-900)] font-bold' : 'text-[var(--color-sand-400)]'}`}>
          {formattedDisplay}
        </span>
        <Clock className={`w-4 h-4 text-[var(--color-sand-500)] ${isOpen ? 'text-[var(--color-terracotta-500)]' : ''}`} />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-64 bg-white border border-[var(--color-sand-200)] rounded-2xl shadow-xl z-50 p-3 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="text-[11px] font-bold text-[var(--color-sand-500)] uppercase tracking-wider mb-2">
            Seleccionar Horario
          </div>

          <div className="grid grid-cols-2 gap-2 h-44 border-b border-[var(--color-sand-200)] pb-2 mb-2">
            {/* Hours Column */}
            <div className="flex flex-col overflow-y-auto pr-1">
              <span className="text-[10px] font-bold text-[var(--color-sand-400)] uppercase mb-1 sticky top-0 bg-white">
                Hora
              </span>
              <div className="flex flex-col gap-0.5">
                {HOURS.map((h) => {
                  const isSelected = h === currentHour;
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => handleHourSelect(h)}
                      className={`px-2 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer text-left ${
                        isSelected
                          ? 'bg-[var(--color-terracotta-500)] text-white font-bold'
                          : 'text-[var(--color-sand-800)] hover:bg-[var(--color-sand-100)]'
                      }`}
                    >
                      {h} hs
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Minutes Column */}
            <div className="flex flex-col overflow-y-auto pr-1">
              <span className="text-[10px] font-bold text-[var(--color-sand-400)] uppercase mb-1 sticky top-0 bg-white">
                Minutos
              </span>
              <div className="flex flex-col gap-0.5">
                {MINUTES.map((m) => {
                  const isSelected = m === currentMinute;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleMinuteSelect(m)}
                      className={`px-2 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer text-left ${
                        isSelected
                          ? 'bg-[var(--color-terracotta-500)] text-white font-bold'
                          : 'text-[var(--color-sand-800)] hover:bg-[var(--color-sand-100)]'
                      }`}
                    >
                      :{m}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex items-center justify-between gap-1 text-[11px]">
            <button
              type="button"
              onClick={() => handlePresetSelect('10:00')}
              className="px-2 py-1 bg-[var(--color-sand-100)] hover:bg-[var(--color-sand-200)] text-[var(--color-sand-800)] rounded-lg font-medium cursor-pointer transition-colors"
            >
              10:00 hs
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect('14:00')}
              className="px-2 py-1 bg-[var(--color-sand-100)] hover:bg-[var(--color-sand-200)] text-[var(--color-sand-800)] rounded-lg font-medium cursor-pointer transition-colors"
            >
              14:00 hs
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-2 py-1 text-[var(--color-terracotta-600)] font-semibold hover:underline cursor-pointer"
            >
              Listo
            </button>
          </div>
        </div>
      )}

      {error && <span className="text-xs font-medium text-rose-600">{error}</span>}
    </div>
  );
};
