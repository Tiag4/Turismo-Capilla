import type { MapPlace } from '../../../data/mock-places';
import type { AccommodationDetailData } from './types';

export function getAccommodationDetail(place: MapPlace): AccommodationDetailData {
  // Use place image as hero and complementary high-res mountain hospitality photos
  const gallery = [
    place.imageUrl || '/images/detail/bento-1-terrace.jpg',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  ];

  return {
    ...place,
    gallery,
    fullDescription: [
      `${place.title} es un establecimiento habilitado oficialmente en la zona de ${place.zone || 'Capilla del Monte'}. ${place.subtitle}.`,
      'El predio cuenta con parque serrano con especies autóctonas, vistas panorámicas y comodidades para disfrutar del descanso al pie de las sierras cordobesas.',
      'Trato directo con los anfitriones, garantizando tarifa oficial transparente sin comisiones de intermediarios y asistencia durante toda la estadía.'
    ],
    host: {
      name: `${place.title} — Anfitrión Verificado`,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      badgeText: `Habilitación Municipal N° HAB-${(place.id.replace(/\D/g, '').slice(-4) || place.id.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase() || '1420')}/2024`,
      responseTime: 'Responde en menos de 2 horas',
      yearsHosting: 5,
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
    unitDetails: {
      title: 'Chalet de 2 dormitorios',
      capacityText: 'Capacidad: 2 a 5 personas (2 adultos base)',
      maxAdults: 4,
      maxChildren: 3,
      bedrooms: [
        { roomName: 'Dormitorio 1', bedDetails: '1 cama doble', isDouble: true },
        { roomName: 'Dormitorio 2', bedDetails: '3 camas individuales', isDouble: false },
      ],
      features: [
        'Chalet de montaña entero',
        '45 m²',
        'Cocina privada',
        'Baño en la habitación',
        'TV de pantalla plana',
      ],
    },
  };
}
