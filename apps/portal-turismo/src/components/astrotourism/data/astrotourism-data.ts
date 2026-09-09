import type { NightPhase, StargazingSpot } from '../types';

export const NIGHT_PHASES: NightPhase[] = [
  {
    id: 'sunset-blue',
    timeLabel: '20:30 hs',
    hour: 20.5,
    title: 'Hora Azul & Lucero Vespertino',
    subtitle: 'El crepúsculo abraza el lomo del macizo',
    description:
      'El disco solar cae tras las Sierras Grandes y baña la cara occidental del Uritorco en tonos carmín y cobalto. Venus brilla con intensidad sobre el horizonte mientras el ojo se adapta gradualmente a la oscuridad.',
    skyColors: {
      top: '#0b1326',
      mid: '#172545',
      horizon: '#b8522c',
      glow: 'rgba(184, 82, 44, 0.4)',
    },
    visibleConstellation: 'Venus (Lucero) & Constelación de Escorpio',
    celestialEvent: 'Crepúsculo náutico y primera visibilidad estelar',
    darknessLevel: 'Transición diurna-nocturna',
    recommendedActivity: 'Instalar trípodes fotográficos y desactivar pantallas blancas para preservar la visión nocturna.',
  },
  {
    id: 'milky-way',
    timeLabel: '23:00 hs',
    hour: 23,
    title: 'Cénit de la Vía Láctea (Bortle 3)',
    subtitle: 'El río de estrellas sobre el Uritorco',
    description:
      'Cielo en oscuridad plena. El brazo espiral de nuestra galaxia cruza el cenit como una franja lechosa visible a simple vista sin instrumentos. Se aprecian cúmulos estelares y nebulosas oscuras sobre el perfil del cerro.',
    skyColors: {
      top: '#040711',
      mid: '#081020',
      horizon: '#0d172e',
      glow: 'rgba(56, 189, 248, 0.12)',
    },
    visibleConstellation: 'Centro Galáctico, Nebulosa de Carina y Sagitario',
    celestialEvent: 'Arco galáctico vertical sobre el valle',
    darknessLevel: 'Clase Bortle 3 (Cielo rural limpio, sin polución urbana)',
    recommendedActivity: 'Observación a simple vista de bólidos y paseos de contemplación con guías habilitados.',
  },
  {
    id: 'deep-night',
    timeLabel: '02:30 hs',
    hour: 26.5,
    title: 'Silencio Cósmico & Cruz del Sur',
    subtitle: 'La hora más profunda y despejada',
    description:
      'La temperatura serrana desciende al mínimo y la atmósfera se aquieta por completo (seeing óptimo). La Cruz del Sur se alinea verticalmente apuntando al polo celeste en una quietud absoluta.',
    skyColors: {
      top: '#020408',
      mid: '#050a14',
      horizon: '#080f22',
      glow: 'rgba(139, 92, 246, 0.1)',
    },
    visibleConstellation: 'Cruz del Sur, Coalsack (Saco de Carbón) y Alfa Centauri',
    celestialEvent: 'Culminación meridiana de constelaciones australes',
    darknessLevel: 'Oscuridad máxima (Magnitud límite estelar 6.8)',
    recommendedActivity: 'Astrofotografía de espacio profundo de larga exposición y senderismo nocturno guiado.',
  },
  {
    id: 'pre-dawn',
    timeLabel: '05:30 hs',
    hour: 29.5,
    title: 'Ascenso Nocturno & Amanecer',
    subtitle: 'La primera luz sobre los 1.979 metros',
    description:
      'Los montañistas del ascenso nocturno alcanzan la cruz de cumbre del Uritorco. La luz zodiacal y el resplandor pre-solar tiñen el oriente cordobés de violeta y oro, recortando las crestas serranas.',
    skyColors: {
      top: '#091024',
      mid: '#1d2142',
      horizon: '#cf632b',
      glow: 'rgba(207, 99, 43, 0.45)',
    },
    visibleConstellation: 'Orión en el horizonte oeste despidiéndose',
    celestialEvent: 'Amanecer a 1.979 msnm con mar de nubes en Punilla',
    darknessLevel: 'Crepúsculo astronómico matutino',
    recommendedActivity: 'Llegada a cumbre con guías habilitados para presenciar el amanecer de 360 grados.',
  },
];

export const STARGAZING_SPOTS: StargazingSpot[] = [
  {
    id: 'alazanes',
    title: 'Dique Los Alazanes',
    altitudeMsnm: 1400,
    bortleClass: 'Bortle 2-3',
    accessibility: 'Trekking exigente (3 hs a pie desde La Toma)',
    description:
      'El embalse de montaña a mayor altitud de Córdoba, encajonado entre quebradas de granito. Sin ninguna luminaria en 12 km a la redonda, el agua refleja el firmamento como un espejo negro.',
    features: ['Cero contaminación lumínica', 'Reflejo estelar en agua', 'Zona de campamento agreste'],
  },
  {
    id: 'terrones',
    title: 'Parque Los Terrones',
    altitudeMsnm: 1400,
    bortleClass: 'Bortle 3',
    accessibility: 'Vehicular hasta base + caminata corta',
    description:
      'Los paredones de arenisca rojiza de 100 metros de altura forman un cañón natural que bloquea las luces bajas del valle, creando un planetario a cielo abierto incomparable.',
    features: ['Siluetas geológicas milenarias', 'Acceso seguro con vehículo', 'Excelente horizonte norte y este'],
  },
  {
    id: 'pavon',
    title: 'Puesto Pavón (Falda Este)',
    altitudeMsnm: 1350,
    bortleClass: 'Bortle 3',
    accessibility: 'Trekking moderado (2 hs desde Huertas Malas)',
    description:
      'Refugio tradicional de montaña en la cara este del Uritorco. Punto neurálgico de las expediciones nocturnas y base de los talleres de astrofotografía de la región.',
    features: ['Refugio de montaña con servicios', 'Vista directa al macizo', 'Punto de partida a la cumbre'],
  },
];
