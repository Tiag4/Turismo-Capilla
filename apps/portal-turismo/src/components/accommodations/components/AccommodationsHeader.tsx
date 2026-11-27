import React from 'react';
import { Search, Users } from 'lucide-react';
import { DateRangePicker } from '../../ui/DateRangePicker';
import { CustomSelect, type Option } from '../../ui/CustomSelect';

interface AccommodationsHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  checkIn: string;
  onCheckInChange: (date: string) => void;
  checkOut: string;
  onCheckOutChange: (date: string) => void;
  guests: string;
  onGuestsChange: (guests: string) => void;
  nightsCount?: number | null;
}

const GUEST_OPTIONS: Option[] = [
  { value: '', label: 'Cualquier capacidad' },
  { value: '1', label: '1 persona (individual)' },
  { value: '2', label: '2 personas (pareja)' },
  { value: '3', label: '3 personas (triple)' },
  { value: '4', label: '4 personas (familia)' },
  { value: '5', label: '5+ personas (grupo)' },
];

export const AccommodationsHeader: React.FC<AccommodationsHeaderProps> = ({
  searchQuery,
  onSearchChange,
  checkIn,
  onCheckInChange,
  checkOut,
  onCheckOutChange,
  guests,
  onGuestsChange,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <header className="space-y-6 pt-6 pb-2">
      {/* Título Editorial y Subtítulo */}
      <div className="space-y-2">
        <h1 className="font-display font-black text-3xl sm:text-5xl text-stone-900 tracking-tight">
          Cabañas y Hospedajes en el Valle
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-3xl leading-relaxed">
          Alojamientos verificados con arquitectura serrana de piedra y madera al pie del Cerro Uritorco. Tarifa transparente directa de prestador, sin comisiones de intermediarios.
        </p>
      </div>

      {/* Buscador Cápsula Compacto */}
      <div className="bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-3xl border border-stone-200 shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.3fr_1.8fr_1.1fr] gap-3 items-center">
        {/* Input de Búsqueda por Nombre o Zona */}
        <div className="relative">
          <label className="text-[10px] font-bold text-terracotta-700 tracking-wider uppercase flex items-center gap-1.5 mb-1 px-1">
            <Search className="w-3.5 h-3.5 text-terracotta-600" />
            <span>Zona o Nombre</span>
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Ej. Falda del Uritorco, La Toma..."
            className="w-full bg-[#fbf9f5] hover:bg-[#f3eee3] focus:bg-white border border-stone-300/80 rounded-2xl px-4 py-3 text-sm font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>

        {/* Fechas de Estadía */}
        <div className="sm:col-span-2 lg:col-span-1">
          <DateRangePicker
            checkIn={checkIn}
            checkOut={checkOut}
            onCheckInChange={onCheckInChange}
            onCheckOutChange={onCheckOutChange}
            minDate={todayStr}
            checkInLabel="Ingreso"
            checkOutLabel="Egreso"
            checkInPlaceholder="Ingreso"
            checkOutPlaceholder="Egreso"
          />
        </div>

        {/* Huéspedes */}
        <CustomSelect
          label="Huéspedes"
          value={guests}
          onChange={onGuestsChange}
          options={GUEST_OPTIONS}
          icon={<Users className="w-3.5 h-3.5" />}
        />
      </div>
    </header>
  );
};
