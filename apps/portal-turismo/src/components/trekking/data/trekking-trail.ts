import type { Checkpoint, TrailPoint } from '../types';

export const CHECKPOINTS: Checkpoint[] = [
  {
    id: 'la-toma',
    title: 'Base La Toma',
    elevationMsnm: 1000,
    distanceKm: 0.0,
    description:
      'Portal de acceso oficial al cerro. Aquí se realiza el registro obligatorio individual con guardaparques, control de calzado y verificación de reserva y ración de 2L de agua.',
    keyAdvice: 'Horario límite de ingreso general: 11:00 hs. No se permite ascenso sin calzado con suela de tracción.',
    features: ['Registro oficial y seguro', 'Puente colgante sobre Río Calabalumba', 'Punto de recarga de agua'],
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    gradientPct: 8,
  },
  {
    id: 'descanso-huella',
    title: 'Descanso de la Huella',
    elevationMsnm: 1220,
    distanceKm: 1.4,
    description:
      'Primer descanso panorámico en el faldeo oriental. Vista despejada al Dique El Cajón y al trazado fundacional de Capilla del Monte.',
    keyAdvice: 'Zona de aclimatación de pendiente. Mantené un ritmo cardíaco estable y respiración acompasada.',
    features: ['Mirador del valle', 'Bosque de molles y talas', 'Punto de señal celular intermitente'],
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    gradientPct: 15,
  },
  {
    id: 'quebrada-viento',
    title: 'Quebrada del Viento',
    elevationMsnm: 1450,
    distanceKm: 2.8,
    description:
      'Paso estrecho donde finaliza la arboleda serrana y comienzan los pastizales de altura. Se siente la aceleración de vientos del este y un descenso térmico notable.',
    keyAdvice: 'Recomendable colocarse cortaviento o primera capa térmica. Ráfagas frecuentes superiores a 35 km/h.',
    features: ['Vegetación de altura (tabaquillos)', 'Formaciones graníticas', 'Aceleración de corrientes térmicas'],
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    gradientPct: 18,
  },
  {
    id: 'refugio-pastores',
    title: 'Refugio de los Pastores',
    elevationMsnm: 1720,
    distanceKm: 4.2,
    description:
      'Antigua pirca de piedra utilizada históricamente por arrieros serranos. Es el punto de control crítico antes de encarar el tramo técnico de la cumbre.',
    keyAdvice: 'Control de seguridad: si llegás después de las 14:00 hs, debés iniciar el retorno sin continuar a la cumbre.',
    cutoffTimeNotice: '14:00 hs — Límite de avance',
    features: ['Punto de decisión técnica', 'Abrigo natural de piedra', 'Último retén antes del acarreo final'],
    imageUrl: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80',
    gradientPct: 22,
  },
  {
    id: 'cumbre-uritorco',
    title: 'Cumbre Cerro Uritorco',
    elevationMsnm: 1979,
    distanceKm: 5.8,
    description:
      'El punto más alto de las Sierras Chicas. Panorama circular a 360 grados: al oeste las Sierras Grandes y Los Gigantes, al noroeste las Salinas Grandes y al sur todo el Valle de Punilla.',
    keyAdvice: 'El descenso insume hasta 3.5 horas y suele ser más exigente para las rodillas que la subida. Iniciá la bajada antes de las 16:00 hs.',
    cutoffTimeNotice: '16:00 hs — Inicio obligatorio de descenso',
    features: ['Cruz histórica de cumbre', 'Vista panorámica de 360°', 'Punto geodésico militar'],
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=85',
    gradientPct: 25,
  },
];

export const TRAIL_ELEVATION_PROFILE: TrailPoint[] = [
  { distanceKm: 0.0, elevationMsnm: 1000 },
  { distanceKm: 0.3, elevationMsnm: 1040 },
  { distanceKm: 0.6, elevationMsnm: 1090 },
  { distanceKm: 0.9, elevationMsnm: 1145 },
  { distanceKm: 1.4, elevationMsnm: 1220 },
  { distanceKm: 1.8, elevationMsnm: 1285 },
  { distanceKm: 2.2, elevationMsnm: 1350 },
  { distanceKm: 2.5, elevationMsnm: 1405 },
  { distanceKm: 2.8, elevationMsnm: 1450 },
  { distanceKm: 3.2, elevationMsnm: 1520 },
  { distanceKm: 3.6, elevationMsnm: 1600 },
  { distanceKm: 3.9, elevationMsnm: 1665 },
  { distanceKm: 4.2, elevationMsnm: 1720 },
  { distanceKm: 4.6, elevationMsnm: 1795 },
  { distanceKm: 5.0, elevationMsnm: 1865 },
  { distanceKm: 5.4, elevationMsnm: 1925 },
  { distanceKm: 5.8, elevationMsnm: 1979 },
];
