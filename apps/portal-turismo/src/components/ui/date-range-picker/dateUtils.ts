export const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export const MONTH_SHORT_NAMES = [
  'ene.',
  'feb.',
  'mar.',
  'abr.',
  'may.',
  'jun.',
  'jul.',
  'ago.',
  'sep.',
  'oct.',
  'nov.',
  'dic.',
];

export const WEEKDAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export function parseISODate(dateStr: string): { year: number; month: number; day: number } | null {
  if (!dateStr) return null;
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  return { year: parts[0], month: parts[1] - 1, day: parts[2] };
}

export function toISODateString(year: number, monthIndex: number, day: number): string {
  const y = String(year);
  const m = String(monthIndex + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatShortDate(dateStr: string): string {
  const parsed = parseISODate(dateStr);
  if (!parsed) return '';
  const d = String(parsed.day).padStart(2, '0');
  const m = String(parsed.month + 1).padStart(2, '0');
  return `${d}/${m}/${parsed.year}`;
}

export function formatHumanDate(dateStr: string): string {
  const parsed = parseISODate(dateStr);
  if (!parsed) return '';
  return `${parsed.day} de ${MONTH_SHORT_NAMES[parsed.month]} de ${parsed.year}`;
}

export function formatHumanRange(checkIn: string, checkOut: string): string {
  if (!checkIn && !checkOut) return 'Agregá tus fechas de viaje para ver precios';
  if (checkIn && !checkOut) return `Llegada: ${formatHumanDate(checkIn)} · Seleccioná salida`;
  if (checkIn && checkOut) {
    return `${formatHumanDate(checkIn)} – ${formatHumanDate(checkOut)}`;
  }
  return '';
}

export function calculateNights(checkIn: string, checkOut: string): number | null {
  if (!checkIn || !checkOut) return null;
  const p1 = parseISODate(checkIn);
  const p2 = parseISODate(checkOut);
  if (!p1 || !p2) return null;

  const d1 = new Date(p1.year, p1.month, p1.day).getTime();
  const d2 = new Date(p2.year, p2.month, p2.day).getTime();
  const diffTime = d2 - d1;
  const days = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return days > 0 ? days : null;
}

export function getDaysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

/**
 * Returns 0 for Monday ... 6 for Sunday
 */
export function getFirstWeekdayIndex(year: number, monthIndex: number): number {
  const day = new Date(year, monthIndex, 1).getDay(); // 0 is Sunday, 1 is Monday ...
  return (day + 6) % 7;
}

export function getTodayISOString(): string {
  const now = new Date();
  return toISODateString(now.getFullYear(), now.getMonth(), now.getDate());
}
