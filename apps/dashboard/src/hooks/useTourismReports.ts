import { useState, useEffect, useCallback } from 'react';
import {
  reportsService,
  type ReportPeriod,
  type TourismReportData,
} from '../services/reports.service.ts';

export function useTourismReports() {
  const [period, setPeriod] = useState<ReportPeriod>('CURRENT_FORTNIGHT');
  const [data, setData] = useState<TourismReportData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchReport = useCallback(async (selectedPeriod: ReportPeriod) => {
    setIsLoading(true);
    try {
      const result = await reportsService.getReportData(selectedPeriod);
      setData(result);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReport(period);
  }, [fetchReport, period]);

  const exportCsv = useCallback(() => {
    if (!data) return;
    reportsService.downloadBookingsCsv(data.bookings, data.periodLabel);
  }, [data]);

  return {
    period,
    setPeriod,
    data,
    isLoading,
    exportCsv,
  };
}
