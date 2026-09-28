import React from 'react';
import { BookingInquiryContainer } from '../components/booking-inquiry/BookingInquiryContainer';

export const BookingInquiryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-sand-50 text-sand-900 py-8 sm:py-12">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8">
        {/* Encabezado Institucional Limpio */}
        <div className="max-w-4xl mx-auto text-center space-y-2 print:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-uritorco-700 block">
            Portal Oficial del Turista · Consulta de Vouchers
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-sand-950 tracking-tight">
            Mis Reservas en Capilla del Monte
          </h1>
          <p className="text-sand-600 text-sm sm:text-base max-w-xl mx-auto">
            Accedé a tu voucher oficial, datos de contacto directo del anfitrión y comprobante de estadía garantizada.
          </p>
        </div>

        <BookingInquiryContainer />
      </div>
    </div>
  );
};
