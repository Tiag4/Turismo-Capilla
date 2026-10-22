import React from 'react';
import {
  Calendar,
  Sun,
  Flame,
  CheckCircle,
  Save,
  HelpCircle,
  Home,
} from 'lucide-react';
import {
  useHostPricing,
  formatCurrencyARS,
  parseCurrencyARS,
} from '../../hooks/useHostPricing.ts';
import { Button } from '../ui/Button.tsx';
import { CustomSelect } from '../ui/CustomSelect.tsx';

const MIN_NIGHTS_OPTIONS = [
  { value: '1', label: '1 noche mínima (flexible)' },
  { value: '2', label: '2 noches mínimas' },
  { value: '3', label: '3 noches mínimas (recomendado fines de semana)' },
  { value: '4', label: '4 noches mínimas' },
  { value: '5', label: '5 noches mínimas (recomendado temporada alta)' },
  { value: '7', label: '7 noches mínimas (semana completa)' },
];

export const SeasonalRatesManager: React.FC = () => {
  const {
    accommodations,
    selectedAccommodationId,
    setSelectedAccommodationId,
    selectedAccommodation,
    isLoadingAccommodations,
    basePrice,
    setBasePrice,
    highSeasonPrice,
    setHighSeasonPrice,
    longWeekendPrice,
    setLongWeekendPrice,
    minNightsBase,
    setMinNightsBase,
    minNightsHighSeason,
    setMinNightsHighSeason,
    minNightsLongWeekend,
    setMinNightsLongWeekend,
    handleSaveScheme,
    isSaving,
    savedSuccess,
  } = useHostPricing();

  if (isLoadingAccommodations) {
    return (
      <div className="py-16 text-center text-xs text-sand-500">
        Cargando configuración tarifaria...
      </div>
    );
  }

  if (accommodations.length === 0) {
    return (
      <div className="py-16 text-center border-y border-sand-200 flex flex-col items-center gap-3">
        <Home className="w-8 h-8 text-sand-400" />
        <p className="text-sm font-semibold text-sand-900">
          No tenés cabañas registradas para tarifar.
        </p>
        <p className="text-xs text-sand-500 max-w-sm">
          Primero creá un alojamiento en la sección Mis Cabañas para poder configurar sus temporadas.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header and accommodation selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-sand-900)] font-['Outfit']">
            Tarifas y Temporadas Serranas
          </h2>
          <p className="text-xs text-[var(--color-sand-400)] font-medium mt-0.5">
            Configurá precios por noche y estadías mínimas obligatorias por temporada.
          </p>
        </div>

        {/* Accommodation Selector */}
        <div className="w-full sm:w-64">
          <CustomSelect
            value={selectedAccommodationId}
            onChange={(val) => setSelectedAccommodationId(val)}
            options={accommodations.map((acc) => ({ value: acc.id, label: acc.name }))}
          />
        </div>
      </div>

      {/* Notice callout */}
      <div className="border-l-2 border-[var(--color-terracotta-500)] pl-3.5 py-1 text-xs text-[var(--color-sand-700)] leading-relaxed">
        Las tarifas se aplican automáticamente en el motor de reservas según la fecha de ingreso del turista. 
        Las reglas de noches mínimas evitan que entren solicitudes fragmentadas que dejen días vacíos sin ocupar.
      </div>

      {/* Main Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 1. Base Rate */}
        <div className="bg-white rounded-2xl border border-[var(--color-sand-200)] p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="pb-3 border-b border-[var(--color-sand-200)]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[var(--color-sand-500)]" />
                <h3 className="text-sm font-bold text-[var(--color-sand-900)] font-['Outfit']">
                  Tarifa Base Estándar
                </h3>
              </div>
              <p className="text-[11px] text-[var(--color-sand-500)] mt-0.5">
                Días regulares de lunes a domingo
              </p>
            </div>

            <p className="text-xs text-[var(--color-sand-500)] leading-relaxed">
              Aplica en fechas fuera de temporada alta o fines de semana largos.
            </p>

            {/* Price input */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-sand-700)] block">
                Precio por Noche (ARS)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formatCurrencyARS(basePrice)}
                  onChange={(e) => setBasePrice(parseCurrencyARS(e.target.value))}
                  className="w-full rounded-xl border border-[var(--color-sand-300)] bg-white px-3.5 py-2 text-base font-bold text-[var(--color-sand-900)] font-['Outfit'] focus:outline-none focus:border-[var(--color-terracotta-500)]"
                  placeholder="$75.000"
                />
              </div>
            </div>

            {/* Min nights selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-sand-700)] block">
                Estadía Mínima Obligatoria
              </label>
              <CustomSelect
                value={String(minNightsBase)}
                onChange={(val) => setMinNightsBase(Number(val))}
                options={MIN_NIGHTS_OPTIONS}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--color-sand-100)] text-[11px] text-[var(--color-sand-500)]">
            Mínimo a cobrar: <strong className="text-[var(--color-sand-900)]">{formatCurrencyARS(basePrice * minNightsBase)}</strong> ({minNightsBase} {minNightsBase === 1 ? 'noche' : 'noches'})
          </div>
        </div>

        {/* 2. High Season Rate */}
        <div className="bg-white rounded-2xl border border-[var(--color-sand-200)] p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="pb-3 border-b border-[var(--color-sand-200)]">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-[var(--color-terracotta-500)]" />
                <h3 className="text-sm font-bold text-[var(--color-sand-900)] font-['Outfit']">
                  Temporada Alta
                </h3>
              </div>
              <p className="text-[11px] text-[var(--color-sand-500)] mt-0.5">
                Enero, Febrero y Julio
              </p>
            </div>

            <p className="text-xs text-[var(--color-sand-500)] leading-relaxed">
              Meses de mayor afluencia turística en el Valle de Punilla. Se recomienda exigir estadías extendidas.
            </p>

            {/* Price input */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-sand-700)] block">
                Precio por Noche (ARS)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formatCurrencyARS(highSeasonPrice)}
                  onChange={(e) => setHighSeasonPrice(parseCurrencyARS(e.target.value))}
                  className="w-full rounded-xl border border-[var(--color-sand-300)] bg-white px-3.5 py-2 text-base font-bold text-[var(--color-sand-900)] font-['Outfit'] focus:outline-none focus:border-[var(--color-terracotta-500)]"
                  placeholder="$110.000"
                />
              </div>
            </div>

            {/* Min nights selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-sand-700)] block">
                Estadía Mínima Obligatoria
              </label>
              <CustomSelect
                value={String(minNightsHighSeason)}
                onChange={(val) => setMinNightsHighSeason(Number(val))}
                options={MIN_NIGHTS_OPTIONS}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--color-sand-100)] text-[11px] text-[var(--color-sand-500)]">
            Mínimo a cobrar: <strong className="text-[var(--color-sand-900)]">{formatCurrencyARS(highSeasonPrice * minNightsHighSeason)}</strong> ({minNightsHighSeason} noches)
          </div>
        </div>

        {/* 3. Long Weekend Rate */}
        <div className="bg-white rounded-2xl border border-[var(--color-sand-200)] p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="pb-3 border-b border-[var(--color-sand-200)]">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-[var(--color-sand-900)] font-['Outfit']">
                  Fines de Semana Largos
                </h3>
              </div>
              <p className="text-[11px] text-[var(--color-sand-500)] mt-0.5">
                Carnaval, Semana Santa y feriados puente
              </p>
            </div>

            <p className="text-xs text-[var(--color-sand-500)] leading-relaxed">
              Feriados nacionales puente y fines de semana turísticos con alta demanda puntual.
            </p>

            {/* Price input */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-sand-700)] block">
                Precio por Noche (ARS)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formatCurrencyARS(longWeekendPrice)}
                  onChange={(e) => setLongWeekendPrice(parseCurrencyARS(e.target.value))}
                  className="w-full rounded-xl border border-[var(--color-sand-300)] bg-white px-3.5 py-2 text-base font-bold text-[var(--color-sand-900)] font-['Outfit'] focus:outline-none focus:border-[var(--color-terracotta-500)]"
                  placeholder="$95.000"
                />
              </div>
            </div>

            {/* Min nights selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-sand-700)] block">
                Estadía Mínima Obligatoria
              </label>
              <CustomSelect
                value={String(minNightsLongWeekend)}
                onChange={(val) => setMinNightsLongWeekend(Number(val))}
                options={MIN_NIGHTS_OPTIONS}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--color-sand-100)] text-[11px] text-[var(--color-sand-500)]">
            Mínimo a cobrar: <strong className="text-[var(--color-sand-900)]">{formatCurrencyARS(longWeekendPrice * minNightsLongWeekend)}</strong> ({minNightsLongWeekend} noches)
          </div>
        </div>
      </div>

      {/* Simulator / Quote Preview & Save CTA */}
      <div className="p-4 bg-white rounded-2xl border border-[var(--color-sand-200)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <HelpCircle className="w-4 h-4 text-[var(--color-sand-400)] shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-[var(--color-sand-900)] font-['Outfit']">
              Ejemplo de Cotización para {selectedAccommodation?.name || 'la cabaña'}
            </h4>
            <p className="text-[11px] text-[var(--color-sand-500)] mt-0.5">
              Estadía de 3 noches en fin de semana largo: 3 x {formatCurrencyARS(longWeekendPrice)} = <strong className="text-[var(--color-sand-900)]">{formatCurrencyARS(longWeekendPrice * 3)}</strong>
            </p>
          </div>
        </div>

        {/* Save CTA and status */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {savedSuccess && (
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-emerald-portal-600)] font-bold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl animate-in fade-in">
              <CheckCircle className="w-4 h-4" />
              <span>Esquema guardado correctamente</span>
            </div>
          )}

          <Button
            variant="terracotta"
            onClick={handleSaveScheme}
            isLoading={isSaving}
            className="w-full md:w-auto"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Tarifas de {selectedAccommodation?.name?.split(' ')[0] || 'Cabaña'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
