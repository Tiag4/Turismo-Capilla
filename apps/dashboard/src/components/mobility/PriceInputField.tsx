import React from 'react';
import { extractPriceRaw, formatPriceWithCurrency } from '../../utils/priceFormat';

export interface PriceInputFieldProps {
  label?: string;
  value: string;
  onChange: (formattedValue: string) => void;
  showArs: boolean;
  placeholder?: string;
  helperText?: string;
}

export const PriceInputField: React.FC<PriceInputFieldProps> = ({
  label,
  value,
  onChange,
  showArs,
  placeholder = '1.000',
  helperText,
}) => {
  const rawValue = extractPriceRaw(value);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Si el usuario pega texto que ya incluya '$' o 'ARS', se limpia automáticamente
    const typed = e.target.value;
    const cleanTyped = extractPriceRaw(typed);
    const result = formatPriceWithCurrency(cleanTyped, showArs);
    onChange(result);
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-[11px] font-bold text-amber-950 uppercase tracking-wide">
          {label}
        </label>
      )}

      <div className="flex items-center rounded-xl border border-amber-300 bg-amber-50/30 overflow-hidden focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500 shadow-2xs transition-all">
        {/* Símbolo $ Fijo e Imposible de Borrar */}
        <span
          className="inline-flex items-center justify-center px-3.5 py-2.5 text-sm font-black text-amber-950 bg-amber-100/80 border-r border-amber-300/80 select-none shrink-0"
          title="Símbolo de moneda oficial fijo"
        >
          $
        </span>

        {/* Campo de edición numérica */}
        <input
          type="text"
          value={rawValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full text-sm font-black text-sand-900 px-3 py-2 bg-transparent outline-none placeholder:text-sand-400 placeholder:font-normal"
        />

        {/* Sufijo ARS con espacio fijo reservado para evitar que el input o texto se mueva */}
        <span
          className={`inline-flex items-center px-2 py-0.5 text-[11px] font-black tracking-wider text-amber-900 bg-amber-100/90 rounded-md border border-amber-300 select-none mr-2 shrink-0 shadow-2xs transition-opacity duration-150 ${
            showArs ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          title="Pesos Argentinos (ARS)"
          aria-hidden={!showArs}
        >
          ARS
        </span>
      </div>

      {helperText && (
        <p className="text-[10px] text-sand-500 font-medium">{helperText}</p>
      )}
    </div>
  );
};
