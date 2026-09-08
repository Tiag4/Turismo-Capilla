import React, { useState } from 'react';
import { ShieldCheck, Coins, Lock, ChevronLeft, Tag } from 'lucide-react';
import type { AccommodationDetailData } from '../../accommodations/detail/types';
import type { UseBookingWizardReturn } from '../hooks/useBookingWizard';

interface BookingWizardStep3ConfirmProps {
  data: AccommodationDetailData;
  wizard: UseBookingWizardReturn;
}

export const BookingWizardStep3Confirm: React.FC<BookingWizardStep3ConfirmProps> = ({ data, wizard }) => {
  const { form, updateField, errors, completeBooking, isSubmitting, goToStep2, applyPromoCode } = wizard;
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleApplyPromo = () => {
    const res = applyPromoCode();
    setPromoMessage({ text: res.msg, isError: !res.success });
  };

  return (
    <div className="space-y-4 text-stone-800 text-xs sm:text-sm">
      {/* Bloque: No se necesita tarjeta de crédito */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-3 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <h3 className="font-display font-black text-base sm:text-lg text-stone-900">
              No se necesita tarjeta de crédito
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Tu estadía la gestionará <strong className="text-stone-900">{data.title}</strong> directamente en Capilla del Monte.
              No necesitás ingresar datos bancarios ni números de tarjeta para confirmar tu solicitud oficial.
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 text-amber-600">
            <Coins className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Resumen de contacto ingresado */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
          <h4 className="font-display font-bold text-sm text-stone-900">Datos de contacto</h4>
          <button
            type="button"
            onClick={goToStep2}
            className="text-blue-600 hover:text-blue-800 font-semibold text-xs inline-flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Modificar
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700 font-medium">
          <div><span className="text-stone-400 block text-[10px] uppercase">Titular</span> {form.firstName} {form.lastName}</div>
          <div><span className="text-stone-400 block text-[10px] uppercase">E-mail</span> {form.email}</div>
          <div><span className="text-stone-400 block text-[10px] uppercase">Teléfono</span> {form.phone}</div>
          <div><span className="text-stone-400 block text-[10px] uppercase">Llegada estimada</span> {form.estimatedArrival}</div>
        </div>
      </div>

      {/* Bloque: Código Promocional */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3 shadow-xs">
        <h4 className="font-display font-bold text-sm text-stone-900 flex items-center gap-2">
          <Tag className="w-4 h-4 text-stone-500" /> ¿Tenés un código promocional?
        </h4>
        <div className="flex gap-2 max-w-sm">
          <input
            type="text"
            value={form.promoCode}
            onChange={(e) => updateField('promoCode', e.target.value)}
            placeholder="Ej: CAPILLA10"
            className="flex-1 px-3 py-2 border border-stone-300 rounded-xl uppercase font-bold text-xs focus:outline-hidden"
          />
          <button
            type="button"
            onClick={handleApplyPromo}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors cursor-pointer"
          >
            Aplicar
          </button>
        </div>
        {promoMessage && (
          <p className={`text-xs font-semibold ${promoMessage.isError ? 'text-red-600' : 'text-emerald-700'}`}>
            {promoMessage.text}
          </p>
        )}
      </div>

      {/* Términos y Botón Final */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-4 shadow-xs">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={form.acceptedTerms}
            onChange={(e) => updateField('acceptedTerms', e.target.checked)}
            className="rounded border-stone-300 text-blue-600 focus:ring-blue-500 w-4 h-4 mt-0.5 cursor-pointer"
          />
          <span className="text-xs text-stone-600 leading-relaxed font-medium">
            Acepto las normas de convivencia serrana, las políticas de cancelación del anfitrión y los términos del portal oficial de Turismo Capilla del Monte.
          </span>
        </label>
        {errors.terms && <p className="text-xs text-red-600 font-semibold">{errors.terms}</p>}

        <button
          type="button"
          onClick={completeBooking}
          disabled={isSubmitting || !form.acceptedTerms}
          style={{ backgroundColor: '#006ce4', color: '#ffffff' }}
          className="w-full py-4 px-6 rounded-xl font-display font-bold text-base shadow-md hover:brightness-95 active:brightness-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Lock className="w-4 h-4" />
          <span>{isSubmitting ? 'Confirmando solicitud...' : 'Completa la reserva'}</span>
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 text-center">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Contacto oficial directo • Sin comisiones de intermediarios</span>
        </div>
      </div>
    </div>
  );
};
