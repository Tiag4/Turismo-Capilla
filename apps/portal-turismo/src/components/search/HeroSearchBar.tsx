import React, { useState, useMemo } from 'react';
import { CustomSelect, type Option } from '../ui/CustomSelect';
import { CustomDatePicker } from '../ui/CustomDatePicker';

const CATEGORY_OPTIONS: Option[] = [
  { value: 'alojamientos', label: 'Alojamientos & Cabañas', description: '12 establecimientos habilitados' },
  { value: 'paseos', label: 'Paseos & Trekking', description: 'Senderos del Uritorco y balnearios' },
  { value: 'gastronomia', label: 'Gastronomía Serrana', description: 'Restaurantes y casas de té' },
];

const GUEST_OPTIONS: Option[] = [
  { value: '2', label: '2 adultos · 1 cabaña', description: 'Ideal para parejas' },
  { value: '1', label: '1 adulto · 1 cabaña', description: 'Viajero individual' },
  { value: '3', label: '3 adultos · 1 cabaña', description: 'Habitación o cabaña triple' },
  { value: '4', label: 'Familia (4 personas)', description: 'Cabaña de 2 dormitorios' },
  { value: '5', label: 'Grupo (5+ personas)', description: 'Cabaña grande o casa de campo' },
];

export const HeroSearchBar: React.FC = () => {
  const [category, setCategory] = useState('alojamientos');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');

  const todayStr = new Date().toISOString().split('T')[0];

  // Gestalt & Nielsen #1: Visibility of system status (calcular noches dinámicamente)
  const nightsCount = useMemo(() => {
    if (!checkIn || !checkOut) return null;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diff = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : null;
  }, [checkIn, checkOut]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (category === 'paseos') {
      window.location.href = '/atractivos';
      return;
    }

    const params = new URLSearchParams();
    if (category && category !== 'alojamientos') params.set('category', category);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', guests);

    const query = params.toString();
    window.location.href = query ? `/alojamientos?${query}` : '/alojamientos';
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-5 sm:p-6 border border-stone-200/90 max-w-6xl mx-auto text-stone-900">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr_auto] gap-3.5 items-center">
          {/* Categoría Custom */}
          <CustomSelect
            label="¿Qué estás buscando?"
            value={category}
            onChange={setCategory}
            options={CATEGORY_OPTIONS}
            icon={
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
            }
          />

          {/* Check-In Custom */}
          <CustomDatePicker
            label="Check-in"
            value={checkIn}
            onChange={(date) => {
              setCheckIn(date);
              if (checkOut && date >= checkOut) {
                setCheckOut('');
              }
            }}
            minDate={todayStr}
            placeholder="Seleccionar"
            icon={
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
            }
          />

          {/* Check-Out Custom con indicador visual de noches (Steve Krug & Nielsen #1) */}
          <div className="relative">
            <CustomDatePicker
              label="Check-out"
              value={checkOut}
              onChange={setCheckOut}
              minDate={checkIn || todayStr}
              placeholder="Seleccionar"
              icon={
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" />
                  <path d="m9 11 3 3L22 4" />
                </svg>
              }
            />
            {nightsCount !== null && (
              <span className="absolute top-2.5 right-3 bg-terracotta-100 text-terracotta-800 border border-terracotta-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full pointer-events-none select-none">
                {nightsCount} {nightsCount === 1 ? 'noche' : 'noches'}
              </span>
            )}
          </div>

          {/* Viajeros Custom */}
          <CustomSelect
            label="Viajeros"
            value={guests}
            onChange={setGuests}
            options={GUEST_OPTIONS}
            icon={
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
          />

          {/* Botón Buscar (Ley de Fitts: Gran objetivo táctil y visual) */}
          <button
            type="submit"
            className="w-full lg:w-auto h-[58px] px-8 rounded-2xl bg-[#0c261a] hover:bg-[#153e2b] active:bg-[#071911] text-white font-display font-bold text-base flex items-center justify-center gap-2.5 shadow-lg shadow-[#0c261a]/25 transition-all cursor-pointer select-none"
          >
            <svg className="w-5 h-5 text-sand-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <span>Buscar</span>
          </button>
        </div>

        {/* Filtros Frecuentes al pie con alto contraste */}
        <div className="border-t border-stone-200 pt-3.5 flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          <span className="font-bold text-stone-700 text-[11px] uppercase tracking-wider select-none">
            Filtros frecuentes:
          </span>
          <a
            href="/alojamientos?petFriendly=true"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-800 font-semibold transition-colors border border-stone-300"
          >
            Pet-friendly
          </a>
          <a
            href="/alojamientos?amenity=pileta-climatizada"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-800 font-semibold transition-colors border border-stone-300"
          >
            Con piscina climatizada
          </a>
          <a
            href="/atractivos/uritorco"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-800 font-semibold transition-colors border border-stone-300"
          >
            Guías Uritorco
          </a>
          <a
            href="/atractivos/el-zapato"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-800 font-semibold transition-colors border border-stone-300"
          >
            Paseo El Zapato
          </a>
          <a
            href="/alojamientos?zone=falda-del-uritorco"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-800 font-semibold transition-colors border border-stone-300"
          >
            Falda del cerro
          </a>
        </div>
      </form>
    </div>
  );
};
