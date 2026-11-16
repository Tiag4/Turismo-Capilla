import type { ReviewItem, ReviewAspect } from '../types';

export const REVIEW_ASPECT_OPTIONS: ReviewAspect[] = [
  'Limpieza impecable',
  'Atención del anfitrión',
  'Tranquilidad serrana',
  'Comodidades y equipamiento',
  'Ubicación y vistas',
  'Relación precio-calidad',
];

export const INITIAL_ACCOMMODATION_REVIEWS: Record<string, ReviewItem[]> = {
  'acc-1': [
    {
      id: 'rev-101',
      accommodationId: 'acc-1',
      authorName: 'Mariana Gómez',
      authorOrigin: 'Rosario, Santa Fe',
      stayDate: 'Septiembre 2026',
      rating: 5,
      comment:
        'Una experiencia hermosa al pie del Uritorco. La cabaña impecable, con todo lo necesario para cocinar y descansar. La pileta climatizada fue un diferencial enorme para disfrutar a la vuelta de las caminatas.',
      aspects: ['Limpieza impecable', 'Comodidades y equipamiento', 'Ubicación y vistas'],
      verifiedBooking: true,
      bookingCode: 'CAP-2026-4812',
      createdAt: '2026-09-18T14:30:00Z',
    },
    {
      id: 'rev-102',
      accommodationId: 'acc-1',
      authorName: 'Federico Luján',
      authorOrigin: 'CABA, Buenos Aires',
      stayDate: 'Agosto 2026',
      rating: 5,
      comment:
        'Excelente atención de los dueños desde que llegamos. El predio es súper silencioso de noche, ideal para desconectar del ruido de la ciudad. El WiFi funcionó perfecto incluso para trabajar un par de horas.',
      aspects: ['Atención del anfitrión', 'Tranquilidad serrana', 'Relación precio-calidad'],
      verifiedBooking: true,
      bookingCode: 'CAP-2026-3904',
      createdAt: '2026-08-25T10:15:00Z',
    },
    {
      id: 'rev-103',
      accommodationId: 'acc-1',
      authorName: 'Lucía y Martín',
      authorOrigin: 'Córdoba Capital',
      stayDate: 'Julio 2026',
      rating: 4,
      comment:
        'Muy linda cabaña y excelente ubicación cerquita del acceso a La Toma. El asador individual techado es comodísimo y nos dejaron leña lista para usar. Volveríamos sin dudarlo.',
      aspects: ['Ubicación y vistas', 'Comodidades y equipamiento'],
      verifiedBooking: false,
      createdAt: '2026-07-19T19:00:00Z',
    },
  ],
  'acc-2': [
    {
      id: 'rev-201',
      accommodationId: 'acc-2',
      authorName: 'Roberto Echeverría',
      authorOrigin: 'Mendoza',
      stayDate: 'Septiembre 2026',
      rating: 5,
      comment:
        'La casona tiene un encanto histórico único y está conservada con muchísimo cariño. El desayuno serrano con pan casero y dulces regionales es espectacular.',
      aspects: ['Atención del anfitrión', 'Limpieza impecable', 'Ubicación y vistas'],
      verifiedBooking: true,
      bookingCode: 'CAP-2026-5102',
      createdAt: '2026-09-10T11:20:00Z',
    },
    {
      id: 'rev-202',
      accommodationId: 'acc-2',
      authorName: 'Clara Benítez',
      authorOrigin: 'Santa Fe',
      stayDate: 'Agosto 2026',
      rating: 5,
      comment:
        'Ubicación inmejorable para moverse a pie por el casco histórico y la calle techada. Las habitaciones son amplias, cálidas y el jardín interno transmite mucha paz.',
      aspects: ['Tranquilidad serrana', 'Limpieza impecable', 'Relación precio-calidad'],
      verifiedBooking: true,
      bookingCode: 'CAP-2026-3319',
      createdAt: '2026-08-12T16:40:00Z',
    },
  ],
  'acc-3': [
    {
      id: 'rev-301',
      accommodationId: 'acc-3',
      authorName: 'Valentina Torres',
      authorOrigin: 'Pilar, Buenos Aires',
      stayDate: 'Septiembre 2026',
      rating: 5,
      comment:
        'El atardecer desde el deck panorámico mirando el Uritorco no tiene precio. Todo el equipamiento es de primera calidad y la privacidad del refugio es absoluta.',
      aspects: ['Ubicación y vistas', 'Tranquilidad serrana', 'Comodidades y equipamiento'],
      verifiedBooking: true,
      bookingCode: 'CAP-2026-6021',
      createdAt: '2026-09-22T09:45:00Z',
    },
  ],
};

export function getDefaultReviewsForAccommodation(accommodationId: string, accommodationTitle: string): ReviewItem[] {
  if (INITIAL_ACCOMMODATION_REVIEWS[accommodationId]) {
    return INITIAL_ACCOMMODATION_REVIEWS[accommodationId];
  }

  return [
    {
      id: `rev-default-1-${accommodationId}`,
      accommodationId,
      authorName: 'Sofía Pellegrini',
      authorOrigin: 'Villa Carlos Paz, Córdoba',
      stayDate: 'Septiembre 2026',
      rating: 5,
      comment: `Hermosa estadía en ${accommodationTitle}. La limpieza, la calidez de los anfitriones y la tranquilidad del entorno hicieron que descansáramos de verdad. Totalmente recomendable.`,
      aspects: ['Limpieza impecable', 'Atención del anfitrión', 'Tranquilidad serrana'],
      verifiedBooking: true,
      bookingCode: 'CAP-2026-4120',
      createdAt: '2026-09-14T12:00:00Z',
    },
    {
      id: `rev-default-2-${accommodationId}`,
      accommodationId,
      authorName: 'Gonzalo Ríos',
      authorOrigin: 'Rosario, Santa Fe',
      stayDate: 'Agosto 2026',
      rating: 5,
      comment:
        'Todo tal cual las fotos. Las camas súper cómodas, buena calefacción para las noches frescas de la sierra y excelente predisposición para recomendarnos senderos y lugares para comer.',
      aspects: ['Comodidades y equipamiento', 'Atención del anfitrión', 'Relación precio-calidad'],
      verifiedBooking: true,
      bookingCode: 'CAP-2026-2890',
      createdAt: '2026-08-20T18:30:00Z',
    },
  ];
}
