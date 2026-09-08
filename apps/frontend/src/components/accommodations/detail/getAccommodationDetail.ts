import type { MapPlace } from '../../../data/mock-places';
import type { AccommodationDetailData } from './types';

export function getAccommodationDetail(place: MapPlace): AccommodationDetailData {
  // Exact 5-photo bento imagery matching the visual comp
  const gallery = [
    '/images/detail/bento-1-terrace.jpg',
    '/images/detail/bento-2-pool.jpg',
    '/images/detail/bento-3-grill.jpg',
    '/images/detail/bento-4-living.jpg',
    '/images/detail/bento-5-exterior.jpg',
  ];

  return {
    ...place,
    gallery,
    fullDescription: [
      'Cabañas Valle del Sol is an luxury rustic mountain cabin rental. 5-photo terrace. Construction and modern amenities to provide private vacation in Capilla del Monte, Cordoba, Argentina.',
      'El predio cuenta con parque nativo de algarrobos y espinillos, piscina con solárium atérmico y asador techado individual provisto con leña de cortesía para disfrutar del atardecer cordobés.',
      'Un ambiente pensado para el descanso profundo, con tranquilidad absoluta, privacidad entre unidades y acceso directo a los principales senderos y balnearios del valle.'
    ],
    host: {
      name: 'Familia Rossi — Prestadores Habilitados',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      badgeText: 'Habilitación Municipal N° 412/2023',
      responseTime: 'Responde en menos de 1 hora',
      yearsHosting: 8,
      verified: true,
    },
    bedrooms: [
      {
        name: 'Dormitorio Principal',
        beds: '1 Cama King Size (sommier)',
        description: 'Ventanal con vista directa a las sierras, placard embutido y calefacción.',
      },
      {
        name: 'Segundo Dormitorio',
        beds: '2 Camas Individuales',
        description: 'Ropa blanca de puro algodón, colchones de alta densidad y cortinas blackout.',
      },
    ],
    amenityCategories: [
      {
        category: 'Climatización & Calidez',
        items: [
          { label: 'Hogar a leña / Salamandra nórdica', iconName: 'flame' },
          { label: 'Aire acondicionado frío/calor', iconName: 'wind' },
        ],
      },
      {
        category: 'Exteriores & Vistas',
        items: [
          { label: 'Piscina con solárium cercado', iconName: 'waves' },
          { label: 'Asador techado con leña de cortesía', iconName: 'flame' },
          { label: 'Parque arbolado con vegetación autóctona', iconName: 'trees' },
        ],
      },
      {
        category: 'Conectividad & Cocina',
        items: [
          { label: 'WiFi de alta velocidad por fibra óptica', iconName: 'wifi' },
          { label: 'Cocina 4 hornallas, horno y microondas', iconName: 'utensils' },
          { label: 'Cafetera, pava eléctrica y vajilla completa', iconName: 'coffee' },
        ],
      },
      {
        category: 'Seguridad & Estacionamiento',
        items: [
          { label: 'Cochera individual cubierta', iconName: 'car' },
          { label: 'Predio perimetrado con portón automático', iconName: 'shield' },
        ],
      },
    ],
    rules: {
      checkIn: '14:00 hs',
      checkOut: '10:00 hs',
      petPolicy: 'Mascotas bienvenidas previa consulta y aviso (parque amplio)',
      quietHours: 'Horas de descanso de 23:00 a 08:00 hs',
      cancellation: 'Cancelación flexible hasta 7 días antes de la fecha de ingreso',
    },
    depositPercent: 50,
  };
}
