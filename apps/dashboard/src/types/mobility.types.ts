export type OriginId = 'cordoba' | 'buenos-aires' | 'cuyo' | 'traslasierra';

export interface TollDetail {
  id?: string;
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

export interface TrainStationItem {
  name: string;
  km: string;
  main: boolean;
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

export interface TrainConfig {
  fareRange: string;
  bookingUrl: string;
  stationName: string;
  stationAddress: string;
  stationMapsUrl: string;
  alertNote?: string;
  schedules: TrainScheduleRow[];
  stations: TrainStationItem[];
}

export interface BusTerminalConfig {
  terminalAddress: string;
  terminalPhone: string;
  frequencyNote: string;
  interurbanTitle: string;
  interurbanDescription: string;
  interurbanPaymentNote: string;
  interurbanCompanies: string[];
  longDistanceTitle: string;
  longDistanceCompanies: string[];
}

export interface TransitAlertConfig {
  active: boolean;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'danger';
  updatedAt: string;
}

export interface MobilityConfig {
  version: number;
  updatedAt: string;
  transitAlert: TransitAlertConfig;
  tolls: TollDetail[];
  train: TrainConfig;
  busTerminal: BusTerminalConfig;
  originsData: OriginCategory[];
}
