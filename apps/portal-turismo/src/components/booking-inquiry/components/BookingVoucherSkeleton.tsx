import React from 'react';

export const BookingVoucherSkeleton: React.FC = () => {
  return (
    <div
      role="status"
      aria-label="Cargando voucher de reserva"
      className="bg-white rounded-2xl border-2 border-sand-200 p-6 sm:p-8 shadow-xs space-y-6 animate-pulse"
    >
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sand-200" />
          <div className="space-y-1.5">
            <div className="w-48 h-5 rounded bg-sand-200" />
            <div className="w-64 h-3.5 rounded bg-sand-100" />
          </div>
        </div>
        <div className="w-36 h-6 rounded-lg bg-sand-200" />
      </div>

      {/* Alojamiento y Código */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 flex flex-col sm:flex-row items-start gap-4">
          <div className="w-full sm:w-28 h-28 rounded-xl bg-sand-200 shrink-0" />
          <div className="space-y-2.5 w-full">
            <div className="w-40 h-3.5 rounded bg-sand-200" />
            <div className="w-3/4 h-6 rounded bg-sand-200" />
            <div className="w-1/2 h-3.5 rounded bg-sand-100" />
            <div className="w-1/3 h-3 rounded bg-sand-100" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-sand-50 border border-sand-200 text-center space-y-2">
          <div className="w-24 h-3 rounded bg-sand-200 mx-auto" />
          <div className="w-32 h-6 rounded bg-sand-300 mx-auto" />
          <div className="w-28 h-3 rounded bg-sand-100 mx-auto" />
        </div>
      </div>

      {/* Fechas y Pasajeros */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-sand-50 border border-sand-200">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-1.5">
            <div className="w-12 h-3 rounded bg-sand-200" />
            <div className="w-20 h-4 rounded bg-sand-300" />
            <div className="w-16 h-3 rounded bg-sand-100" />
          </div>
        ))}
      </div>

      {/* Desglose Tarifario */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-sand-50/70 border border-sand-200">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-1.5">
            <div className="w-24 h-3 rounded bg-sand-200" />
            <div className="w-28 h-6 rounded bg-sand-300" />
          </div>
        ))}
      </div>

      {/* Datos Bancarios */}
      <div className="p-4 rounded-xl bg-sand-50 border border-sand-200 space-y-3">
        <div className="w-44 h-4 rounded bg-sand-200" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="h-10 rounded-lg bg-sand-100" />
          <div className="h-10 rounded-lg bg-sand-100" />
        </div>
      </div>
    </div>
  );
};
