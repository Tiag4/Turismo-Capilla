export type OriginId = 'cordoba' | 'buenos-aires' | 'cuyo' | 'traslasierra';

export interface TollDetail {
  name: string;
  road: string;
  operator: string;
  estimatedFee: string;
  paymentMethods: string[];
  notes?: string;
}

export interface RouteOption {
  id: string;
  name: string;
  distanceKm: number;
  estimatedTime: string;
  recommended: boolean;
  roads: string[];
  description: string;
  highlights: string[];
  tolls: TollDetail[];
  scenicQuality: 'Panorámica de altura' | 'Autovía rápida' | 'Camino serrano';
  precautions?: string;
}

export interface OriginCategory {
  id: OriginId;
  label: string;
  badge: string;
  summary: string;
  routes: RouteOption[];
}

export interface TrainScheduleRow {
  serviceId: string;
  departureStation: string;
  departureTime: string;
  arrivalStation: string;
  arrivalTime: string;
  duration: string;
  days: string;
  type: 'Servicio Regular' | 'Servicio Turístico Feriados';
}

export interface MobilityPoint {
  id: string;
  title: string;
  category: 'tren' | 'terminal' | 'peaje' | 'ruta';
  lat: number;
  lng: number;
  description: string;
  address?: string;
  badgeText: string;
  routeOrigin?: string;
}
