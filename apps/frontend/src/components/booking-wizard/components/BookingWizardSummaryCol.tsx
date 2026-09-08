import React from 'react';
import { Calendar, PawPrint, CircleParking, ShieldCheck, ChevronLeft } from 'lucide-react';
import type { AccommodationDetailData } from '../../accommodations/detail/types';
import type { UseBookingWizardReturn } from '../hooks/useBookingWizard';

interface BookingWizardSummaryColProps {
  data: AccommodationDetailData;
  wizard: UseBookingWizardReturn;
}

export const BookingWizardSummaryCol: React.FC<BookingWizardSummaryColProps> = ({ data, wizard }) => {
  const { initialParams, nightsCount, rawTotal, finalPrice, discountAmount } = wizard;
  const image = data.gallery[0] || data.imageUrl;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'A convenir';
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4 text-stone-800 text-xs sm:text-sm">
      {/* Tarjeta del Alojamiento */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="relative aspect-16/9 overflow-hidden">
          <img src={image} alt={data.title} className="w-full h-full object-cover" />
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-amber-500 text-stone-900 font-bold text-[10px] uppercase shadow-xs">
            Habilitado Oficial
          </span>
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-display font-extrabold text-base text-stone-900 leading-tight">{data.title}</h3>
          <p className="text-xs text-stone-500">{data.zone}, Capilla del Monte, Córdoba</p>
          <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-stone-600 font-medium">
            <span className="inline-flex items-center gap-1"><PawPrint className="w-3 h-3 text-emerald-600" /> Admite mascotas</span>
            <span className="inline-flex items-center gap-1"><CircleParking className="w-3 h-3 text-emerald-600" /> Parking gratis</span>
          </div>
        </div>
      </div>

      {/* Los datos de tu reserva */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3 shadow-xs">
        <h4 className="font-display font-bold text-sm text-stone-900 border-b border-stone-100 pb-2">Los datos de tu reserva</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-stone-500 font-medium block">Entrada</span>
            <span className="font-bold text-stone-900 block">{formatDate(initialParams.checkIn)}</span>
            <span className="text-[11px] text-stone-500">14:00 – 21:00</span>
          </div>
          <div>
            <span className="text-stone-500 font-medium block">Salida</span>
            <span className="font-bold text-stone-900 block">{formatDate(initialParams.checkOut)}</span>
            <span className="text-[11px] text-stone-500">10:00 – 11:00</span>
          </div>
        </div>
        <div className="pt-2 border-t border-stone-100 space-y-1 text-xs">
          <div className="font-semibold text-stone-900">
            {nightsCount} {nightsCount === 1 ? 'noche' : 'noches'} para {initialParams.adults} adultos
            {initialParams.children > 0 ? `, ${initialParams.children} niños` : ''}
          </div>
          <div className="text-stone-600 font-medium">{data.unitDetails?.title ?? 'Cabaña independiente'}</div>
          <a
            href={`/alojamientos/${data.id}`}
            className="text-blue-600 hover:text-blue-800 font-semibold text-xs inline-flex items-center gap-1 pt-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Cambiar tu selección
          </a>
        </div>
      </div>

      {/* Desglose del precio */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3 shadow-xs">
        <h4 className="font-display font-bold text-sm text-stone-900 border-b border-stone-100 pb-2">Desglose del precio</h4>
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between text-stone-600">
            <span>Precio base ({nightsCount} noches)</span>
            <span className="font-semibold">${rawTotal.toLocaleString('es-AR')}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Descuento aplicado</span>
              <span>-${discountAmount.toLocaleString('es-AR')}</span>
            </div>
          )}
          <div className="flex justify-between items-baseline pt-2 border-t border-stone-100 font-black text-stone-900">
            <span className="text-sm">Precio Total</span>
            <span className="text-lg text-terracotta-700">${finalPrice.toLocaleString('es-AR')} ARS</span>
          </div>
        </div>
        <p className="text-[10px] text-stone-500 pt-1 leading-snug">
          Incluye cargos e IVA provincial. Tarifa transparente oficial sin costos ocultos de plataformas extranjeras.
        </p>
      </div>

      {/* Calendario de pago y Cancelación */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-2.5 shadow-xs text-xs">
        <div>
          <h5 className="font-bold text-stone-900">Calendario de pago</h5>
          <p className="text-emerald-700 font-semibold text-[11px]">Sin pago por adelantado obligatorio.</p>
          <p className="text-stone-500 text-[11px]">Coordinás la seña o el pago al ingresar directamente con el anfitrión.</p>
        </div>
        <div className="pt-2 border-t border-stone-100">
          <h5 className="font-bold text-stone-900">¿Cuánto cuesta cancelar?</h5>
          <p className="text-stone-600 text-[11px] font-medium">{data.rules.cancellation}</p>
        </div>
      </div>
    </div>
  );
};
