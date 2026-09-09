import React from 'react';

interface BookingInquirySearchFormProps {
  code: string;
  email: string;
  onCodeChange: (val: string) => void;
  onEmailChange: (val: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onSelectDemoCode: (code: string) => void;
  isLoading: boolean;
  error: string | null;
}

const DEMO_CODES = ['CAP-2026-8492', 'CAP-2026-5120', 'CAP-2026-3310'];

export const BookingInquirySearchForm: React.FC<BookingInquirySearchFormProps> = ({
  code,
  email,
  onCodeChange,
  onEmailChange,
  onSubmit,
  onSelectDemoCode,
  isLoading,
  error,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-sand-200/90 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="space-y-1">
        <h2 className="font-display font-black text-xl sm:text-2xl text-sand-950 tracking-tight">
          Consultar Estado & Descargar Voucher Oficial
        </h2>
        <p className="text-sand-600 text-xs sm:text-sm">
          Ingresá el código de tu solicitud y el correo registrado para validar tu reserva y ver los datos del anfitrión.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="booking-code" className="block text-xs font-bold text-sand-800 uppercase tracking-wider">
              Código de Reserva <span className="text-terracotta-600">*</span>
            </label>
            <input
              id="booking-code"
              type="text"
              value={code}
              onChange={(e) => onCodeChange(e.target.value)}
              placeholder="CAP-2026-XXXX"
              className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 font-mono text-sm uppercase text-sand-900 placeholder-sand-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all shadow-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="booking-email" className="block text-xs font-bold text-sand-800 uppercase tracking-wider">
              Email del Titular
            </label>
            <input
              id="booking-email"
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="tu-email@ejemplo.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-sm text-sand-900 placeholder-sand-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all shadow-xs"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2">
            <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          {/* Códigos de Prueba Rápidos */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold text-sand-500">Ejemplos:</span>
            {DEMO_CODES.map((dc) => (
              <button
                key={dc}
                type="button"
                onClick={() => onSelectDemoCode(dc)}
                className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-sand-100 text-sand-700 hover:bg-sand-200 hover:text-sand-900 transition-colors cursor-pointer"
              >
                {dc}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-primary-600 hover:bg-primary-500 text-white transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Buscando...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Consultar Voucher</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
