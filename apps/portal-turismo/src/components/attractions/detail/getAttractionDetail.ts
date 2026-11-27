import type { AttractionItem } from '../types';
import { ATTRACTIONS_DATA } from '../data/attractions-data';
import { MOCK_PLACES } from '../../../data/mock-places';

const dynamicAttractionsMap = new Map<string, AttractionItem>();

export function registerDynamicAttractions(items: AttractionItem[]): void {
  for (const item of items) {
    if (item.id) dynamicAttractionsMap.set(item.id.toLowerCase().trim(), item);
    if (item.slug) dynamicAttractionsMap.set(item.slug.toLowerCase().trim(), item);
  }
}

export function getAttractionDetail(slugOrId: string): AttractionItem | undefined {
  if (!slugOrId) return undefined;
  const cleanKey = slugOrId.toLowerCase().trim();

  // Alias for historical heritage
  if (cleanKey === 'casonas') {
    return (
      dynamicAttractionsMap.get('calle-techada') ??
      ATTRACTIONS_DATA.find((item) => item.slug === 'calle-techada')
    );
  }

  if (dynamicAttractionsMap.has(cleanKey)) {
    return dynamicAttractionsMap.get(cleanKey);
  }

  const found = ATTRACTIONS_DATA.find(
    (item) => item.slug.toLowerCase() === cleanKey || item.id.toLowerCase() === cleanKey,
  );
  if (found) return found;

  // Fallback to MOCK_PLACES so there is never a missing-item flicker/redirect
  const mock = MOCK_PLACES.find(
    (p) =>
      p.type === 'attraction' &&
      (p.id.toLowerCase() === cleanKey ||
        p.ctaUrl.toLowerCase().endsWith('/' + cleanKey) ||
        p.title.toLowerCase().includes(cleanKey)),
  );

  if (mock) {
    return {
      id: mock.id,
      slug: mock.ctaUrl.split('/').pop() || mock.id,
      title: mock.title,
      subtitle: mock.subtitle,
      category: 'paseo',
      categoryLabel: mock.category,
      difficulty: (mock.difficulty as any) || 'Baja',
      rating: mock.rating || 4.8,
      reviewCount: mock.reviewCount || 120,
      coverImage: mock.imageUrl,
      galleryImages: mock.galleryImages || [mock.imageUrl],
      distanceFromCenter: mock.distanceFromCenter || '1.5 km',
      address: mock.address,
      coordinates: { lat: mock.lat, lng: mock.lng },
      overview: mock.subtitle,
      highlights: [
        'Entorno serrano natural protegido',
        'Acceso libre y señalizado',
        'Paseo recomendado por la Comisión de Turismo para toda la familia',
      ],
      trailSpecs: {
        elevationGainMeters: 40,
        maxElevationMsnm: 1020,
        distanceKm: 2.0,
        trailType: 'Paseo libre',
        estimatedDuration: mock.duration || '1 a 2 horas',
        terrainType: 'Senda serrana consolidada',
        guideRequired: false,
      },
      practicalInfo: {
        openingHours: '08:00 a 19:00 hs',
        admissionFee: 'Acceso libre',
        parking: 'Estacionamiento en el predio',
        accessHowTo: 'Acceso señalizado desde Capilla del Monte.',
        hydrationRequirement: 'Llevar agua para hidratación.',
        recommendedGear: ['Calzado cómodo', 'Protector solar y sombrero'],
        safetyWarnings: ['Cuidar el entorno natural y no arrojar residuos.'],
      },
      isTrekking: mock.difficulty === 'Alta' || mock.difficulty === 'Media',
      ctaUrl: mock.ctaUrl,
    };
  }

  return undefined;
}
