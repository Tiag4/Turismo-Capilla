import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomSelect, type Option } from '../ui/CustomSelect';
import { DateRangePicker } from '../ui/DateRangePicker';
import { GuestsPicker, type GuestsSelection } from '../ui/GuestsPicker';

const CATEGORY_OPTIONS: Option[] = [
  { value: 'alojamientos', label: 'Alojamientos & Cabañas', description: '12 establecimientos habilitados' },
  { value: 'paseos', label: 'Paseos & Trekking', description: 'Senderos del Uritorco y balnearios' },
  { value: 'patrimonio', label: 'Patrimonio & Casonas', description: 'Circuito histórico de casonas' },
];

export const HeroSearchBar: React.FC = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState('alojamientos');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestsSelection, setGuestsSelection] = useState<GuestsSelection>({
    adults: 2,
    childrenCount: 0,
    childAges: [],
    rooms: 1,
  });

  const todayStr = new Date().toISOString().split('T')[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (category === 'paseos') {
      navigate('/atractivos');
      return;
    }
    if (category === 'patrimonio') {
      navigate('/atractivos/casonas');
      return;
    }

    const params = new URLSearchParams();
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    
    const totalGuests = guestsSelection.adults + (guestsSelection.childrenCount ?? 0);
    params.set('guests', String(totalGuests));
    params.set('adults', String(guestsSelection.adults));
    if ((guestsSelection.childrenCount ?? 0) > 0) {
      params.set('children', String(guestsSelection.childrenCount));
    }
    if ((guestsSelection.rooms ?? 1) > 1) {
      params.set('rooms', String(guestsSelection.rooms));
    }

    const query = params.toString();
    navigate(query ? `/alojamientos?${query}` : '/alojamientos');
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-5 sm:p-6 border border-stone-200/90 max-w-6xl mx-auto text-stone-900">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.25fr_2fr_1.1fr_auto] gap-3.5 items-center">
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

          {/* Rango de Fechas Inteligente (Ingreso & Egreso) */}
          <div className="sm:col-span-2 lg:col-span-1">
            <DateRangePicker
              checkIn={checkIn}
              checkOut={checkOut}
              onCheckInChange={setCheckIn}
              onCheckOutChange={setCheckOut}
              minDate={todayStr}
              checkInLabel="Ingreso"
              checkOutLabel="Egreso"
              checkInPlaceholder="Seleccionar"
              checkOutPlaceholder="Seleccionar"
            />
          </div>

          {/* Selector de Huéspedes / Viajeros Interactivo */}
          <GuestsPicker
            label="Viajeros"
            value={guestsSelection}
            onChange={setGuestsSelection}
            variant="search"
            showRooms={true}
            showChildAges={true}
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
            href="/alojamientos?amenity=desayuno"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-800 font-semibold transition-colors border border-stone-300"
          >
            Con desayuno
          </a>
          <a
            href="/atractivos/uritorco"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-800 font-semibold transition-colors border border-stone-300"
          >
            Guías Uritorco
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
