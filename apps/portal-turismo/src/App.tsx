import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PortalFeedbackProvider } from './context/PortalFeedbackContext';
import { AppLayout } from './components/layout/AppLayout';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { AccommodationsPage } from './pages/AccommodationsPage';
import { AccommodationDetailPage } from './pages/AccommodationDetailPage';
import { AttractionsPage } from './pages/AttractionsPage';
import { AttractionDetailPage } from './pages/AttractionDetailPage';
import { AstrotourismPage } from './pages/AstrotourismPage';
import { MobilityGuidePage } from './pages/MobilityGuidePage';
import { EmergencyPage } from './pages/EmergencyPage';

import { BookingInquiryPage } from './pages/BookingInquiryPage';
import { AccommodationBookingWizardPage } from './pages/AccommodationBookingWizardPage';
import { ReviewSubmissionPage } from './pages/ReviewSubmissionPage';

export const App: React.FC = () => {
  return (
    <PortalFeedbackProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="alojamientos" element={<AccommodationsPage />} />
            <Route path="alojamientos/:id" element={<AccommodationDetailPage />} />
            <Route path="alojamientos/:id/reservar" element={<AccommodationBookingWizardPage />} />
            <Route path="atractivos" element={<AttractionsPage />} />
            <Route path="atractivos/:id" element={<AttractionDetailPage />} />
            <Route path="circuitos" element={<Navigate to="/atractivos?modo=circuitos" replace />} />
            <Route path="como-llegar" element={<MobilityGuidePage />} />
            <Route path="emergencias" element={<EmergencyPage />} />
            <Route path="astroturismo" element={<AstrotourismPage />} />
            <Route path="reservas/consulta" element={<BookingInquiryPage />} />
            <Route path="resenas/nueva" element={<ReviewSubmissionPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PortalFeedbackProvider>
  );
};
