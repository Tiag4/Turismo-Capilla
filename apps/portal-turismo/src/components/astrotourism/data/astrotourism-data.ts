import type {
  AstroKeyFact,
  AstroPreparationTip,
  NightPhase,
  StargazingSpot,
} from '../types';

export const ASTRO_KEY_FACTS: AstroKeyFact[] = [
  {
    id: 'sky-quality',
    label: 'Calidad del cielo',
    value: 'Escala Bortle 2–3',
    detail: 'Cielos rurales oscuros, con la Vía Láctea visible a simple vista.',
  },
  {
    id: 'best-season',
    label: 'Temporada galáctica',
    value: 'Marzo a Octubre',
    detail: 'El centro de la Vía Láctea cruza alto sobre las sierras en noches despejadas.',
  },
  {
    id: 'altitude',
    label: 'Altitud de miradores',
    value: '1.350 a 1.979 m s. n. m.',
    detail: 'Por encima de la bruma del valle y lejos del alumbrado urbano.',
  },
  {
    id: 'modality',
    label: 'Cómo disfrutarlo',
    value: 'Libre o con guía',
    detail: 'Miradores con acceso vehicular o trekking nocturno habilitado.',
  },
];

export const NIGHT_PHASES: NightPhase[] = [
  {
    id: 'sunset-blue',
    timeLabel: '20:30 hs',
    hour: 20.5,
    title: 'Hora Azul y Lucero Vespertino',
    subtitle: 'El crepúsculo sobre las Sierras Grandes',
    description:
      'El sol cae detrás del cordón occidental y tiñe el cielo de azul profundo con un resplandor cálido en el horizonte. Es la transición ideal para llegar al mirador todavía con luz residual.',
    skyColors: {
      top: '#0b1326',
      mid: '#19294d',
      horizon: '#b8522c',
      glow: 'rgba(184, 82, 44, 0.45)',
    },
    visualState: {
      milkyWayOpacity: 0.15,
      starVisibility: 0.45,
      venusVisible: true,
      southernCrossHighlight: false,
      orionVisible: false,
      summitBeaconVisible: false,
      horizonGlowSide: 'west',
    },
    visibleConstellation: 'Venus (Lucero) y primeras estrellas de Escorpio',
    celestialEvent: 'Crepúsculo náutico y adaptación gradual de la vista',
    darknessLevel: 'Luz crepuscular residual',
    recommendedActivity:
      'Ubicarse en el mirador antes de la oscuridad total, armar trípodes y evitar pantallas blancas.',
  },
  {
    id: 'milky-way',
    timeLabel: '23:00 hs',
    hour: 23,
    title: 'Cénit de la Vía Láctea',
    subtitle: 'El arco galáctico sobre el macizo del Uritorco',
    description:
      'Con la oscuridad plena establecida, la franja de nuestra galaxia cruza el cielo de norte a sur sin necesidad de binoculares. Se distinguen cúmulos estelares y zonas oscuras de polvo interestelar.',
    skyColors: {
      top: '#040711',
      mid: '#091225',
      horizon: '#101d38',
      glow: 'rgba(148, 184, 232, 0.14)',
    },
    visualState: {
      milkyWayOpacity: 0.95,
      starVisibility: 0.9,
      venusVisible: false,
      southernCrossHighlight: true,
      orionVisible: false,
      summitBeaconVisible: false,
      horizonGlowSide: 'center',
    },
    visibleConstellation: 'Centro Galáctico, Nebulosa de Carina y Sagitario',
    celestialEvent: 'Arco de la Vía Láctea alto sobre el valle',
    darknessLevel: 'Oscuridad plena (Clase Bortle 3)',
    recommendedActivity:
      'Observación a simple vista, reconocimiento de constelaciones y fotografía de gran angular.',
  },
  {
    id: 'deep-night',
    timeLabel: '02:30 hs',
    hour: 26.5,
    title: 'Cielo Profundo y Cruz del Sur',
    subtitle: 'La hora más quieta y transparente de la madrugada',
    description:
      'El aire serrano se enfría y disminuye la turbulencia atmosférica. Las estrellas dejan de titilar tanto y la Cruz del Sur, junto con el Saco de Carbón y Alfa Centauri, se aprecian con nitidez máxima.',
    skyColors: {
      top: '#020408',
      mid: '#050a16',
      horizon: '#091124',
      glow: 'rgba(167, 139, 250, 0.1)',
    },
    visualState: {
      milkyWayOpacity: 0.75,
      starVisibility: 1,
      venusVisible: false,
      southernCrossHighlight: true,
      orionVisible: false,
      summitBeaconVisible: false,
      horizonGlowSide: 'center',
    },
    visibleConstellation: 'Cruz del Sur, Saco de Carbón y Alfa Centauri',
    celestialEvent: 'Mínima turbulencia atmosférica y visibilidad estelar límite',
    darknessLevel: 'Oscuridad máxima',
    recommendedActivity:
      'Astrofotografía de larga exposición y observación con binoculares o telescopios portátiles.',
  },
  {
    id: 'pre-dawn',
    timeLabel: '05:30 hs',
    hour: 29.5,
    title: 'Ascenso Nocturno y Amanecer',
    subtitle: 'Primeras luces sobre la cumbre de 1.979 metros',
    description:
      'Quienes realizan el ascenso nocturno guiado llegan a la cima antes del alba. Un resplandor dorado y violáceo anticipa la salida del sol por el este mientras las constelaciones de madrugada se despiden.',
    skyColors: {
      top: '#0a1228',
      mid: '#20264a',
      horizon: '#cf632b',
      glow: 'rgba(207, 99, 43, 0.45)',
    },
    visualState: {
      milkyWayOpacity: 0.2,
      starVisibility: 0.5,
      venusVisible: false,
      southernCrossHighlight: false,
      orionVisible: true,
      summitBeaconVisible: true,
      horizonGlowSide: 'east',
    },
    visibleConstellation: 'Orión descendiendo hacia el horizonte oeste',
    celestialEvent: 'Crepúsculo matutino y vista panorámica sobre el Valle de Punilla',
    darknessLevel: 'Crepúsculo astronómico matutino',
    recommendedActivity:
      'Llegada a cumbre únicamente con guías de montaña habilitados y abrigo cortaviento.',
  },
];

export const STARGAZING_SPOTS: StargazingSpot[] = [
  {
    id: 'terrones',
    title: 'Parque Los Terrones',
    altitudeMsnm: 1400,
    bortleClass: 'Bortle 3',
    accessibility: 'Vehicular hasta base y caminata corta',
    idealFor: 'Ideal para primera visita y astrofotografía cómoda',
    description:
      'Los paredones de arenisca rojiza bloquean naturalmente las luces bajas de la ruta y del valle, generando un anfiteatro oscuro con horizonte despejado al norte y al este.',
    features: [
      'Acceso seguro en vehículo hasta el sector de base',
      'Siluetas geológicas ideales para encuadres nocturnos',
      'Horizonte amplio sin obstáculos urbanos cercanos',
    ],
  },
  {
    id: 'pavon',
    title: 'Puesto Pavón (Falda Este)',
    altitudeMsnm: 1350,
    bortleClass: 'Bortle 3',
    accessibility: 'Trekking moderado (2 hs desde Huertas Malas)',
    idealFor: 'Ideal para pernocte serrano y salidas grupales',
    description:
      'Refugio tradicional de montaña sobre la ladera este del Cerro Uritorco. Funciona como punto de encuentro habitual para talleres de astrofotografía y caminatas nocturnas.',
    features: [
      'Refugio de montaña con servicios básicos coordinados',
      'Vista frontal al macizo del Uritorco',
      'Punto intermedio en travesías nocturnas hacia la cumbre',
    ],
  },
  {
    id: 'alazanes',
    title: 'Dique Los Alazanes',
    altitudeMsnm: 1400,
    bortleClass: 'Bortle 2–3',
    accessibility: 'Trekking exigente (3 hs a pie desde La Toma)',
    idealFor: 'Ideal para cielo ultra oscuro y senderistas con experiencia',
    description:
      'El embalse de montaña a mayor altitud de Córdoba, rodeado de quebradas de granito sin luminarias en kilómetros a la redonda. En noches sin viento, el espejo de agua refleja las estrellas.',
    features: [
      'Entorno libre de contaminación lumínica directa',
      'Reflejo estelar sobre el espejo de agua del dique',
      'Requiere planificación, registro y compañía de guía',
    ],
  },
];

export const ASTRO_PREPARATION_TIPS: AstroPreparationTip[] = [
  {
    id: 'warmth',
    title: 'Abrigo térmico en capas',
    description:
      'Incluso en verano, al caer el sol en las sierras la temperatura desciende rápido y corre viento en altura. Llevá campera cortaviento, gorro y calzado cerrado de trekking.',
    iconKey: 'jacket',
  },
  {
    id: 'red-light',
    title: 'Linterna con luz roja',
    description:
      'La luz blanca del celular o de linternas comunes encandila y obliga a tus ojos a tardar 20 minutos en recuperar la visión nocturna. Usá modo de luz roja tenue para moverte.',
    iconKey: 'flashlight',
  },
  {
    id: 'moon-phase',
    title: 'Elegí noches cercanas a luna nueva',
    description:
      'La luna llena ilumina el cielo y opaca las estrellas más débiles y la Vía Láctea. Consultá el calendario lunar y el pronóstico de nubosidad antes de programar la salida.',
    iconKey: 'moon',
  },
  {
    id: 'guides',
    title: 'Guías habilitados en montaña',
    description:
      'Para el ascenso nocturno al Cerro Uritorco o caminatas hacia Dique Los Alazanes es obligatorio registrarse, respetar las condiciones climáticas y contratar guías habilitados.',
    iconKey: 'compass',
  },
];
