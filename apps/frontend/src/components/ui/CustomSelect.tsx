import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSmartFloating } from './useSmartFloating';

export interface Option {
  value: string;
  label: string;
  description?: string;
}

export interface CustomSelectProps {
  label: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  icon,
  value,
  onChange,
  options,
  placeholder = 'Seleccionar...',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { triggerRef, popoverRef, coords } = useSmartFloating({
    isOpen,
    onClose: () => setIsOpen(false),
    estimatedHeight: 280,
    estimatedWidth: 260,
  });

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`relative w-full ${className}`}>
      {/* Trigger Button con Affordance de Norman y Ley de Fitts */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full text-left bg-[#fbf9f5] hover:bg-[#f3eee3] active:bg-[#ede7d8] border rounded-2xl px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer group ${
          isOpen ? 'ring-2 ring-primary-500 border-primary-500 bg-[#f3eee3]' : 'border-stone-300/80'
        }`}
      >
        <div className="text-[10px] font-bold text-terracotta-700 tracking-wider uppercase flex items-center gap-1.5 mb-1 select-none">
          {icon && <span className="text-terracotta-600 shrink-0">{icon}</span>}
          <span>{label}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="font-display font-bold text-sm sm:text-base text-stone-900 truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={`w-4 h-4 text-stone-600 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </button>

      {/* Popover Inteligente renderizado en document.body (Inmune a Stacking Contexts y Overflow) */}
      {isOpen && isMounted && coords && createPortal(
        <div
          ref={popoverRef}
          role="listbox"
          style={{
            position: 'fixed',
            top: coords.top !== undefined ? `${coords.top}px` : undefined,
            bottom: coords.bottom !== undefined ? `${coords.bottom}px` : undefined,
            left: coords.left !== undefined ? `${coords.left}px` : undefined,
            right: coords.right !== undefined ? `${coords.right}px` : undefined,
            minWidth: `${Math.max(260, coords.width || 0)}px`,
            maxWidth: '92vw',
            zIndex: 99999,
          }}
          className="bg-white rounded-2xl shadow-2xl border border-stone-200 p-2 max-h-72 overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-150"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-primary-50 text-primary-950 font-bold'
                    : 'text-stone-800 hover:bg-stone-100 hover:text-stone-950'
                }`}
              >
                <div>
                  <div className="leading-tight text-stone-900">{option.label}</div>
                  {option.description && (
                    <div className="text-[11px] text-stone-500 font-normal mt-0.5">{option.description}</div>
                  )}
                </div>
                {isSelected && (
                  <svg className="w-4 h-4 text-primary-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
};
