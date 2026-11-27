import React from 'react';
import { Input } from '../ui/Input.tsx';
import type { usePharmacyForm } from './usePharmacyForm';

interface PharmacyFormFieldsProps {
  form: ReturnType<typeof usePharmacyForm>;
}

export const PharmacyFormFields: React.FC<PharmacyFormFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-4 text-xs">
      <Input
        label="Nombre del Establecimiento *"
        required
        value={form.name}
        onChange={(e) => form.setName(e.target.value)}
        placeholder="Ej: Farmacia Pasteur"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Dirección / Zona *"
          required
          value={form.address}
          onChange={(e) => form.setAddress(e.target.value)}
          placeholder="Ej: Diagonal Bs As 45"
        />

        <Input
          label="Horario Habitual / Guardia *"
          required
          value={form.dutyHours}
          onChange={(e) => form.setDutyHours(e.target.value)}
          placeholder="Ej: Guardia 24 Horas"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Teléfono Directo *"
          required
          value={form.phone}
          onChange={(e) => form.setPhone(e.target.value)}
          placeholder="+54 3548 48-1250"
        />

        <Input
          label="WhatsApp (Opcional)"
          value={form.whatsapp}
          onChange={(e) => form.setWhatsapp(e.target.value)}
          placeholder="+54 9 3548 123456"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Vigencia Turno Desde"
          type="date"
          value={form.validFrom}
          onChange={(e) => form.setValidFrom(e.target.value)}
        />

        <Input
          label="Vigencia Turno Hasta"
          type="date"
          value={form.validTo}
          onChange={(e) => form.setValidTo(e.target.value)}
        />
      </div>

      <div className="pt-2">
        <label
          htmlFor="duty-checkbox"
          className="flex items-center gap-3 p-3 rounded-xl border border-[var(--color-sand-200)] bg-[var(--color-sand-50)]/50 cursor-pointer hover:bg-[var(--color-sand-50)] transition-colors"
        >
          <input
            type="checkbox"
            id="duty-checkbox"
            checked={form.isOnDutyToday}
            onChange={(e) => form.setIsOnDutyToday(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-700 accent-emerald-700 cursor-pointer"
          />
          <div className="flex flex-col">
            <span className="font-bold text-sm text-[var(--color-sand-900)]">
              Designar como Farmacia de Turno Hoy
            </span>
            <span className="text-[11px] text-[var(--color-sand-500)]">
              Actualizará el estado prioritario y desmarcará automáticamente las demás farmacias.
            </span>
          </div>
        </label>
      </div>

      <Input
        label="Avisos o Indicaciones Nocturnas"
        value={form.notes}
        onChange={(e) => form.setNotes(e.target.value)}
        placeholder="Ej: Timbre de noche sobre calle lateral..."
        helperText="Información clave visible para los turistas ante urgencias."
      />
    </div>
  );
};
