export interface EmergencyContact {
  id: string;
  name: string;
  shortNumber: string;
  fullPhone: string;
  description: string;
  address?: string;
  availability: string;
  type: 'rescate' | 'bomberos' | 'salud' | 'policia' | 'fuego' | 'defensa';
  badge: string;
  colorScheme: 'red' | 'amber' | 'emerald' | 'blue' | 'purple';
}

export interface EmergencyProtocol {
  id: string;
  title: string;
  iconName: 'compass' | 'shield' | 'cloud-rain';
  summary: string;
  steps: string[];
  warningNote: string;
}

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'duar',
    name: 'DUAR - Rescate de Alta Montaña',
    shortNumber: '911',
    fullPhone: '+543548481111',
    description: 'Departamento de Unidades de Alto Riesgo de la Policía de Córdoba. Especialistas en búsqueda, rescate técnico y evacuación en quebradas, cerros y zonas agrestes de Punilla.',
    address: 'Base Operativa Cerro Uritorco / Punilla Norte',
    availability: 'Guardia activa las 24 horas',
    type: 'rescate',
    badge: 'Rescate en Montaña',
    colorScheme: 'red'
  },
  {
    id: 'bomberos',
    name: 'Bomberos Voluntarios Capilla del Monte',
    shortNumber: '100',
    fullPhone: '+543548481444',
    description: 'Cuartel 73. Combate de incendios forestales, rescate vehicular, primeros auxilios y asistencia en contingencias climáticas.',
    address: 'Hipólito Yrigoyen y Deán Funes',
    availability: 'Guardia 24 hs · Despacho inmediato',
    type: 'bomberos',
    badge: 'Incendios & Auxilio',
    colorScheme: 'amber'
  },
  {
    id: 'hospital',
    name: 'Hospital Municipal Dr. Amancio Rodríguez',
    shortNumber: '107',
    fullPhone: '+543548481232',
    description: 'Centro de salud de referencia local. Cuenta con guardia médica permanente, shock room de trauma y provisión de suero antiofídico y antiescorpiónico.',
    address: 'Deán Funes 530 (a 4 cuadras del centro)',
    availability: 'Guardia médica 24 horas',
    type: 'salud',
    badge: 'Guardia Médica 107',
    colorScheme: 'emerald'
  },
  {
    id: 'policia',
    name: 'Policía de Córdoba - Comisaría Capilla del Monte',
    shortNumber: '101',
    fullPhone: '+543548481100',
    description: 'Seguridad ciudadana, patrullaje preventivo y coordinación de denuncias e intervenciones operativas.',
    address: 'Corrientes y Rivadavia (Plaza San Martín)',
    availability: 'Atención 24 horas',
    type: 'policia',
    badge: 'Seguridad 101',
    colorScheme: 'blue'
  },
  {
    id: 'fuego',
    name: 'Plan Provincial de Manejo del Fuego',
    shortNumber: '0800-888-38346',
    fullPhone: '080088838346',
    description: 'Línea gratuita de alerta temprana para denuncias inmediatas de columnas de humo, fogatas clandestinas o focos de incendio en las sierras.',
    availability: 'Línea gratuita 0800 FUEGO (24 hs)',
    type: 'fuego',
    badge: 'Alerta Incendios',
    colorScheme: 'red'
  },
  {
    id: 'defensa-civil',
    name: 'Defensa Civil & Guardia Turística',
    shortNumber: '103',
    fullPhone: '+543548481903',
    description: 'Monitoreo de alertas meteorológicas tempranas, crecidas de ríos y coordinación de senderos habilitados.',
    address: 'Predio Estación Ferrocarril',
    availability: 'Guardia activa 08:00 a 22:00 hs',
    type: 'defensa',
    badge: 'Guardia Turística 103',
    colorScheme: 'purple'
  }
];

export const EMERGENCY_PROTOCOLS: EmergencyProtocol[] = [
  {
    id: 'extravio',
    title: 'Qué hacer en caso de Extravío en Senderos',
    iconName: 'compass',
    summary: 'Si perdiste la senda marcada o cayó la noche mientras bajás del Cerro Uritorco o quebradas serranas:',
    steps: [
      'Detener la marcha de inmediato: no intentes descender por quebradas o cañadones desconocidos a ciegas.',
      'Buscar un punto visible y protegido del viento: no te separes de tu grupo.',
      'Racionar agua y comida: el abrigo debe colocarse antes de que caiga la temperatura.',
      'Emitir señales audibles o lumínicas reglamentarias: 3 pitidos de silbato o 3 destellos de linterna cada un minuto indican auxilio internacional.',
      'Si contás con un punto de señal celular esporádica, llamá directamente al DUAR (911 / +54 3548 481111) y compartí tu ubicación GPS por mensaje.'
    ],
    warningNote: 'Nunca bajes hacia el cauce de cañones cerrados sin senda marcada: el 80% de los rescates complejos ocurren por personas que intentaron acortar camino por quebradas ciegas.'
  },
  {
    id: 'picaduras',
    title: 'Protocolo ante Picaduras de Alacrán o Mordedura de Serpiente',
    iconName: 'shield',
    summary: 'En época estival en las sierras es fundamental actuar con serenidad y rapidez protocolar:',
    steps: [
      'Mantener a la persona en calma y en reposo absoluto para desacelerar la circulación sanguínea.',
      'Lavar la zona de la herida con abundante agua y jabón neutro.',
      'Quitar anillos, pulseras o calzado ajustado antes de que la zona se inflame.',
      'Aplicar compresas frías en la zona (no hielo directo).',
      'Trasladar de inmediato a la persona al Hospital Dr. Amancio Rodríguez (Deán Funes 530, Capilla del Monte), que cuenta con antiveneno específico.'
    ],
    warningNote: 'PROHIBIDO realizar torniquetes, hacer cortes en la piel o intentar succionar el veneno. No suministrar bebidas alcohólicas ni medicamentos sin orden médica.'
  },
  {
    id: 'tormentas',
    title: 'Crecidas Repentinas de Ríos y Tormentas Eléctricas',
    iconName: 'cloud-rain',
    summary: 'Los ríos serranos (Calabalumba, Dolores, San Diego) crecen en minutos tras lluvias en las altas cumbres:',
    steps: [
      'Al observar agua turbia, ramas, espuma o escuchar un zumbido aguas arriba, retirate de inmediato del cauce y de las márgenes bajas.',
      'Ganar altura rápidamente hacia terreno firme y rocoso alejado del cauce.',
      'Ante tormenta con rayos, alejate de árboles solitarios, cercos de alambre y estructuras metálicas.',
      'No cruzar vados o puentes que se encuentren tapados por el agua, ni a pie ni en vehículo.'
    ],
    warningNote: 'Una lluvia a 15 km en la cumbre puede provocar una crecida violenta en el balneario aunque en el pueblo esté soleado. Respetá siempre las indicaciones de Defensa Civil.'
  }
];
