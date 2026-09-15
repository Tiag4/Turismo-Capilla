import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { AccommodationsPage } from './pages/AccommodationsPage';
import { AccommodationDetailPage } from './pages/AccommodationDetailPage';
import { AttractionsPage } from './pages/AttractionsPage';
import { AttractionDetailPage } from './pages/AttractionDetailPage';
import { AstrotourismPage } from './pages/AstrotourismPage';
import { BookingInquiryPage } from './pages/BookingInquiryPage';
import { AccommodationBookingWizardPage } from './pages/AccommodationBookingWizardPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="alojamientos" element={<AccommodationsPage />} />
          <Route path="alojamientos/:id" element={<AccommodationDetailPage />} />
          <Route path="alojamientos/:id/reservar" element={<AccommodationBookingWizardPage />} />
          <Route path="atractivos" element={<AttractionsPage />} />
          <Route path="atractivos/:id" element={<AttractionDetailPage />} />
          <Route path="astroturismo" element={<AstrotourismPage />} />
          <Route path="reservas/consulta" element={<BookingInquiryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
