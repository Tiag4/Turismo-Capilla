import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSmartFloating } from './useSmartFloating';

export interface CustomDatePickerProps {
  label: string;
  icon?: React.ReactNode;
  value: string; // ISO format: YYYY-MM-DD
  onChange: (date: string) => void;
  minDate?: string; // ISO format: YYYY-MM-DD
  placeholder?: string;
  className?: string;
  preferredPlacement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
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
  preferredPlacement = 'auto',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { triggerRef, popoverRef, coords } = useSmartFloating({
    isOpen,
    onClose: () => setIsOpen(false),
    preferredPlacement,
    estimatedHeight: 380,
    estimatedWidth: 320,
  });

  // Parse date safely
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

  const formatDisplay = (dStr: string) => {
    if (!dStr) return placeholder;
    const parts = dStr.split('-');
    if (parts.length !== 3) return dStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

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
    <div className={`relative w-full h-full flex flex-col ${className}`}>
      {/* Botón Trigger con Affordance clara y feedback visual - Altura uniforme garantizada */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`w-full h-full min-h-[72px] flex flex-col justify-between text-left bg-[#fbf9f5] hover:bg-[#f3eee3] active:bg-[#ede7d8] border rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 transition-all focus:outline-none focus:ring-2 focus:ring-terracotta-500 cursor-pointer group ${
          isOpen ? 'ring-2 ring-terracotta-500 border-terracotta-500 bg-[#f3eee3]' : 'border-stone-300/80'
        }`}
      >
        <div className="text-[10px] font-bold text-terracotta-700 tracking-wider uppercase flex items-center gap-1.5 mb-1 select-none whitespace-nowrap overflow-hidden">
          {icon && <span className="text-terracotta-600 shrink-0">{icon}</span>}
          <span className="truncate">{label}</span>
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

      {/* Calendario Inteligente renderizado en document.body (Inmune a Cortes, Solapamientos y Viewport Clipping) */}
      {isOpen && isMounted && coords && createPortal(
        coords.isModal ? (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in-0 duration-150">
            <div
              ref={popoverRef}
              role="dialog"
              aria-label="Calendario de selección de fecha"
              className="w-full max-w-[340px] bg-white rounded-3xl shadow-2xl border border-stone-200 p-5 text-stone-900 animate-in zoom-in-95 duration-150"
            >
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
                          ? 'bg-terracotta-600 text-white shadow-md shadow-terracotta-600/30'
                          : 'text-stone-800 hover:bg-stone-100 hover:text-stone-950'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {/* Acciones Rápidas */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    const today = new Date();
                    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                    onChange(todayStr);
                    setIsOpen(false);
                  }}
                  className="text-xs font-bold text-terracotta-600 hover:text-terracotta-700 transition-colors cursor-pointer"
                >
                  Hoy
                </button>
                {value && (
                  <button
                    type="button"
                    onClick={() => {
                      onChange('');
                      setIsOpen(false);
                    }}
                    className="text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                  >
                    Borrar
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            ref={popoverRef}
            role="dialog"
            aria-label="Calendario de selección de fecha"
            style={{
              position: 'fixed',
              top: coords.top !== undefined ? `${coords.top}px` : undefined,
              left: coords.left !== undefined ? `${coords.left}px` : undefined,
              width: '320px',
              maxWidth: '94vw',
              maxHeight: 'calc(100vh - 32px)',
              overflowY: 'auto',
              zIndex: 99999,
            }}
            className="bg-white rounded-3xl shadow-2xl border border-stone-200 p-5 text-stone-900 animate-in fade-in-0 zoom-in-95 duration-150"
          >
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
                        ? 'bg-terracotta-600 text-white shadow-md shadow-terracotta-600/30'
                        : 'text-stone-800 hover:bg-stone-100 hover:text-stone-950'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Acciones Rápidas */}
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                  onChange(todayStr);
                  setIsOpen(false);
                }}
                className="text-xs font-bold text-terracotta-600 hover:text-terracotta-700 transition-colors cursor-pointer"
              >
                Hoy
              </button>
              {value && (
                <button
                  type="button"
                  onClick={() => {
                    onChange('');
                    setIsOpen(false);
                  }}
                  className="text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                >
                  Borrar
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        ),
        document.body
      )}
    </div>
  );
};
