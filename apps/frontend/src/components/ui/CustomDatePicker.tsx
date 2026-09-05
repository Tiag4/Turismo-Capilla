import React, { useState, useRef, useEffect } from 'react';

export interface CustomDatePickerProps {
  label: string;
  icon?: React.ReactNode;
  value: string; // ISO format: YYYY-MM-DD
  onChange: (date: string) => void;
  minDate?: string; // ISO format: YYYY-MM-DD
  placeholder?: string;
  className?: string;
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const WEEKDAY_NAMES = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  icon,
  value,
  onChange,
  minDate,
  placeholder = 'Seleccionar fecha',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial view date
  const parseDate = (dStr?: string) => {
    if (!dStr) return new Date();
    const parts = dStr.split('-').map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const formatDisplay = (dStr: string) => {
    if (!dStr) return placeholder;
    const parts = dStr.split('-');
    if (parts.length !== 3) return dStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  // Calendar calculations
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();

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
    if (!minDate) return false;
    const currentStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return currentStr < minDate;
  };

  const isDateSelected = (day: number) => {
    if (!value) return false;
    const currentStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return currentStr === value;
  };

  const handleSelectDay = (day: number) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(dateStr);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="w-full text-left bg-[#fbf9f5] hover:bg-[#f3eee3] border border-stone-300/80 rounded-2xl px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer group"
      >
        <div className="text-[10px] font-bold text-terracotta-700 tracking-wider uppercase flex items-center gap-1.5 mb-1 select-none">
          {icon && <span className="text-terracotta-600 shrink-0">{icon}</span>}
          <span>{label}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="font-display font-bold text-sm sm:text-base text-stone-900 truncate">
            {formatDisplay(value)}
          </span>
          <svg
            className="w-4 h-4 text-stone-600 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 z-50 bg-white rounded-3xl shadow-2xl border border-stone-200 p-5 w-[310px] animate-in fade-in-0 zoom-in-95">
          {/* Header del Calendario */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
              aria-label="Mes anterior"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <span className="font-display font-extrabold text-sm text-stone-900">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
              aria-label="Mes siguiente"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {WEEKDAY_NAMES.map((name) => (
              <span key={name} className="text-[11px] font-bold text-stone-400 select-none">
                {name}
              </span>
            ))}
          </div>

          {/* Matriz de Días */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="w-9 h-9" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const disabled = isDateDisabled(day);
              const selected = isDateSelected(day);

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelectDay(day)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                    disabled
                      ? 'text-stone-300 bg-transparent cursor-not-allowed'
                      : selected
                      ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30'
                      : 'text-stone-800 hover:bg-stone-100 hover:text-stone-950'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Botón rápido "Hoy" */}
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                onChange(todayStr);
                setIsOpen(false);
              }}
              className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors cursor-pointer"
            >
              Hoy
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
