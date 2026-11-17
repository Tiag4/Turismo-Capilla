import React, { useState, useRef, useEffect, useId } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useAnimatedPresence } from '../../hooks/useAnimatedPresence.ts';
import { InfoTooltip } from './Tooltip.tsx';

export interface CustomDatePickerProps {
  label?: string;
  value: string; // ISO: YYYY-MM-DD or empty
  onChange: (date: string) => void;
  placeholder?: string;
  minDate?: string; // ISO: YYYY-MM-DD
  maxDate?: string; // ISO: YYYY-MM-DD
  error?: string;
  helperText?: string;
  tooltip?: React.ReactNode;
  clearable?: boolean;
  className?: string;
  disabled?: boolean;
  id?: string;
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const WEEKDAY_NAMES = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = 'dd/mm/aaaa',
  minDate,
  maxDate,
  error,
  helperText,
  tooltip,
  clearable = false,
  className = '',
  disabled = false,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { shouldRender, isVisible } = useAnimatedPresence(isOpen, 150);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const generatedId = useId();
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : generatedId);

  // Parse ISO date
  const parseDate = (dStr?: string) => {
    if (!dStr) return new Date();
    const parts = dStr.split('-').map(Number);
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    return new Date();
  };

  const initialDate = value ? parseDate(value) : new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  useEffect(() => {
    if (value) {
      const d = parseDate(value);
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [value]);

  // Click outside and escape handling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const formatDisplay = (dStr: string) => {
    if (!dStr) return placeholder;
    const parts = dStr.split('-');
    if (parts.length !== 3) return dStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  // Monday-first offset: 0=Sunday -> 6, 1=Monday -> 0, etc.
  const rawDayIndex = new Date(viewYear, viewMonth, 1).getDay();
  const firstDayOffset = rawDayIndex === 0 ? 6 : rawDayIndex - 1;

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const isDateDisabled = (day: number) => {
    const currentStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (minDate && currentStr < minDate) return true;
    if (maxDate && currentStr > maxDate) return true;
    return false;
  };

  const isDateSelected = (day: number) => {
    if (!value) return false;
    const currentStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return currentStr === value;
  };

  const todayStr = (() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  })();

  const isToday = (day: number) => {
    const currentStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return currentStr === todayStr;
  };

  const handleSelectDay = (day: number) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(dateStr);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleSelectToday = () => {
    if (minDate && todayStr < minDate) return;
    if (maxDate && todayStr > maxDate) return;
    onChange(todayStr);
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`} ref={containerRef}>
      {label && (
        <div className="flex items-center gap-1.5">
          <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-[var(--color-sand-800)]">
            {label}
          </label>
          {tooltip && <InfoTooltip content={tooltip} />}
        </div>
      )}

      <div className="relative w-full">
        <button
          ref={triggerRef}
          id={inputId}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-label={label ? `${label}: ${value ? formatDisplay(value) : 'sin fecha seleccionada'}` : 'Seleccionar fecha'}
          className={`w-full min-h-[42px] flex items-center justify-between rounded-xl border bg-white px-3.5 py-2.5 text-sm transition-all cursor-pointer ${
            disabled
              ? 'opacity-60 cursor-not-allowed bg-[var(--color-sand-50)] border-[var(--color-sand-200)]'
              : error
              ? 'border-rose-600 focus:border-rose-600 ring-1 ring-rose-500'
              : isOpen
              ? 'border-[var(--color-terracotta-500)] ring-2 ring-[var(--color-terracotta-500)]/20 shadow-xs'
              : 'border-[var(--color-sand-300)] hover:border-[var(--color-sand-400)]'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <CalendarIcon
              className={`w-4 h-4 shrink-0 transition-colors ${
                isOpen ? 'text-[var(--color-terracotta-500)]' : 'text-[var(--color-sand-500)]'
              }`}
            />
            <span
              className={`truncate font-medium text-sm tabular-nums ${
                value ? 'text-[var(--color-sand-900)]' : 'text-[var(--color-sand-400)]'
              }`}
            >
              {formatDisplay(value)}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-2">
            {clearable && value && !disabled && (
              <span
                role="button"
                tabIndex={0}
                aria-label="Limpiar fecha seleccionada"
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onChange('');
                  }
                }}
                className="p-1 rounded-md text-[var(--color-sand-400)] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
        </button>

        {/* Popover Calendar Dropdown */}
        {shouldRender && (
          <div
            role="dialog"
            aria-label="Selector de fecha del calendario"
            className={`absolute top-full left-0 mt-1.5 w-72 bg-white border border-[var(--color-sand-200)] rounded-2xl shadow-xl z-50 p-3.5 origin-top transition-all duration-150 ease-out select-none ${
              isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
            }`}
          >
            {/* Header: Month / Year / Navigation */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--color-sand-100)]">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Mes anterior"
                className="p-1.5 rounded-lg text-[var(--color-sand-600)] hover:text-[var(--color-sand-900)] hover:bg-[var(--color-sand-100)] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-bold text-xs font-['Outfit'] text-[var(--color-sand-900)]">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>

              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Mes siguiente"
                className="p-1.5 rounded-lg text-[var(--color-sand-600)] hover:text-[var(--color-sand-900)] hover:bg-[var(--color-sand-100)] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Weekday Names */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1">
              {WEEKDAY_NAMES.map((d) => (
                <span key={d} className="text-[10px] font-bold uppercase text-[var(--color-sand-400)] py-0.5">
                  {d}
                </span>
              ))}
            </div>

            {/* Month Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty offset spaces */}
              {Array.from({ length: firstDayOffset }).map((_, i) => (
                <div key={`offset-${i}`} className="w-8 h-8" />
              ))}

              {/* Days */}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const disabled = isDateDisabled(day);
                const selected = isDateSelected(day);
                const today = isToday(day);

                return (
                  <button
                    key={day}
                    type="button"
                    disabled={disabled}
                    onClick={() => handleSelectDay(day)}
                    aria-label={`${day} de ${MONTH_NAMES[viewMonth]} de ${viewYear}`}
                    aria-selected={selected}
                    aria-disabled={disabled}
                    className={`w-8 h-8 text-xs font-semibold rounded-lg flex items-center justify-center transition-all cursor-pointer relative ${
                      selected
                        ? 'bg-[var(--color-terracotta-500)] text-white shadow-xs font-bold'
                        : today
                        ? 'border border-[var(--color-terracotta-500)] text-[var(--color-terracotta-600)] font-bold hover:bg-[var(--color-sand-100)]'
                        : disabled
                        ? 'text-[var(--color-sand-300)] cursor-not-allowed line-through'
                        : 'text-[var(--color-sand-800)] hover:bg-[var(--color-sand-100)]'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Footer with Quick Action (Hoy / Limpiar) */}
            <div className="pt-2.5 mt-2.5 border-t border-[var(--color-sand-100)] flex items-center justify-between">
              <button
                type="button"
                onClick={handleSelectToday}
                className="text-[11px] font-bold text-[var(--color-terracotta-600)] hover:underline cursor-pointer"
              >
                Hoy
              </button>

              {clearable && value && (
                <button
                  type="button"
                  onClick={() => {
                    onChange('');
                    setIsOpen(false);
                  }}
                  className="text-[11px] font-medium text-[var(--color-sand-500)] hover:text-rose-600 hover:underline cursor-pointer"
                >
                  Borrar selección
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <span className="text-xs font-medium text-rose-600">{error}</span>}
      {helperText && !error && <span className="text-xs text-[var(--color-sand-400)]">{helperText}</span>}
    </div>
  );
};
