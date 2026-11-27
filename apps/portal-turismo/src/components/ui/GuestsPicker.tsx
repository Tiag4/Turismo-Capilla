import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Users, User, Plus, Minus, ChevronDown, X } from 'lucide-react';
import { useSmartFloating } from './useSmartFloating';
import { useAnimatedPresence } from '../../hooks/useAnimatedPresence';
import { CustomSelect, type Option } from './CustomSelect';

export interface GuestsSelection {
  adults: number;
  childrenCount: number;
  childAges: (number | null)[];
  rooms: number;
}

export interface GuestsPickerProps {
  value: GuestsSelection;
  onChange: (val: GuestsSelection) => void;
  label?: string;
  variant?: 'search' | 'compact' | 'form';
  className?: string;
  minAdults?: number;
  maxAdults?: number;
  maxChildren?: number;
  maxRooms?: number;
  showRooms?: boolean;
  showChildAges?: boolean;
}

const AGE_OPTIONS: Option[] = Array.from({ length: 18 }, (_, i) => ({
  value: String(i),
  label: `${i} ${i === 1 ? 'año' : 'años'}`,
}));

interface CounterRowProps {
  label: string;
  subtitle?: string;
  value: number;
  min: number;
  max: number;
  onMinus: () => void;
  onPlus: () => void;
}

const CounterRow: React.FC<CounterRowProps> = ({
  label,
  subtitle,
  value,
  min,
  max,
  onMinus,
  onPlus,
}) => (
  <div className="flex items-center justify-between py-1">
    <div className="flex flex-col">
      <span className="font-semibold text-sm text-stone-800">{label}</span>
      {subtitle && <span className="text-[11px] text-stone-500">{subtitle}</span>}
    </div>
    <div className="flex items-center gap-2 border border-stone-200 rounded-xl p-1 bg-stone-50/50">
      <button
        type="button"
        disabled={value <= min}
        onClick={onMinus}
        aria-label={`Disminuir ${label}`}
        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-stone-200 hover:bg-stone-100 active:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
      >
        <Minus className="w-3.5 h-3.5 text-stone-700" />
      </button>
      <span className="w-5 text-center font-bold text-sm text-stone-900 select-none">
        {value}
      </span>
      <button
        type="button"
        disabled={value >= max}
        onClick={onPlus}
        aria-label={`Aumentar ${label}`}
        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-stone-200 hover:bg-stone-100 active:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
      >
        <Plus className="w-3.5 h-3.5 text-stone-700" />
      </button>
    </div>
  </div>
);

export const GuestsPicker: React.FC<GuestsPickerProps> = ({
  value,
  onChange,
  label = 'Huéspedes',
  variant = 'search',
  className = '',
  minAdults = 1,
  maxAdults = 10,
  maxChildren = 6,
  maxRooms = 5,
  showRooms = true,
  showChildAges = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { shouldRender, isVisible } = useAnimatedPresence(isOpen, 150);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { triggerRef, popoverRef, coords } = useSmartFloating({
    isOpen,
    onClose: () => setIsOpen(false),
    preferredPlacement: 'bottom',
    estimatedHeight: showChildAges && value.childrenCount > 0 ? 380 : 280,
    estimatedWidth: 320,
  });

  const updateAdults = (delta: number) => {
    const next = Math.max(minAdults, Math.min(maxAdults, value.adults + delta));
    onChange({ ...value, adults: next });
  };

  const updateRooms = (delta: number) => {
    const current = value.rooms ?? 1;
    const next = Math.max(1, Math.min(maxRooms, current + delta));
    onChange({ ...value, rooms: next });
  };

  const updateChildren = (delta: number) => {
    const current = value.childrenCount ?? 0;
    const nextCount = Math.max(0, Math.min(maxChildren, current + delta));
    const currentAges = value.childAges ?? [];
    let nextAges = [...currentAges];
    if (nextCount > nextAges.length) {
      nextAges = [...nextAges, ...Array(nextCount - nextAges.length).fill(null)];
    } else if (nextCount < nextAges.length) {
      nextAges = nextAges.slice(0, nextCount);
    }
    onChange({ ...value, childrenCount: nextCount, childAges: nextAges });
  };

  const updateChildAge = (idx: number, ageStr: string) => {
    const next = [...(value.childAges ?? [])];
    next[idx] = ageStr === '' ? null : Number(ageStr);
    onChange({ ...value, childAges: next });
  };

  // Human summary text
  const totalGuests = value.adults + (value.childrenCount ?? 0);
  let summary = '';
  if (variant === 'compact') {
    summary = `${value.adults} ad. · ${value.childrenCount ?? 0} niñ.${showRooms && value.rooms ? ` · ${value.rooms} hab.` : ''}`;
  } else {
    const adultsText = `${value.adults} ${value.adults === 1 ? 'adulto' : 'adultos'}`;
    const childrenCount = value.childrenCount ?? 0;
    if (childrenCount > 0) {
      const childrenText = `${childrenCount} ${childrenCount === 1 ? 'niño' : 'niños'}`;
      summary = `${adultsText} · ${childrenText}`;
    } else {
      summary = adultsText;
    }
    if (showRooms && value.rooms && value.rooms > 1) {
      summary += ` · ${value.rooms} hab.`;
    }
  }

  const isSearchVariant = variant === 'search';
  const isCompactVariant = variant === 'compact';

  return (
    <div className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      {isCompactVariant ? (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          className="w-full py-2 px-3 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 text-left flex items-center justify-between cursor-pointer group select-none transition-colors"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <User className="w-4 h-4 text-stone-500 shrink-0" />
            <div className="truncate">
              <div className="text-[10px] font-semibold text-stone-500 uppercase">{label}</div>
              <div className="text-xs sm:text-sm font-bold text-stone-900 truncate">{summary}</div>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-stone-500 shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      ) : isSearchVariant ? (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          className={`w-full text-left bg-[#fbf9f5] hover:bg-[#f3eee3] active:bg-[#ede7d8] border rounded-2xl px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer group ${
            isOpen ? 'ring-2 ring-primary-500 border-primary-500 bg-[#f3eee3]' : 'border-stone-300/80'
          }`}
        >
          <div className="text-[10px] font-bold text-terracotta-700 tracking-wider uppercase flex items-center gap-1.5 mb-1 select-none">
            <Users className="w-3.5 h-3.5 text-terracotta-600 shrink-0" />
            <span>{label}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-display font-bold text-sm sm:text-base text-stone-900 truncate">
              {summary}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-stone-600 transition-transform duration-200 shrink-0 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          className={`w-full inline-flex items-center justify-between gap-2 bg-white border rounded-xl px-3.5 py-2.5 transition-all focus:outline-none focus:border-terracotta-500 cursor-pointer text-sm text-stone-900 ${
            isOpen ? 'border-terracotta-500 ring-2 ring-terracotta-500/20' : 'border-stone-300 hover:border-stone-400'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            <Users className="w-4 h-4 text-stone-500 shrink-0" />
            <span className="truncate">{summary}</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-stone-500 transition-transform duration-200 shrink-0 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      )}

      {/* Popover Floating or Modal on Mobile */}
      {shouldRender && isMounted && coords && createPortal(
        coords.isModal ? (
          <div className="fixed inset-0 z-[99999] bg-stone-900/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
            <div
              ref={popoverRef}
              role="dialog"
              aria-modal="true"
              aria-label="Seleccionar huéspedes"
              className={`w-full sm:w-[340px] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-stone-200 p-5 space-y-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200 sm:zoom-in-95 transition-all ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Drag handle on mobile */}
              <div className="sm:hidden w-12 h-1.5 bg-stone-300 rounded-full mx-auto -mt-1 mb-2 shrink-0" />

              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <div>
                  <h3 className="font-display font-bold text-base text-stone-900">
                    Ocupación y Huéspedes
                  </h3>
                  <p className="text-xs text-stone-500">
                    {totalGuests} {totalGuests === 1 ? 'persona en total' : 'personas en total'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Cerrar"
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 divide-y divide-stone-100">
                <CounterRow
                  label="Adultos"
                  subtitle="A partir de 18 años"
                  value={value.adults}
                  min={minAdults}
                  max={maxAdults}
                  onMinus={() => updateAdults(-1)}
                  onPlus={() => updateAdults(1)}
                />

                <CounterRow
                  label="Niños"
                  subtitle="De 0 a 17 años"
                  value={value.childrenCount ?? 0}
                  min={0}
                  max={maxChildren}
                  onMinus={() => updateChildren(-1)}
                  onPlus={() => updateChildren(1)}
                />

                {showChildAges && (value.childrenCount ?? 0) > 0 && (
                  <div className="space-y-2.5 pt-2">
                    <span className="text-xs font-semibold text-stone-700 block">
                      Edades de los niños
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {(value.childAges ?? []).map((age, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <CustomSelect
                            variant="compact"
                            label={`Edad niño ${idx + 1}`}
                            placeholder={`Niño ${idx + 1}...`}
                            value={age === null ? '' : String(age)}
                            onChange={(val) => updateChildAge(idx, val)}
                            options={AGE_OPTIONS}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {showRooms && (
                  <CounterRow
                    label="Habitaciones"
                    subtitle="Unidades o cabañas"
                    value={value.rooms ?? 1}
                    min={1}
                    max={maxRooms}
                    onMinus={() => updateRooms(-1)}
                    onPlus={() => updateRooms(1)}
                  />
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-terracotta-600 hover:bg-terracotta-700 active:bg-terracotta-800 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer shadow-sm select-none"
              >
                Aplicar
              </button>
            </div>
          </div>
        ) : (
          <div
            ref={popoverRef}
            role="dialog"
            aria-modal="true"
            aria-label="Seleccionar huéspedes"
            style={{
              position: 'fixed',
              top: coords.top !== undefined ? `${coords.top}px` : undefined,
              bottom: coords.bottom !== undefined ? `${coords.bottom}px` : undefined,
              left: coords.left !== undefined ? `${coords.left}px` : undefined,
              right: coords.right !== undefined ? `${coords.right}px` : undefined,
              width: `${coords.width ?? 320}px`,
              zIndex: 99999,
            }}
            className={`bg-white rounded-2xl shadow-2xl border border-stone-200 p-4 space-y-3.5 origin-top transition-all duration-150 ease-out ${
              isVisible
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
            }`}
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-stone-100">
              <span className="font-display font-bold text-sm text-stone-900">
                Ocupación y Huéspedes
              </span>
              <span className="text-[11px] font-medium text-stone-500">
                {totalGuests} {totalGuests === 1 ? 'huésped' : 'huéspedes'}
              </span>
            </div>

            <div className="space-y-2.5 divide-y divide-stone-100">
              <CounterRow
                label="Adultos"
                subtitle="A partir de 18 años"
                value={value.adults}
                min={minAdults}
                max={maxAdults}
                onMinus={() => updateAdults(-1)}
                onPlus={() => updateAdults(1)}
              />

              <CounterRow
                label="Niños"
                subtitle="De 0 a 17 años"
                value={value.childrenCount ?? 0}
                min={0}
                max={maxChildren}
                onMinus={() => updateChildren(-1)}
                onPlus={() => updateChildren(1)}
              />

              {showChildAges && (value.childrenCount ?? 0) > 0 && (
                <div className="space-y-2 pt-1.5">
                  <span className="text-[11px] font-semibold text-stone-700 block">
                    Edades al momento del viaje
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {(value.childAges ?? []).map((age, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <CustomSelect
                          variant="compact"
                          label={`Edad niño ${idx + 1}`}
                          placeholder={`Edad (${idx + 1}°)...`}
                          value={age === null ? '' : String(age)}
                          onChange={(val) => updateChildAge(idx, val)}
                          options={AGE_OPTIONS}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {showRooms && (
                <CounterRow
                  label="Habitaciones"
                  subtitle="Cabañas o unidades"
                  value={value.rooms ?? 1}
                  min={1}
                  max={maxRooms}
                  onMinus={() => updateRooms(-1)}
                  onPlus={() => updateRooms(1)}
                />
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-900 font-bold text-xs rounded-xl transition-colors cursor-pointer select-none"
            >
              Listo
            </button>
          </div>
        ),
        document.body
      )}
    </div>
  );
};
