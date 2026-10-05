import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface CustomSelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface CustomSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Seleccionar...',
  error,
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

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

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

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
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between rounded-xl border bg-white px-3.5 py-2.5 text-sm text-left transition-all cursor-pointer ${
          disabled
            ? 'opacity-60 cursor-not-allowed bg-[var(--color-sand-50)] border-[var(--color-sand-200)]'
            : error
            ? 'border-rose-600 focus:border-rose-600 ring-1 ring-rose-500'
            : isOpen
            ? 'border-[var(--color-terracotta-500)] ring-2 ring-[var(--color-terracotta-500)]/20 shadow-xs'
            : 'border-[var(--color-sand-300)] hover:border-[var(--color-sand-400)]'
        }`}
      >
        <span className={`truncate ${selectedOption ? 'text-[var(--color-sand-900)] font-medium' : 'text-[var(--color-sand-400)]'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[var(--color-sand-500)] transition-transform duration-200 shrink-0 ml-2 ${
            isOpen ? 'rotate-180 text-[var(--color-terracotta-500)]' : ''
          }`}
        />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute top-full left-0 mt-1.5 w-full bg-white border border-[var(--color-sand-200)] rounded-xl shadow-lg z-50 py-1 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option.value)}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs transition-colors cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[var(--color-sand-100)] text-[var(--color-terracotta-600)] font-semibold'
                    : 'text-[var(--color-sand-800)] hover:bg-[var(--color-sand-50)]'
                }`}
              >
                <div className="flex flex-col truncate pr-2">
                  <span className="truncate">{option.label}</span>
                  {option.description && (
                    <span className="text-[10px] text-[var(--color-sand-400)] font-normal truncate">
                      {option.description}
                    </span>
                  )}
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[var(--color-terracotta-500)] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}

      {error && <span className="text-xs font-medium text-rose-600">{error}</span>}
    </div>
  );
};
