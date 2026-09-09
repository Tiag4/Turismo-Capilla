import React from 'react';
import { Search, Calendar, Users } from 'lucide-react';
import { CustomDatePicker } from '../../ui/CustomDatePicker';
import { CustomSelect, type Option } from '../../ui/CustomSelect';

interface AccommodationsHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  checkIn: string;
  onCheckInChange: (date: string) => void;
  checkOut: string;
  onCheckOutChange: (date: string) => void;
  guests: string;
  onGuestsChange: (g: string) => void;
  nightsCount: number | null;
}

const GUEST_OPTIONS: Option[] = [
  { value: '1', label: '1 persona' },
  { value: '2', label: '2 personas' },
  { value: '3', label: '3 personas' },
  { value: '4', label: '4 personas' },
  { value: '5', label: '5+ personas' },
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
  nightsCount,
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
      <div className="bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-3xl border border-stone-200 shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
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

        {/* Check-In */}
        <CustomDatePicker
          label="Check-in"
          value={checkIn}
          onChange={(date) => {
            onCheckInChange(date);
            if (checkOut && date >= checkOut) {
              onCheckOutChange('');
            }
          }}
          minDate={todayStr}
          placeholder="Llegada"
          icon={<Calendar className="w-3.5 h-3.5" />}
        />

        {/* Check-Out con Badge de Noches */}
        <div className="relative">
          <CustomDatePicker
            label="Check-out"
            value={checkOut}
            onChange={onCheckOutChange}
            minDate={checkIn || todayStr}
            placeholder="Salida"
            icon={<Calendar className="w-3.5 h-3.5" />}
          />
          {nightsCount !== null && (
            <span className="absolute top-2.5 right-3 bg-terracotta-100 text-terracotta-800 border border-terracotta-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full pointer-events-none select-none">
              {nightsCount} {nightsCount === 1 ? 'noche' : 'noches'}
            </span>
          )}
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
