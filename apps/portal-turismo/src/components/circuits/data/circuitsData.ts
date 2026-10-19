import type { CircuitSpot, GastronomicVenue, AdventureActivity } from '../types/circuits.types';

export const MYSTIC_SPOTS: CircuitSpot[] = [
  {
    id: 'cerro-uritorco',
    title: 'Cerro Uritorco (Vórtice Mayor)',
    subtitle: 'El guardián cósmico del Valle de Punilla (1.979 msnm)',
    description: 'Considerado por la cosmovisión comechingón y tradiciones espirituales como un centro de concentración telúrica y conexión dimensional. Epicentro del mito de la Ciudad Subterránea de Erks.',
    highlights: [
      'Cumbre a 1.979 metros con vista de 360 grados de los valles de Punilla y Calamuchita',
      'Tradición ancestral de pueblos originarios y peregrinaciones de luna llena',
      'Senderos guiados diurnos y ascensos nocturnos para contemplar el amanecer'
    ],
    energyAttribute: 'Chakra Corona · Vibración Telúrica Alta',
    recommendations: [
      'Realizar el ascenso con calzado de montaña y registro obligatorio en base La Toma',
      'Para meditaciones en la cumbre, elegir los parajes intermedios como Refugio del Valle',
      'Contratar guías de montaña habilitados por la Comisión de Turismo para ascensos nocturnos'
    ],
    coordinates: { lat: -30.8436, lng: -64.4842 },
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    badge: 'Vórtice Principal',
    bestTime: 'Amanecer y Luna Llena'
  },
  {
    id: 'los-terrones',
    title: 'Parque Autóctono Los Terrones',
    subtitle: 'Laberinto de areniscas rojizas & Puerta de Erks',
    description: 'Cañadón milenario con gigantescas figuras esculpidas por la erosión eólica y fluvial. Según las crónicas locales, aquí resuenan los cantos sagrados y se perciben fenómenos lumínicos.',
    highlights: [
      'Formaciones rocosas únicas con millones de años de antigüedad',
      'Microclima de quebrada con helechos gigantes y cóndores en sobrevuelo',
      'Senderismo consciente por el circuito profundo del cañadón'
    ],
    energyAttribute: 'Resonancia Acústica & Silencio Profundo',
    recommendations: [
      'Caminar en silencio para percibir la acústica natural del cañón',
      'Llevar agua potable (mínimo 1.5L) y sombrero para el sol de la siesta',
      'El parque cuenta con guardaparques y sendero señalizado de 2.5 horas'
    ],
    coordinates: { lat: -30.7950, lng: -64.5120 },
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    badge: 'Ciudad Perdida',
    bestTime: 'Mañana temprana'
  },
  {
    id: 'valle-luna-huertas-malas',
    title: 'Valle de la Luna & Huertas Malas',
    subtitle: 'El retiro silencioso detrás de las sierras',
    description: 'Rincón de arenas blancas y cuarzo resplandeciente en la quebrada oriental. Lejos de ruidos urbanos, es el punto preferido para círculos de sanación, cuencos tibetanos y yoga serrano.',
    highlights: [
      'Arroyo de montaña con piletones naturales y agua pura de vertiente',
      'Yacimiento de cuarzo y minerales que reflejan la luz solar',
      'Atmósfera de introspección y descanso espiritual'
    ],
    energyAttribute: 'Transmutación & Claridad Mental',
    recommendations: [
      'Llevar esterilla o manta para sesiones de meditación sobre la roca',
      'Acceso de dificultad media por senderos de monte autóctono',
      'Prohibido dejar residuos o encender fuego en toda la reserva'
    ],
    coordinates: { lat: -30.8280, lng: -64.4920 },
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80',
    badge: 'Silencio & Meditación',
    bestTime: 'Mediodía y Atardecer'
  },
  {
    id: 'ojo-de-agua',
    title: 'Vertiente Sagrada Ojo de Agua',
    subtitle: 'Manantial ancestral y memoria de pueblos originarios',
    description: 'Manantial natural rodeado de sauces y molles donde los antiguos pueblos originarios realizaban rituales de purificación con agua bendecida por la madre tierra.',
    highlights: [
      'Agua mineral natural que brota filtrada por la roca granítica',
      'Zona protegida de avifauna serrana y flora medicinal',
      'Espacio ceremonial respetado por terapeutas holísticos'
    ],
    energyAttribute: 'Purificación & Elemento Agua',
    recommendations: [
      'Se aconseja beber del manantial y permanecer en contemplación serena',
      'Llegar a pie desde el pueblo en una caminata tranquila de 45 minutos'
    ],
    coordinates: { lat: -30.8710, lng: -64.5180 },
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    badge: 'Vertiente Ancestral',
    bestTime: 'Tardecita serrana'
  },
  {
    id: 'huella-pajarillo',
    title: 'Cerro Pajarillo & Huella Ovni',
    subtitle: 'Hito histórico del avistamiento de 1986',
    description: 'Zona donde en enero de 1986 quedó grabada la célebre marca ovalada de pasto quemado de más de 120 metros. Atrae a investigadores, ufólogos y apasionados de los misterios del cosmos.',
    highlights: [
      'Mirador natural hacia el cordón occidental de las sierras',
      'Vértice del triángulo energético Uritorco - Pajarillo - Terrones',
      'Cielo nocturno privilegiado para vigilias ovni'
    ],
    energyAttribute: 'Misterio & Conexión Cósmica',
    recommendations: [
      'Ideal para llevar binoculares y abrigo pesado durante la noche',
      'Coordinar con guías de astroturismo y vigilias nocturnas autorizadas'
    ],
    coordinates: { lat: -30.7600, lng: -64.5500 },
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    badge: 'Zona de Avistamiento',
    bestTime: 'Noches despejadas'
  }
];

export const GASTRONOMIC_VENUES: GastronomicVenue[] = [
  {
    id: 'chacinados-serranos',
    name: 'Almacén Serrano & Chacinados del Valle',
    category: 'chacinados',
    categoryLabel: 'Chacinados & Quesos',
    specialty: 'Salame de la colonia con hierbas serranas, bondiola curada y queso de cabra estacionado.',
    description: 'Elaboración tradicional artesanal con recetas criollas y europeas. Tablas de picada completas para compartir con pan de campo al horno de barro.',
    address: 'Av. Pueyrredón 340 (Centro)',
    phone: '+54 3548 481450',
    hours: 'Mar a Dom de 10:00 a 22:30 hs',
    coordinates: { lat: -30.8590, lng: -64.5240 },
    features: ['Venta por peso', 'Picadas en el local', 'Envasado al vacío para viaje']
  },
  {
    id: 'casa-de-te-el-paraiso',
    name: 'Casa de Té & Repostería El Paraíso',
    category: 'reposteria',
    categoryLabel: 'Té & Repostería Europea',
    specialty: 'Strudel tibio de manzana con crema especiada, selva negra y blends de té con peperina autóctona.',
    description: 'Emplazada en una casona histórica de estilo centroeuropeo con jardín de lavandas. Ceremonia del té con vajilla de porcelana y dulces caseros.',
    address: 'Calle Techada / Rivadavia 120',
    phone: '+54 3548 482110',
    hours: 'Mié a Dom de 16:00 a 21:00 hs',
    coordinates: { lat: -30.8575, lng: -64.5265 },
    features: ['Opciones sin TACC', 'Tés en hebras artesanales', 'Jardín botánico']
  },
  {
    id: 'truchas-los-mogotes',
    name: 'Rincón de la Trucha Criadero Los Mogotes',
    category: 'trucha',
    categoryLabel: 'Truchas de Criadero',
    specialty: 'Trucha arcoíris a la manteca negra con almendras y papas rústicas al romero.',
    description: 'Truchas frescas provenientes de las aguas heladas y cristalinas de las sierras. Cocina de autor que honra la pureza de la pesca de montaña.',
    address: 'Camino a Los Mogotes Km 2',
    phone: '+54 3548 481890',
    hours: 'Jue a Lun de 12:00 a 16:00 y 20:00 a 00:00 hs',
    coordinates: { lat: -30.8750, lng: -64.5420 },
    features: ['Vista a los paredones', 'Carta de vinos cordobeses', 'Menú infantil']
  },
  {
    id: 'cabrito-la-casona',
    name: 'Parrilla Criolla La Casona del Uritorco',
    category: 'cabrito',
    categoryLabel: 'Cabrito Serrano',
    specialty: 'Cabrito lechal serrano asado a la llama con leña de quebracho y espinillo.',
    description: 'Auténtico sabor serrano cordobés. Carne tierna y dorada servida con ensaladas orgánicas de huerta y empanadas criollas cortadas a cuchillo.',
    address: 'Av. Las Américas 810',
    phone: '+54 3548 483320',
    hours: 'Todos los días de 12:00 a 16:00 y 20:30 a 01:00 hs',
    coordinates: { lat: -30.8650, lng: -64.5300 },
    features: ['Estacionamiento propio', 'Asador a la vista', 'Empanadas al horno de barro']
  },
  {
    id: 'miel-uritorco',
    name: 'Apicultura Orgánica & Herboristería Serrana',
    category: 'miel',
    categoryLabel: 'Miel Orgánica & Hierbas',
    specialty: 'Miel pura de flora silvestre (chilca, piquillín y poleo), propóleos concentrados y blends medicinales.',
    description: 'Colmenares ubicados en quebradas libres de pesticidas agrícolas. Degustación guiada de mieles de diferentes alturas del cordón montañoso.',
    address: 'Diag. Buenos Aires 280',
    phone: '+54 3548 481105',
    hours: 'Lun a Sáb de 09:30 a 13:00 y 17:00 a 21:00 hs',
    coordinates: { lat: -30.8580, lng: -64.5270 },
    features: ['Certificación orgánica', 'Degustación sin cargo', 'Cosmética apícola natural']
  },
  {
    id: 'cerveceria-montana',
    name: 'Cervecería de Montaña Uritorco Beer House',
    category: 'cerveceria',
    categoryLabel: 'Cervecería de Montaña',
    specialty: 'IPA Serrana con lúpulos patagónicos y agua de vertiente, Stout con notas de algarroba tostada.',
    description: 'Punto de encuentro de montañistas y turistas. Canillas artesanales tiradas en un patio cervecero rodeado de sauces y fogones nocturnos.',
    address: 'Calle Corrientes 45',
    phone: '+54 3548 482590',
    hours: 'Mar a Dom de 18:30 a 02:00 hs',
    coordinates: { lat: -30.8595, lng: -64.5255 },
    features: ['Patio cervecero con fogón', 'Música acústica en vivo', 'Burgers caseras']
  }
];

export const ADVENTURE_ACTIVITIES: AdventureActivity[] = [
  {
    id: 'parapente-punilla',
    title: 'Vuelo en Parapente Biplaza sobre el Valle',
    modality: 'parapente',
    modalityLabel: 'Parapente Biplaza',
    location: 'Cuchi Corral / Mirador Punilla Norte',
    difficulty: 'Baja',
    duration: 'Vuelo de 25 a 40 minutos (total 2 horas con traslado)',
    description: 'Despegá desde la rampa natural de Cuchi Corral y planeá térmicas silenciosas con vista panorámica al Cerro Uritorco, el Río Pintos y el lago.',
    suggestedGear: ['Calzado deportivo firme (zapatillas o botas de trekking)', 'Campera cortaviento', 'Lentes de sol con protección UV'],
    safetyRequirements: [
      'Pilotos habilitados con licencia FAVL (Federación Argentina de Vuelo Libre)',
      'Condiciones meteorológicas y viento verificados previo al despegue',
      'Briefing obligatorio de despegue y aterrizaje con instructor'
    ],
    certifiedProviders: [
      { name: 'Alturas de Punilla Parapente', contact: '+54 3548 489910', certificationBadge: 'FAVL Habilitado #140' },
      { name: 'Uritorco Fly Adventure', contact: '+54 3548 488720', certificationBadge: 'Cámara Turismo Certificada' }
    ],
    coordinates: { lat: -30.9850, lng: -64.5700 }
  },
  {
    id: 'rappel-los-paredones',
    title: 'Rappel & Escalada en Roca en Los Paredones',
    modality: 'rappel',
    modalityLabel: 'Escalada & Descenso',
    location: 'Cañadón de Los Paredones & Río San Diego',
    difficulty: 'Media',
    duration: 'Medio día (4 a 5 horas)',
    description: 'Descenso en rappel de paredes verticales de granito rosado de 25 a 45 metros de altura con vistas profundas a las piletas del río.',
    suggestedGear: ['Pantalón cómodo resistente al roce', 'Mochila pequeña con 2L de agua', 'Protector solar y guantes de rappel (provistos)'],
    safetyRequirements: [
      'Cuerdas dinámicas y arneses certificados UIAA',
      'Casco homologado obligatorio en todo momento',
      'Guías matriculados en rescate técnico y primeros auxilios en zonas agrestes'
    ],
    certifiedProviders: [
      { name: 'Capilla Vertical Guías de Montaña', contact: '+54 3548 481333', certificationBadge: 'AAGM Matriculado' }
    ],
    coordinates: { lat: -30.8720, lng: -64.5450 }
  },
  {
    id: 'espeleologia-ongamira',
    title: 'Espeleología en Cavernas & Cuevas de Ongamira',
    modality: 'espeleologia',
    modalityLabel: 'Exploración Cavernas',
    location: 'Valle de Ongamira (a 25 km de Capilla del Monte)',
    difficulty: 'Media',
    duration: 'Jornada de 5 horas',
    description: 'Ingreso a laberintos subterráneos y aleros naturales de arenisca donde habitó la cultura comechingón precolombina. Historia milenaria y geología profunda.',
    suggestedGear: ['Linterna frontal con pilas de repuesto', 'Ropa que pueda ensuciarse con arcilla', 'Calzado con buena tracción'],
    safetyRequirements: [
      'Entrada únicamente con guías patrimoniales habilitados',
      'Monitoreo de ventilación y suelo en cavidades profundas',
      'Seguro de turismo activo obligatorio incluido en el permiso'
    ],
    certifiedProviders: [
      { name: 'Senderos de Ongamira Aventura', contact: '+54 3548 486711', certificationBadge: 'Patrimonio Punilla Oficial' }
    ],
    coordinates: { lat: -30.7720, lng: -64.4480 }
  },
  {
    id: 'astroturismo-uritorco',
    title: 'Astroturismo & Miradores de Cielo Nocturno',
    modality: 'astroturismo',
    modalityLabel: 'Astroturismo Bortle 3',
    location: 'Paso del Indio / Mirador El Zapato',
    difficulty: 'Baja',
    duration: '2.5 horas nocturnas',
    description: 'Observación telescópica guiada de cúmulos estelares, nebulosas y planetas bajo uno de los cielos más limpios de la provincia de Córdoba.',
    suggestedGear: ['Abrigo térmico en capas (temperatura baja de noche)', 'Linterna con filtro de luz roja para preservar la visión nocturna', 'Manta para sentarse en la hierba'],
    safetyRequirements: [
      'Coordinado por divulgadores astronómicos con telescopios computarizados',
      'Puntos de observación protegidos de contaminación lumínica y viento',
      'Apto para toda la familia sin límite de edad'
    ],
    certifiedProviders: [
      { name: 'Cielos del Uritorco Astroturismo', contact: '+54 3548 487755', certificationBadge: 'Certificación Cielo Limpio' }
    ],
    coordinates: { lat: -30.8520, lng: -64.5100 }
  }
];
