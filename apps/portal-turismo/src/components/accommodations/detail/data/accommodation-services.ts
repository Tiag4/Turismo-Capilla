export interface AmenityDetailItem {
  name: string;
  badge?: 'Gratis' | 'De pago' | 'Bajo petición';
  description?: string;
}

export interface AmenityCategoryGroup {
  category: string;
  iconName: string;
  items: AmenityDetailItem[];
}

export const ACCOMMODATION_SERVICES_CATALOG: AmenityCategoryGroup[] = [
  {
    category: 'Exteriores',
    iconName: 'trees',
    items: [
      { name: 'Terraza', description: 'Con vistas panorámicas al Valle de Punilla' },
      { name: 'Jardín', description: 'Parque arbolado con vegetación serrana autóctona' },
    ],
  },
  {
    category: 'Actividades',
    iconName: 'mountain',
    items: [
      { name: 'Senderismo', description: 'Circuitos y paseos guiados en las sierras' },
      { name: 'Equitación', badge: 'De pago' },
      { name: 'Sala de juegos' },
      { name: 'Pesca', description: 'En ríos y diques de la región' },
    ],
  },
  {
    category: 'Comida y bebida',
    iconName: 'coffee',
    items: [
      { name: 'Cafetería en el alojamiento' },
      { name: 'Bar', description: 'Bebidas y aperitivos de autor' },
      { name: 'Restaurante', description: 'Cocina regional y tradicional de las sierras' },
      { name: 'Buffet para niños' },
      { name: 'Menú para niños' },
      { name: 'Menús para dietas especiales', badge: 'Bajo petición' },
    ],
  },
  {
    category: 'Internet',
    iconName: 'wifi',
    items: [
      { name: 'Conexión a internet Wi-Fi en habitaciones', badge: 'Gratis' },
      { name: 'Wi-Fi en áreas comunes', badge: 'Gratis' },
    ],
  },
  {
    category: 'Aparcamiento',
    iconName: 'car',
    items: [
      { name: 'Parking privado gratuito en el establecimiento', badge: 'Gratis', description: 'No es necesario reservar' },
      { name: 'Cocheras cubiertas individuales' },
    ],
  },
  {
    category: 'Servicios de Hotelería',
    iconName: 'sparkles',
    items: [
      { name: 'Servicio de limpieza diario' },
      { name: 'Información turística oficial' },
      { name: 'Registro de entrada y salida exprés' },
      { name: 'Guardaequipaje' },
      { name: 'Zona TV / salón de uso compartido' },
      { name: 'Servicio de lavandería', badge: 'De pago' },
      { name: 'Centro de negocios', badge: 'De pago' },
      { name: 'Salas de reuniones / banquetes', badge: 'De pago' },
      { name: 'Fax / fotocopiadora', badge: 'De pago' },
    ],
  },
  {
    category: 'Seguridad',
    iconName: 'shield',
    items: [
      { name: 'Extintores' },
      { name: 'Cámaras de seguridad fuera del alojamiento' },
      { name: 'Detectores de humo' },
      { name: 'Tarjeta de acceso / Llave de acceso' },
      { name: 'Caja fuerte' },
    ],
  },
  {
    category: 'General & Accesibilidad',
    iconName: 'door-open',
    items: [
      { name: 'Aire acondicionado frío/calor' },
      { name: 'Calefacción' },
      { name: 'Habitaciones familiares' },
      { name: 'Habitaciones sin humo' },
      { name: 'Accesibilidad en silla de ruedas', description: 'Algunas unidades son accesibles' },
      { name: 'Zona de fumadores' },
    ],
  },
  {
    category: 'Piscina al aire libre',
    iconName: 'waves',
    items: [
      { name: 'Piscina climatizada', description: 'Abierta todo el año' },
      { name: 'Piscina con vistas a las sierras' },
      { name: 'Zona poco profunda' },
      { name: 'Cubierta para piscina' },
      { name: 'Tumbonas / sillas de playa', badge: 'Gratis' },
      { name: 'Piscina de uso exclusivo', badge: 'De pago' },
    ],
  },
  {
    category: 'Bienestar & Spa',
    iconName: 'heart',
    items: [
      { name: 'Bañera de hidromasaje / jacuzzi' },
      { name: 'Baños termales' },
      { name: 'Sombrillas de playa y jardín' },
      { name: 'Tumbonas / reposeras de relajación' },
    ],
  },
  {
    category: 'Idiomas que se hablan',
    iconName: 'languages',
    items: [
      { name: 'Español' },
      { name: 'Inglés' },
      { name: 'Portugués' },
    ],
  },
];