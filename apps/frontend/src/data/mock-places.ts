export interface MapPlace {
  id: string;
  type: 'accommodation' | 'attraction';
  title: string;
  subtitle: string;
  category: string;
  lat: number;
  lng: number;
  pricePerNight?: number;
  difficulty?: 'Baja' | 'Media' | 'Alta';
  duration?: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  address: string;
  verified?: boolean;
  amenities?: string[];
  ctaUrl: string;
}

export const MOCK_PLACES: MapPlace[] = [
  // Alojamientos
  {
    id: 'acc-1',
    type: 'accommodation',
    title: 'Cabañas Valle del Sol',
    subtitle: 'Al pie del Uritorco con piscina climatizada',
    category: 'Cabaña de Montaña',
    lat: -30.8570,
    lng: -64.5150,
    pricePerNight: 95000,
    rating: 4.9,
    reviewCount: 38,
    imageUrl: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80',
    address: 'Camino a La Toma km 1.5',
    verified: true,
    amenities: ['Pileta', 'Asador', 'WiFi', 'Cochera'],
    ctaUrl: '/alojamientos/acc-1',
  },
  {
    id: 'acc-2',
    type: 'accommodation',
    title: 'Hostería Los Portales',
    subtitle: 'Arquitectura casona clásica en el centro histórico',
    category: 'Hostería & Suites',
    lat: -30.8620,
    lng: -64.5230,
    pricePerNight: 120000,
    rating: 4.8,
    reviewCount: 52,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    address: 'Av. Pueyrredón 320',
    verified: true,
    amenities: ['Desayuno casero', 'Jardín botánico', 'Calefacción central'],
    ctaUrl: '/alojamientos/acc-2',
  },
  {
    id: 'acc-3',
    type: 'accommodation',
    title: 'Refugio Serrano Altas Cumbres',
    subtitle: 'Vistas panorámicas de 360° al valle y Cerro Uritorco',
    category: 'Cabaña Exclusiva',
    lat: -30.8510,
    lng: -64.4980,
    pricePerNight: 145000,
    rating: 5.0,
    reviewCount: 24,
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    address: 'Ruta 38 y acceso norte',
    verified: true,
    amenities: ['Deck panorámico', 'Hidromasaje', 'Cocina equipada'],
    ctaUrl: '/alojamientos/acc-3',
  },
  {
    id: 'acc-4',
    type: 'accommodation',
    title: 'Casona Uritorco Boutique',
    subtitle: 'Espacio de desconexión, yoga y descanso serrano',
    category: 'Casona Histórica',
    lat: -30.8595,
    lng: -64.5270,
    pricePerNight: 110000,
    rating: 4.7,
    reviewCount: 41,
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    address: 'Calle Córdoba 180',
    verified: true,
    amenities: ['Spa', 'Piscina', 'Desayuno orgánico'],
    ctaUrl: '/alojamientos/acc-4',
  },

  // Atractivos y Paseos
  {
    id: 'att-1',
    type: 'attraction',
    title: 'Cerro Uritorco (1.979 msnm)',
    subtitle: 'El pico más alto de las Sierras Chicas y emblema místico',
    category: 'Trekking & Cumbre',
    lat: -30.8490,
    lng: -64.4780,
    difficulty: 'Alta',
    duration: '7 - 8 hs ida y vuelta',
    rating: 4.9,
    reviewCount: 412,
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    address: 'Base del Cerro Uritorco (La Toma)',
    ctaUrl: '/atractivos/uritorco',
  },
  {
    id: 'att-2',
    type: 'attraction',
    title: 'Parque Los Terrones',
    subtitle: 'Formaciones de arenisca rojiza con cañadones y bosques de altura',
    category: 'Parque Natural',
    lat: -30.7760,
    lng: -64.5210,
    difficulty: 'Media',
    duration: '2 - 3 hs circuito guiado',
    rating: 4.9,
    reviewCount: 295,
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    address: 'Ruta 38 km 88',
    ctaUrl: '/atractivos/los-terrones',
  },
  {
    id: 'att-3',
    type: 'attraction',
    title: 'Geoforma El Zapato',
    subtitle: 'Mirador panorámico con la famosa roca esculpida por el viento',
    category: 'Mirador Urbano',
    lat: -30.8655,
    lng: -64.5420,
    difficulty: 'Baja',
    duration: '1 h',
    rating: 4.6,
    reviewCount: 180,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    address: 'Acceso El Zapato, a 1 km del centro',
    ctaUrl: '/atractivos/el-zapato',
  },
  {
    id: 'att-4',
    type: 'attraction',
    title: 'Dique El Cajón',
    subtitle: 'Espejo de agua rodeado de paredones rocosos y actividades náuticas',
    category: 'Lago & Dique',
    lat: -30.8540,
    lng: -64.5510,
    difficulty: 'Baja',
    duration: '2 hs',
    rating: 4.7,
    reviewCount: 154,
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    address: 'Av. Las Gemelas y Perilago',
    ctaUrl: '/atractivos/dique-el-cajon',
  },
  {
    id: 'att-5',
    type: 'attraction',
    title: 'Balneario La Toma',
    subtitle: 'Cascadas de agua pura sobre ollas de piedra y arena natural',
    category: 'Río & Balneario',
    lat: -30.8550,
    lng: -64.5020,
    difficulty: 'Baja',
    duration: 'Libre',
    rating: 4.8,
    reviewCount: 220,
    imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80',
    address: 'A 3 km del centro de Capilla',
    ctaUrl: '/atractivos/la-toma',
  },
];