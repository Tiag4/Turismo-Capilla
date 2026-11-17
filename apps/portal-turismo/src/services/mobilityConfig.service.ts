import { API_BASE_URL } from './api';
import type { MobilityConfig } from '../components/mobility/types/mobility.types';

export const STORAGE_KEY_MOBILITY = 'turismo_capilla_mobility_config';
export const MOBILITY_BROADCAST_CHANNEL = 'capilla_mobility_channel';

export const DEFAULT_MOBILITY_CONFIG: MobilityConfig = {
  version: 1,
  updatedAt: new Date().toISOString(),
  showArsCurrency: true,
  transitAlert: {
    active: false,
    title: 'Aviso de Tránsito Serrano',
    message: 'Tránsito fluido y calzada despejada en todos los accesos principales a Capilla del Monte.',
    severity: 'info',
    updatedAt: new Date().toISOString(),
  },
  tolls: [
    {
      id: 'toll-costa-azul',
      name: 'Estación de Peaje Autovía Variante Costa Azul',
      road: 'Red de Accesos a Córdoba (RAC) / RP E-55',
      operator: 'Caminos de las Sierras',
      estimatedFee: '$1.000 ARS',
      paymentMethods: ['Efectivo', 'TelePASE (habilitado nacional)', 'Pase Alpa (Caminos de las Sierras)'],
      notes: 'Cabinas bidireccionales con vías automáticas de telepeaje.',
    },
    {
      id: 'toll-cba-carlos-paz',
      name: 'Peaje Autopista Córdoba - Carlos Paz (RN 20)',
      road: 'Autopista Justiniano Posse (RN 20 Km 15)',
      operator: 'Caminos de las Sierras',
      estimatedFee: '$1.000 ARS',
      paymentMethods: ['Efectivo', 'TelePASE', 'Pase Alpa'],
      notes: 'Paso troncal al salir de la Circunvalación de Córdoba hacia las Sierras.',
    },
    {
      id: 'toll-falda-canete',
      name: 'Peaje Falda del Cañete / Conexión Cumbres',
      road: 'RP 34 / Conexión RN 20',
      operator: 'Caminos de las Sierras',
      estimatedFee: '$1.000 ARS',
      paymentMethods: ['Efectivo', 'TelePASE'],
      notes: 'Enlace entre el Camino de las Altas Cumbres y el Valle de Punilla.',
    },
    {
      id: 'toll-e53-aeropuerto',
      name: 'Peaje Ruta E-53 (Aeropuerto / Camino del Cuadrado)',
      road: 'RP E-53 Km 12 (Río Ceballos)',
      operator: 'Caminos de las Sierras',
      estimatedFee: '$1.000 ARS',
      paymentMethods: ['Efectivo', 'TelePASE'],
      notes: 'Puesto previo al empalme con el Camino del Cuadrado hacia La Falda.',
    },
    {
      id: 'toll-rn9-interprovincial',
      name: 'Peajes Corredor Nacional RN 9 (Zárate, Carcarañá, James Craik)',
      road: 'Ruta Nacional 9',
      operator: 'Corredores Viales S.A.',
      estimatedFee: '$1.100 - $1.400 ARS c/u',
      paymentMethods: ['Efectivo', 'TelePASE'],
      notes: 'Puestos consecutivos a lo largo del trayecto interprovincial.',
    },
  ],
  train: {
    fareRange: '$250 - $400 ARS',
    bookingUrl: 'https://webventas.sofse.gob.ar/',
    stationName: 'Estación Capilla del Monte (Destino Final)',
    stationAddress: 'Predio del Ferrocarril / Centro Cívico (Av. Pueyrredón e Hipólito Yrigoyen)',
    stationMapsUrl: 'https://maps.google.com/?q=Estacion+Capilla+del+Monte+Cordoba',
    alertNote: 'Se aconseja reservar pasajes online con anticipación en fines de semana largos y temporada alta.',
    schedules: [
      {
        serviceId: 'TR-01',
        departureStation: 'Córdoba (Alta Córdoba)',
        departureTime: '07:45 hs',
        arrivalStation: 'Capilla del Monte',
        arrivalTime: '11:15 hs',
        duration: '3h 30m',
        days: 'Lunes a Viernes',
        type: 'Servicio Regular',
      },
      {
        serviceId: 'TR-02',
        departureStation: 'Córdoba (Alta Córdoba)',
        departureTime: '13:10 hs',
        arrivalStation: 'Capilla del Monte',
        arrivalTime: '16:40 hs',
        duration: '3h 30m',
        days: 'Lunes a Domingos & Feriados',
        type: 'Servicio Regular',
      },
      {
        serviceId: 'TR-03 (Vuelta)',
        departureStation: 'Capilla del Monte',
        departureTime: '12:05 hs',
        arrivalStation: 'Córdoba (Alta Córdoba)',
        arrivalTime: '15:35 hs',
        duration: '3h 30m',
        days: 'Lunes a Viernes',
        type: 'Servicio Regular',
      },
      {
        serviceId: 'TR-04 (Vuelta)',
        departureStation: 'Capilla del Monte',
        departureTime: '17:25 hs',
        arrivalStation: 'Córdoba (Alta Córdoba)',
        arrivalTime: '20:55 hs',
        duration: '3h 30m',
        days: 'Lunes a Domingos & Feriados',
        type: 'Servicio Turístico Feriados',
      },
    ],
    stations: [
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
      { name: 'Capilla del Monte', km: 'Km 105 (Destino Final)', main: true },
    ],
  },
  busTerminal: {
    terminalAddress: 'Diagonal Buenos Aires s/n (a 3 cuadras de la Calle Techada)',
    terminalPhone: '+54 3548 481123',
    frequencyNote: 'Salidas cada 35-45 minutos',
    interurbanTitle: 'Interurbanos (Córdoba - Punilla - Capilla)',
    interurbanDescription: 'Parten desde la Nueva Terminal de Córdoba (T2) y realizan paradas sobre el corredor de Ruta 38 y Aeropuerto.',
    interurbanPaymentNote: 'Abono mediante tarjeta TIN / Efectivo / Boleterías oficiales en Terminales.',
    interurbanCompanies: ['Empresa Sarmiento', 'Lumasa', 'Ersa Interurbanos', 'FonoBus'],
    longDistanceTitle: 'Empresas Nacionales con servicio directo',
    longDistanceCompanies: ['Chevallier', 'Gral. Urquiza', 'Sierras Cordobesas', 'El Práctico'],
  },
  originsData: [
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
            'Estaciones de servicio YPF, Axion y Shell sobre el corredor',
          ],
          scenicQuality: 'Autovía rápida',
          precautions: 'En fines de semana largos de verano, prever demora en el tramo de RN 38 entre Molinari y La Falda.',
          tolls: [
            {
              name: 'Estación de Peaje Autovía Variante Costa Azul',
              road: 'Red de Accesos a Córdoba (RAC) / RP E-55',
              operator: 'Caminos de las Sierras',
              estimatedFee: '$1.000 ARS',
              paymentMethods: ['Efectivo', 'TelePASE (habilitado nacional)', 'Pase Alpa (Caminos de las Sierras)'],
              notes: 'Paso dinámico por cabinas troncales.',
            },
          ],
        },
        {
          id: 'cordoba-camino-cuadrado',
          name: 'Opción Panorámica: Camino del Cuadrado (RP E-57)',
          distanceKm: 98,
          estimatedTime: '1 hora 50 minutos',
          recommended: false,
          roads: ['Ruta Provincial E-53 (Aeropuerto)', 'Camino del Cuadrado (RP E-57)', 'Ruta Nacional 38'],
          description: 'Cruce de las Sierras Chicas con vistas panorámicas excepcionales. Conecta directo desde el aeropuerto pasando por Río Ceballos y Salsipuedes, descendiendo en Valle Hermoso y empalmando la RN 38.',
          highlights: [
            'Excelente alternativa directa si arribás al Aeropuerto Internacional',
            'Miradores de montaña con vista a la llanura y al Valle de Punilla',
            'Tránsito ágil que evita toda el área de Carlos Paz',
          ],
          scenicQuality: 'Panorámica de altura',
          precautions: 'En días de densa niebla o heladas nocturnas, la Policía Caminera suele restringir el paso por seguridad.',
          tolls: [
            {
              name: 'Peaje Ruta E-53 (Salida Córdoba / Aeropuerto)',
              road: 'RP E-53',
              operator: 'Caminos de las Sierras',
              estimatedFee: '$1.000 ARS',
              paymentMethods: ['Efectivo', 'TelePASE'],
              notes: 'Único peaje antes de subir al Cuadrado.',
            },
          ],
        },
      ],
    },
    {
      id: 'buenos-aires',
      label: 'Desde Buenos Aires & Rosario',
      badge: '815 km · Todo Autopista',
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
            'Fácil ingreso a las sierras sin cruzar semáforos urbanos',
          ],
          scenicQuality: 'Autovía rápida',
          precautions: 'Cargar combustible en Bell Ville o Villa María antes de los últimos 200 km.',
          tolls: [
            {
              name: 'Peajes Corredor Nacional RN 9 (Zárate, Carcarañá, James Craik)',
              road: 'Ruta Nacional 9',
              operator: 'Corredores Viales S.A.',
              estimatedFee: '$1.100 - $1.400 ARS c/u',
              paymentMethods: ['Efectivo', 'TelePASE'],
              notes: 'Puestos consecutivos a lo largo del trayecto interprovincial.',
            },
            {
              name: 'Peaje Autovía Variante Costa Azul (Ingreso a Punilla)',
              road: 'RP E-55',
              operator: 'Caminos de las Sierras',
              estimatedFee: '$1.000 ARS',
              paymentMethods: ['Efectivo', 'TelePASE'],
              notes: 'Único peaje provincial al ingresar al valle serrano.',
            },
          ],
        },
      ],
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
            'Ingreso fluido por el sur de Punilla',
          ],
          scenicQuality: 'Panorámica de altura',
          precautions: 'Revisar frenos y líquido refrigerante antes de encarar el ascenso a Altas Cumbres. En invierno puede haber hielo en calzada.',
          tolls: [
            {
              name: 'Peaje Falda del Cañete / Conexión Cumbres',
              road: 'RP 34 / Conexión RN 20',
              operator: 'Caminos de las Sierras',
              estimatedFee: '$1.000 ARS',
              paymentMethods: ['Efectivo', 'TelePASE'],
            },
          ],
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
            'Cero peajes en el tramo Cruz del Eje - Capilla del Monte',
          ],
          scenicQuality: 'Camino serrano',
          precautions: 'Menor frecuencia de estaciones de servicio: recargar en Chamical o Cruz del Eje.',
          tolls: [],
        },
      ],
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
            'Camino asfaltado en óptimas condiciones',
          ],
          scenicQuality: 'Panorámica de altura',
          precautions: 'Tramos con curvas cerradas de montaña. Respetar velocidades máximas.',
          tolls: [
            {
              name: 'Peaje Variante Costa Azul / Bialet Massé',
              road: 'RP E-55',
              operator: 'Caminos de las Sierras',
              estimatedFee: '$1.000 ARS',
              paymentMethods: ['Efectivo', 'TelePASE'],
            },
          ],
        },
      ],
    },
  ],
};

function getStoredConfig(): MobilityConfig {
  if (typeof window === 'undefined') return DEFAULT_MOBILITY_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MOBILITY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          ...DEFAULT_MOBILITY_CONFIG,
          ...parsed,
          showArsCurrency: parsed.showArsCurrency !== undefined ? Boolean(parsed.showArsCurrency) : true,
          transitAlert: {
            ...DEFAULT_MOBILITY_CONFIG.transitAlert,
            ...(parsed.transitAlert || {}),
          },
          train: {
            ...DEFAULT_MOBILITY_CONFIG.train,
            ...(parsed.train || {}),
          },
          busTerminal: {
            ...DEFAULT_MOBILITY_CONFIG.busTerminal,
            ...(parsed.busTerminal || {}),
          },
          tolls: Array.isArray(parsed.tolls) && parsed.tolls.length > 0 ? parsed.tolls : DEFAULT_MOBILITY_CONFIG.tolls,
          originsData: Array.isArray(parsed.originsData) && parsed.originsData.length > 0 ? parsed.originsData : DEFAULT_MOBILITY_CONFIG.originsData,
        };
      }
    }
  } catch {
    // Fallback to default
  }
  return DEFAULT_MOBILITY_CONFIG;
}

export const portalMobilityService = {
  getConfig: (): MobilityConfig => {
    return getStoredConfig();
  },

  fetchConfig: async (): Promise<MobilityConfig> => {
    try {
      const response = await fetch(`${API_BASE_URL}/mobility`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const remote = await response.json();
        if (remote && typeof remote === 'object' && Object.keys(remote).length > 2) {
          const merged: MobilityConfig = {
            ...DEFAULT_MOBILITY_CONFIG,
            ...(remote as Partial<MobilityConfig>),
            transitAlert: {
              ...DEFAULT_MOBILITY_CONFIG.transitAlert,
              ...((remote as Partial<MobilityConfig>).transitAlert || {}),
            },
            train: {
              ...DEFAULT_MOBILITY_CONFIG.train,
              ...((remote as Partial<MobilityConfig>).train || {}),
            },
            busTerminal: {
              ...DEFAULT_MOBILITY_CONFIG.busTerminal,
              ...((remote as Partial<MobilityConfig>).busTerminal || {}),
            },
          };
          try {
            localStorage.setItem(STORAGE_KEY_MOBILITY, JSON.stringify(merged));
          } catch {
            // Ignorar errores de quota en localStorage
          }
          return merged;
        }
      }
    } catch {
      // Contingencia offline silenciosa
    }
    return getStoredConfig();
  },
};
