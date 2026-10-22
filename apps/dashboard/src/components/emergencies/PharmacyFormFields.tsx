import React from 'react';
import { MapPin, Clock, Phone, Calendar } from 'lucide-react';
import type { usePharmacyForm } from './usePharmacyForm';

interface PharmacyFormFieldsProps {
  form: ReturnType<typeof usePharmacyForm>;
}

export const PharmacyFormFields: React.FC<PharmacyFormFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-4 text-xs">
      <div>
        <label className="block font-bold text-sand-700 mb-1">Nombre del Establecimiento *</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => form.setName(e.target.value)}
          placeholder="Ej: Farmacia Pasteur"
          className="w-full px-3 py-2 text-sm rounded-xl border border-sand-300 focus:border-terracotta-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block font-bold text-sand-700 mb-1">Dirección / Zona *</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-sand-400 absolute left-3 top-2.5" />
            <input
              type="text"
              required
              value={form.address}
              onChange={(e) => form.setAddress(e.target.value)}
              placeholder="Ej: Diagonal Bs As 45"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-sand-300 focus:border-terracotta-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-sand-700 mb-1">Horario Habitual / Guardia *</label>
          <div className="relative">
            <Clock className="w-4 h-4 text-sand-400 absolute left-3 top-2.5" />
            <input
              type="text"
              required
              value={form.dutyHours}
              onChange={(e) => form.setDutyHours(e.target.value)}
              placeholder="Ej: Guardia 24 Horas"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-sand-300 focus:border-terracotta-500 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block font-bold text-sand-700 mb-1">Teléfono Directo *</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-sand-400 absolute left-3 top-2.5" />
            <input
              type="text"
              required
              value={form.phone}
              onChange={(e) => form.setPhone(e.target.value)}
              placeholder="+54 3548 48-1250"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-sand-300 focus:border-terracotta-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-sand-700 mb-1">WhatsApp (Opcional)</label>
          <input
            type="text"
            value={form.whatsapp}
            onChange={(e) => form.setWhatsapp(e.target.value)}
            placeholder="+54 9 3548 123456"
            className="w-full px-3 py-2 text-sm rounded-xl border border-sand-300 focus:border-terracotta-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block font-bold text-sand-700 mb-1">Vigencia Turno Desde</label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-sand-400 absolute left-3 top-2.5" />
            <input
              type="date"
              value={form.validFrom}
              onChange={(e) => form.setValidFrom(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-sand-300 focus:border-terracotta-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-sand-700 mb-1">Vigencia Turno Hasta</label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-sand-400 absolute left-3 top-2.5" />
            <input
              type="date"
              value={form.validTo}
              onChange={(e) => form.setValidTo(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-sand-300 focus:border-terracotta-500 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input
          type="checkbox"
          id="duty-checkbox"
          checked={form.isOnDutyToday}
          onChange={(e) => form.setIsOnDutyToday(e.target.checked)}
          className="w-4 h-4 text-emerald-700 rounded border-sand-300 focus:ring-emerald-700"
        />
        <label htmlFor="duty-checkbox" className="font-bold text-sand-800 cursor-pointer">
          Designar como Farmacia de Turno Hoy (desmarcará las demás)
        </label>
      </div>

      <div>
        <label className="block font-bold text-sand-700 mb-1">Avisos o Indicaciones Nocturnas</label>
        <input
          type="text"
          value={form.notes}
          onChange={(e) => form.setNotes(e.target.value)}
          placeholder="Ej: Timbre de noche sobre calle lateral..."
          className="w-full px-3 py-2 text-sm rounded-xl border border-sand-300 focus:border-terracotta-500 outline-none"
        />
      </div>
    </div>
  );
};
