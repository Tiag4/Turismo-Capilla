import type { OriginCategory, TrainScheduleRow, MobilityPoint } from '../types/mobility.types';

export const ORIGINS_DATA: OriginCategory[] = [
  {
    id: 'cordoba',
    label: 'Desde Córdoba Capital & Aeropuerto',
    badge: '105 km · ~1h 40m',
    summary: 'La conexión más habitual desde el Aeropuerto Internacional Pajas Blancas o la Terminal de Ómnibus de Córdoba.',
    routes: [
      {
        id: 'cordoba-variante-costa-azul',
        name: 'Opción Principal: Autovía Variante Costa Azul + RN 38',
        distanceKm: 105,
        estimatedTime: '1 hora 40 minutos',
        recommended: true,
        roads: ['Autovía Córdoba - Carlos Paz (RN 20)', 'Variante Costa Azul (RP E-55)', 'Autovía de Punilla / RN 38'],
        description: 'Trazado moderno de calzada doble carril hasta el Puente José Manuel de la Sota (Lago San Roque), continuando por Autovía de Punilla y empalmando la Ruta Nacional 38 directo hacia Capilla del Monte.',
        highlights: [
          'Calzada de autovía moderna de 4 carriles en más del 70% del tramo',
          'Puente en arco con vista panorámica del Lago San Roque',
          'Evita el embotellamiento del centro de Villa Carlos Paz',
          'Estaciones de servicio YPF, Axion y Shell sobre el corredor'
        ],
        scenicQuality: 'Autovía rápida',
        precautions: 'En fines de semana largos de verano, prever demora en el tramo de RN 38 entre Molinari y La Falda.',
        tolls: [
          {
            name: 'Estación de Peaje Autovía Variante Costa Azul',
            road: 'Red de Accesos a Córdoba (RAC) / RP E-55',
            operator: 'Caminos de las Sierras',
            estimatedFee: '$1.000',
            paymentMethods: ['Efectivo', 'TelePASE (habilitado nacional)', 'Pase Alpa (Caminos de las Sierras)'],
            notes: 'Cobro en ambos sentidos. Acepta TelePASE sin necesidad de detenerse en cabina dinámica.'
          }
        ]
      },
      {
        id: 'cordoba-camino-cuadrado',
        name: 'Opción Panorámica: Camino del Cuadrado (RP E-53 + E-57)',
        distanceKm: 98,
        estimatedTime: '1 hora 50 minutos',
        recommended: false,
        roads: ['Ruta E-53 (Salsipuedes)', 'Camino del Cuadrado (RP E-57)', 'RN 38 (desde La Falda)'],
        description: 'Ideal si salís directo desde el Aeropuerto Pajas Blancas. Sube las Sierras Chicas con vistas espectaculares de altura (1.300 msnm) y desciende directo en La Falda para continuar al norte por RN 38.',
        highlights: [
          'Ruta sumamente pintoresca con miradores serranos de las Sierras Chicas',
          'Salida rápida y directa sin atravesar la ciudad de Córdoba',
          'Conexión directa en La Falda hacia Huerta Grande, La Cumbre y Capilla del Monte'
        ],
        scenicQuality: 'Panorámica de altura',
        precautions: 'Atención: en madrugadas de invierno y días de tormenta puede cerrarse temporalmente por niebla cerrada.',
        tolls: [
          {
            name: 'Estación de Peaje Aeropuerto / Ruta E-53',
            road: 'Ruta Provincial E-53 (Autovía a Río Ceballos)',
            operator: 'Caminos de las Sierras',
            estimatedFee: '$1.000',
            paymentMethods: ['Efectivo', 'TelePASE', 'Pase Alpa'],
            notes: 'Puesto único de salida norte de Córdoba Capital.'
          }
        ]
      }
    ]
  },
  {
    id: 'buenos-aires',
    label: 'Desde Buenos Aires & Rosario',
    badge: '815 km / 495 km · Autopista',
    summary: 'Corredor directo por autopista RN 9 hasta el anillo de Circunvalación de Córdoba y empalme al Valle de Punilla.',
    routes: [
      {
        id: 'ba-rosario-cordoba',
        name: 'Autopista Nacional 9 + Circunvalación Córdoba + Variante Costa Azul',
        distanceKm: 815,
        estimatedTime: '8 horas 30 minutos (desde CABA) / 5 horas (desde Rosario)',
        recommended: true,
        roads: ['Autopista Panamericana (RN 9)', 'Autopista Rosario - Córdoba (RN 9)', 'Av. Circunvalación (RN A019)', 'RN 20 / E-55', 'RN 38'],
        description: 'Trazado 100% autopista de doble carril hasta las puertas del Valle de Punilla. Al llegar a Córdoba, tomar la Av. Circunvalación hacia el Oeste con indicación "Villa Carlos Paz / Autovía Costa Azul" y continuar hacia Capilla del Monte.',
        highlights: [
          'Vía rápida, señalizada y con banquinas pavimentadas',
          'Paradas de servicio completas recomendadas en Rosario, Leones y Bell Ville',
          'Fácil ingreso a las sierras sin cruzar semáforos urbanos'
        ],
        scenicQuality: 'Autovía rápida',
        precautions: 'Cargar combustible en Bell Ville o Villa María antes de los últimos 200 km.',
        tolls: [
          {
            name: 'Peajes Corredor Nacional RN 9 (Zárate, Carcarañá, James Craik)',
            road: 'Ruta Nacional 9',
            operator: 'Corredores Viales S.A.',
            estimatedFee: '$1.100 - $1.400 c/u',
            paymentMethods: ['Efectivo', 'TelePASE'],
            notes: 'Puestos consecutivos a lo largo del trayecto interprovincial.'
          },
          {
            name: 'Peaje Autovía Variante Costa Azul (Ingreso a Punilla)',
            road: 'RP E-55',
            operator: 'Caminos de las Sierras',
            estimatedFee: '$1.000',
            paymentMethods: ['Efectivo', 'TelePASE'],
            notes: 'Único peaje provincial al ingresar al valle serrano.'
          }
        ]
      }
    ]
  },
  {
    id: 'cuyo',
    label: 'Desde Cuyo & La Rioja',
    badge: '480 km · Altas Cumbres o Norte',
    summary: 'Accesos desde Mendoza, San Juan y San Luis cruzando las sierras grandes, o desde La Rioja por el norte de Punilla.',
    routes: [
      {
        id: 'cuyo-altas-cumbres',
        name: 'Opción Cuyo Sur: Por San Luis & Camino de las Altas Cumbres (RN 20 / RP 34)',
        distanceKm: 520,
        estimatedTime: '6 horas 15 minutos',
        recommended: true,
        roads: ['RN 7 / RN 146 (San Luis)', 'RN 20 (Villa Dolores)', 'Camino de las Altas Cumbres (RP 34)', 'RN 38'],
        description: 'Cruce imponente de las Sierras Grandes superando los 2.200 msnm por el Paraje El Cóndor, con descenso panorámico hacia Carlos Paz y desvío al norte de Punilla por RN 38.',
        highlights: [
          'Uno de los caminos más hermosos y escénicos de la República Argentina',
          'Parador El Cóndor con vista al Parque Nacional Quebrada del Condorito',
          'Ingreso fluido por el sur de Punilla'
        ],
        scenicQuality: 'Panorámica de altura',
        precautions: 'Revisar frenos y líquido refrigerante antes de encarar el ascenso a Altas Cumbres. En invierno puede haber hielo en calzada.',
        tolls: [
          {
            name: 'Peaje Falda del Cañete / Conexión Cumbres',
            road: 'RP 34 / Conexión RN 20',
            operator: 'Caminos de las Sierras',
            estimatedFee: '$1.000',
            paymentMethods: ['Efectivo', 'TelePASE']
          }
        ]
      },
      {
        id: 'larioja-cruz-del-eje',
        name: 'Opción La Rioja / San Juan Norte: RN 38 Norte por Cruz del Eje',
        distanceKm: 340,
        estimatedTime: '4 horas 10 minutos',
        recommended: false,
        roads: ['Ruta Nacional 38 Norte'],
        description: 'Ingreso directo al Valle de Punilla desde el norte de la provincia. Se pasa por Patquía, Serrezuela y Cruz del Eje, ingresando a Capilla del Monte sin necesidad de pagar peajes provinciales.',
        highlights: [
          'Tránsito muy despejado y sin aglomeraciones turísticas',
          'Camino plano con vista al Cerro Uritorco desde el acceso norte',
          'Cero peajes en el tramo Cruz del Eje - Capilla del Monte'
        ],
        scenicQuality: 'Camino serrano',
        precautions: 'Menor frecuencia de estaciones de servicio: recargar en Chamical o Cruz del Eje.',
        tolls: []
      }
    ]
  },
  {
    id: 'traslasierra',
    label: 'Desde Traslasierra',
    badge: '145 km · ~2h 45m',
    summary: 'Conexión desde Mina Clavero, Nono, Villa de Las Rosas y San Javier.',
    routes: [
      {
        id: 'traslasierra-cumbres-punilla',
        name: 'Mina Clavero - Altas Cumbres - Bialet Massé - Capilla del Monte',
        distanceKm: 145,
        estimatedTime: '2 horas 45 minutos',
        recommended: true,
        roads: ['Camino de las Altas Cumbres (RP 34)', 'Variante Costa Azul (RP E-55)', 'Ruta Nacional 38'],
        description: 'Salida desde Mina Clavero subiendo por RP 34 hasta El Cóndor, descenso hacia el Valle de Punilla y empalme en Bialet Massé rumbo al norte por RN 38 pasando por Cosquín y La Falda.',
        highlights: [
          'Vistas del valle de Traslasierra y del Valle de Punilla en un solo viaje',
          'Camino asfaltado en óptimas condiciones'
        ],
        scenicQuality: 'Panorámica de altura',
        precautions: 'Tramos con curvas cerradas de montaña. Respetar velocidades máximas.',
        tolls: [
          {
            name: 'Peaje Variante Costa Azul / Bialet Massé',
            road: 'RP E-55',
            operator: 'Caminos de las Sierras',
            estimatedFee: '$1.000',
            paymentMethods: ['Efectivo', 'TelePASE']
          }
        ]
      }
    ]
  }
];

export const TRAIN_STATIONS_LIST = [
  { name: 'Córdoba Mitre / Alta Córdoba', km: 'Km 0', main: true },
  { name: 'La Calera', km: 'Km 23', main: false },
  { name: 'San Roque', km: 'Km 38', main: false },
  { name: 'Bialet Massé', km: 'Km 44', main: false },
  { name: 'Cosquín', km: 'Km 56', main: true },
  { name: 'Valle Hermoso', km: 'Km 74', main: true },
  { name: 'La Falda', km: 'Km 78', main: true },
  { name: 'Huerta Grande', km: 'Km 82', main: false },
  { name: 'La Cumbre', km: 'Km 92', main: true },
  { name: 'San Esteban', km: 'Km 96', main: false },
  { name: 'Capilla del Monte', km: 'Km 105 (Destino Final)', main: true }
];

export const TRAIN_SCHEDULES: TrainScheduleRow[] = [
  {
    serviceId: 'TR-01',
    departureStation: 'Córdoba (Alta Córdoba)',
    departureTime: '07:45 hs',
    arrivalStation: 'Capilla del Monte',
    arrivalTime: '11:15 hs',
    duration: '3h 30m',
    days: 'Lunes a Viernes',
    type: 'Servicio Regular'
  },
  {
    serviceId: 'TR-02',
    departureStation: 'Córdoba (Alta Córdoba)',
    departureTime: '13:10 hs',
    arrivalStation: 'Capilla del Monte',
    arrivalTime: '16:40 hs',
    duration: '3h 30m',
    days: 'Lunes a Domingos & Feriados',
    type: 'Servicio Regular'
  },
  {
    serviceId: 'TR-03 (Vuelta)',
    departureStation: 'Capilla del Monte',
    departureTime: '12:05 hs',
    arrivalStation: 'Córdoba (Alta Córdoba)',
    arrivalTime: '15:35 hs',
    duration: '3h 30m',
    days: 'Lunes a Viernes',
    type: 'Servicio Regular'
  },
  {
    serviceId: 'TR-04 (Vuelta)',
    departureStation: 'Capilla del Monte',
    departureTime: '17:25 hs',
    arrivalStation: 'Córdoba (Alta Córdoba)',
    arrivalTime: '20:55 hs',
    duration: '3h 30m',
    days: 'Lunes a Domingos & Feriados',
    type: 'Servicio Turístico Feriados'
  }
];

export const MOBILITY_MAP_POINTS: MobilityPoint[] = [
  {
    id: 'estacion-tren',
    title: 'Estación de Tren Capilla del Monte',
    category: 'tren',
    lat: -30.8601,
    lng: -64.5262,
    description: 'Punto de arribo del Tren de las Sierras. Ubicada en pleno centro cívico, junto al predio del ferrocarril y la Secretaría de Turismo.',
    address: 'Av. Pueyrredón e Hipólito Yrigoyen',
    badgeText: 'Tren de las Sierras',
    routeOrigin: 'Capilla del Monte'
  },
  {
    id: 'terminal-omnibus',
    title: 'Terminal de Ómnibus de Capilla del Monte',
    category: 'terminal',
    lat: -30.8582,
    lng: -64.5284,
    description: 'Llegada y salida de colectivos interurbanos (Sarmiento, Lumasa, Ersa) y larga distancia (Chevallier, Urquiza). Servicios cada 35 minutos a Córdoba Capital.',
    address: 'Diagonal Buenos Aires s/n',
    badgeText: 'Ómnibus & Micros',
    routeOrigin: 'Capilla del Monte'
  },
  {
    id: 'acceso-rn38',
    title: 'Acceso Sur Ruta Nacional 38',
    category: 'ruta',
    lat: -30.8680,
    lng: -64.5320,
    description: 'Rotonda de acceso principal desde La Cumbre, La Falda y Córdoba Capital.',
    address: 'RN 38 y Av. Las Américas',
    badgeText: 'Ruta Nacional 38',
    routeOrigin: 'Capilla del Monte'
  },
  {
    id: 'peaje-costa-azul',
    title: 'Peaje Variante Costa Azul (Autovía Punilla)',
    category: 'peaje',
    lat: -31.3917,
    lng: -64.4428,
    description: 'Puesto de cobro troncal sobre RP E-55 (al este del Lago San Roque). Cruce fundamental para ingresar a la Autovía de Punilla hacia Capilla del Monte sin cruzar el centro urbano.',
    address: 'Autovía Variante Costa Azul (RP E-55)',
    badgeText: 'RAC Punilla · $1.000',
    routeOrigin: 'Acceso Punilla / Córdoba'
  },
  {
    id: 'peaje-cba-carlos-paz',
    title: 'Peaje Autopista Córdoba - Carlos Paz (RN 20)',
    category: 'peaje',
    lat: -31.4552,
    lng: -64.3400,
    description: 'Estación troncal en Malagueño sobre la Autopista RN 20. Paso obligado para quienes ingresan a las sierras desde la Circunvalación de Córdoba, Santa Fe y Buenos Aires.',
    address: 'Autopista Justiniano Posse (RN 20 Km 15)',
    badgeText: 'RAC RN 20 · $1.000',
    routeOrigin: 'Córdoba / BsAs / Santa Fe'
  },
  {
    id: 'peaje-falda-canete',
    title: 'Peaje Falda del Cañete (Altas Cumbres)',
    category: 'peaje',
    lat: -31.5458,
    lng: -64.4285,
    description: 'Puesto en el enlace entre el Camino de las Altas Cumbres (RP 34) y la autopista a Carlos Paz. Cruce directo para turistas procedentes de Mendoza, San Luis y Cuyo.',
    address: 'RP 34 / Conexión Altas Cumbres',
    badgeText: 'Cuyo & Cumbres · $1.000',
    routeOrigin: 'Mendoza / San Juan / Cuyo'
  },
  {
    id: 'peaje-james-craik',
    title: 'Peaje James Craik (Autopista RN 9)',
    category: 'peaje',
    lat: -32.1611,
    lng: -63.4680,
    description: 'Cabinas troncales sobre la Autopista Rosario - Córdoba (RN 9 Km 588) entre Villa María y James Craik. Corredor directo hacia Córdoba para quienes vienen desde Santa Fe y Buenos Aires.',
    address: 'Autopista RN 9 Km 588 (Córdoba)',
    badgeText: 'Autopista RN 9 · $1.200',
    routeOrigin: 'Santa Fe / Rosario / BsAs'
  },
  {
    id: 'peaje-carcarana',
    title: 'Peaje Carcarañá (Santa Fe - RN 9)',
    category: 'peaje',
    lat: -32.8592,
    lng: -61.1681,
    description: 'Estación de peaje sobre la Autopista RN 9 Km 340 en la provincia de Santa Fe. Primer peaje saliendo desde Rosario y el Litoral rumbo a las Sierras de Córdoba.',
    address: 'Autopista Rosario - Córdoba Km 340 (Santa Fe)',
    badgeText: 'Santa Fe · $1.100',
    routeOrigin: 'Santa Fe / Rosario'
  },
  {
    id: 'peaje-e53-aeropuerto',
    title: 'Peaje Ruta E-53 (Aeropuerto / Camino del Cuadrado)',
    category: 'peaje',
    lat: -31.2950,
    lng: -64.2480,
    description: 'Puesto de cobro sobre RP E-53 a la salida norte de Córdoba, antes del desvío por Camino del Cuadrado (RP E-57) hacia La Falda y Capilla del Monte.',
    address: 'RP E-53 Km 12 (Río Ceballos)',
    badgeText: 'RAC E-53 · $1.000',
    routeOrigin: 'Aeropuerto / Sierras Chicas'
  }
];
