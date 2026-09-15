import React from 'react';
import { Info, CheckCircle2, ChevronRight, Clock } from 'lucide-react';
import type { AccommodationDetailData } from '../../accommodations/detail/types';
import type { UseBookingWizardReturn } from '../hooks/useBookingWizard';
import { AccommodationRoomTypeCard } from '../../accommodations/detail/components/AccommodationRoomTypeCard';
import { CustomSelect, type Option } from '../../ui/CustomSelect';

interface BookingWizardStep2FieldsProps {
  data: AccommodationDetailData;
  wizard: UseBookingWizardReturn;
}

const ARRIVAL_OPTIONS: Option[] = [
  { value: 'No lo sé aún', label: 'No lo sé aún' },
  { value: '14:00 - 15:00', label: '14:00 - 15:00' },
  { value: '15:00 - 16:00', label: '15:00 - 16:00' },
  { value: '16:00 - 17:00', label: '16:00 - 17:00' },
  { value: '17:00 - 18:00', label: '17:00 - 18:00' },
  { value: '18:00 - 19:00', label: '18:00 - 19:00' },
  { value: '19:00 - 20:00', label: '19:00 - 20:00' },
  { value: '20:00 - 21:00', label: '20:00 - 21:00' },
];

export const BookingWizardStep2Fields: React.FC<BookingWizardStep2FieldsProps> = ({ data, wizard }) => {
  const { form, updateField, errors, goToStep3 } = wizard;

  return (
    <div className="space-y-5 text-stone-800 text-xs sm:text-sm">
      {/* Banner de progreso */}
      <div className="bg-sand-100 border border-sand-200 rounded-xl p-3 flex items-center gap-2.5 text-stone-700 font-medium">
        <Info className="w-4 h-4 text-terracotta-600 shrink-0" />
        <span>Completá los campos obligatorios (*) para continuar con tu reserva directa.</span>
      </div>

      {/* Bloque: Introduce tus datos */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-4 shadow-xs">
        <h3 className="font-display font-extrabold text-base text-stone-900 border-b border-stone-100 pb-3">Tus datos personales</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Nombre *</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-xl font-medium focus:outline-hidden ${errors.firstName ? 'border-red-500 bg-red-50/30' : 'border-stone-300'}`}
              placeholder="Tu nombre"
            />
            {errors.firstName && <span className="text-[11px] text-red-600 block mt-0.5">{errors.firstName}</span>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Apellido *</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-xl font-medium focus:outline-hidden ${errors.lastName ? 'border-red-500 bg-red-50/30' : 'border-stone-300'}`}
              placeholder="Tu apellido"
            />
            {errors.lastName && <span className="text-[11px] text-red-600 block mt-0.5">{errors.lastName}</span>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">E-mail *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-xl font-medium focus:outline-hidden ${errors.email ? 'border-red-500 bg-red-50/30' : 'border-stone-300'}`}
            placeholder="ejemplo@correo.com"
          />
          {errors.email && <span className="text-[11px] text-red-600 block mt-0.5">{errors.email}</span>}
          <span className="text-[11px] text-stone-500 mt-1 block">El voucher y confirmación se enviarán a esta dirección.</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">País / Región *</label>
            <input
              type="text"
              value={form.country}
              onChange={(e) => updateField('country', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-xl font-medium focus:outline-hidden"
              placeholder="Argentina"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Teléfono / WhatsApp *</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className={`w-full px-3 py-2 border rounded-xl font-medium focus:outline-hidden ${errors.phone ? 'border-red-500 bg-red-50/30' : 'border-stone-300'}`}
              placeholder="+54 9 351 123 4567"
            />
            {errors.phone && <span className="text-[11px] text-red-600 block mt-0.5">{errors.phone}</span>}
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={form.wantsWhatsappUpdates}
            onChange={(e) => updateField('wantsWhatsappUpdates', e.target.checked)}
            className="rounded border-stone-300 text-terracotta-600 focus:ring-terracotta-500 w-4 h-4 cursor-pointer"
          />
          <span className="text-xs font-semibold text-stone-700">Recibir confirmación digital por WhatsApp</span>
        </label>
      </div>

      {/* Bloque: Información útil */}
      <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 space-y-2 text-xs">
        <h4 className="font-display font-bold text-stone-900 text-sm">Información útil de tu reserva</h4>
        <ul className="space-y-1.5 text-stone-700">
          <li className="flex items-center gap-2 font-medium"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" /> No se necesita tarjeta de crédito para iniciar la solicitud.</li>
          <li className="flex items-center gap-2 font-medium"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" /> Tendrás la unidad completa reservada para tu grupo.</li>
          <li className="flex items-center gap-2 font-medium"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" /> Trato directo con prestadores locales adheridos al Municipio.</li>
        </ul>
      </div>

      {/* Ficha técnica del tipo de alojamiento integrada al sistema */}
      {data.unitDetails && <AccommodationRoomTypeCard unitDetails={data.unitDetails} />}

      {/* Hora de llegada con CustomSelect del sistema */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3.5 shadow-xs">
        <h4 className="font-display font-bold text-sm text-stone-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-stone-500" /> Tu hora de llegada aproximada
        </h4>
        <p className="text-xs text-stone-500">Podés hacer el check-in entre las 14:00 y las 21:00 hs.</p>
        <div className="w-full sm:w-72">
          <CustomSelect
            variant="compact"
            label="Hora de llegada"
            value={form.estimatedArrival}
            onChange={(val) => updateField('estimatedArrival', val)}
            options={ARRIVAL_OPTIONS}
            placeholder="Seleccionar horario..."
          />
        </div>

        <div className="pt-3 border-t border-stone-100">
          <label className="block text-xs font-semibold text-stone-700 mb-1">Peticiones especiales (opcional)</label>
          <textarea
            value={form.specialRequests}
            onChange={(e) => updateField('specialRequests', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-stone-300 rounded-xl font-medium text-xs focus:outline-hidden"
            placeholder="¿Viajás con mascotas? ¿Requerís cuna para bebé o indicaciones de acceso?"
          />
        </div>
      </div>

      {/* Botón Siguiente con espaciado amplio y color de marca */}
      <div className="flex justify-end pt-4 pb-2">
        <button
          type="button"
          onClick={goToStep3}
          style={{ backgroundColor: '#C95627', color: '#ffffff' }}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-display font-bold text-sm shadow-md hover:brightness-95 active:brightness-90 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Siguiente: últimos datos</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
