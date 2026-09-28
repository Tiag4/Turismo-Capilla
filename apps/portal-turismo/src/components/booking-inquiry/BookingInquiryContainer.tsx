import React from 'react';
import { useBookingInquiry } from './hooks/useBookingInquiry';
import { BookingInquirySearchForm } from './components/BookingInquirySearchForm';
import { BookingVoucherCard } from './components/BookingVoucherCard';
import { BookingInquiryEmptyState } from './components/BookingInquiryEmptyState';

export const BookingInquiryContainer: React.FC = () => {
  const {
    code,
    email,
    handleCodeChange,
    handleEmailChange,
    handleSearch,
    selectDemoCode,
    printVoucher,
    voucher,
    isLoading,
    error,
    hasSearched,
  } = useBookingInquiry();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Formulario de Búsqueda de Voucher */}
      <div className="print:hidden">
        <BookingInquirySearchForm
          code={code}
          email={email}
          onCodeChange={handleCodeChange}
          onEmailChange={handleEmailChange}
          onSubmit={handleSearch}
          onSelectDemoCode={selectDemoCode}
          isLoading={isLoading}
          error={error}
        />
      </div>

      {/* Visualización del Voucher Oficial */}
      {voucher ? (
        <BookingVoucherCard voucher={voucher} onPrint={printVoucher} />
      ) : (
        !hasSearched && <BookingInquiryEmptyState />
      )}
    </div>
  );
};
