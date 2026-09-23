import type { Attraction } from '../../../services/api';
import type { AttractionCategory, AttractionDifficulty, AttractionItem } from '../types';
import { ATTRACTIONS_DATA } from '../data/attractions-data';
import { registerDynamicAttractions } from '../detail/getAttractionDetail';

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function resolveCategory(category: Attraction['category']): {
  category: AttractionCategory;
  categoryLabel: string;
  isTrekking: boolean;
} {
  switch (category) {
    case 'HILL':
      return {
        category: 'trekking',
        categoryLabel: 'Trekking & Cumbres',
        isTrekking: true,
      };
    case 'RIVER_BEACH':
      return {
        category: 'balneario',
        categoryLabel: 'Balnearios & Cascadas',
        isTrekking: false,
      };
    case 'CULTURAL':
      return {
        category: 'cultura',
        categoryLabel: 'Patrimonio Cultural',
        isTrekking: false,
      };
    case 'NIGHT':
      return {
        category: 'nocturno',
        categoryLabel: 'Paseos Nocturnos',
        isTrekking: false,
      };
    case 'NATURE_TRAIL':
      return {
        category: 'trekking',
        categoryLabel: 'Sendero Natural',
        isTrekking: true,
      };
    default:
      return {
        category: 'cultura',
        categoryLabel: 'Paseo Turístico',
        isTrekking: false,
      };
  }
}

function resolveDifficulty(rawDifficulty?: string | null): AttractionDifficulty {
  if (!rawDifficulty) return 'Baja';
  const lower = rawDifficulty.toLowerCase().trim();
  if (lower.includes('alt') || lower === 'high') return 'Alta';
  if (lower.includes('med') || lower === 'medium') return 'Media';
  return 'Baja';
}

export function mapApiToAttractionItem(apiItem: Attraction): AttractionItem {
  const generatedSlug = generateSlug(apiItem.name || 'atractivo');

  // Check if an existing mock item matches to preserve rich presentation fields
  const matchedMock = ATTRACTIONS_DATA.find(
    (mock) =>
      mock.id === apiItem.id ||
      mock.slug === generatedSlug ||
      mock.title.toLowerCase().includes(apiItem.name.toLowerCase()) ||
      apiItem.name.toLowerCase().includes(mock.title.toLowerCase()),
  );

  const categoryMeta = resolveCategory(apiItem.category);
  const difficulty = resolveDifficulty(apiItem.difficulty);

  const coverImage =
    apiItem.images?.[0]?.url ||
    matchedMock?.coverImage ||
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85';

  const galleryImages =
    apiItem.images && apiItem.images.length > 0
      ? apiItem.images.map((img) => img.url)
      : matchedMock?.galleryImages ?? [coverImage];

  const estimatedDuration =
    apiItem.estimatedDuration || matchedMock?.trailSpecs?.estimatedDuration || '1 a 2 horas';

  const slug = matchedMock?.slug || generatedSlug;

  const mappedItem: AttractionItem = {
    id: apiItem.id || matchedMock?.id || `att-${slug}`,
    slug,
    title: apiItem.name || matchedMock?.title || 'Atractivo Turístico',
    subtitle: apiItem.description || matchedMock?.subtitle || 'Paseo y atractivo en Capilla del Monte',
    category: categoryMeta.category,
    categoryLabel: categoryMeta.categoryLabel,
    difficulty,
    rating: matchedMock?.rating ?? 4.8,
    reviewCount: matchedMock?.reviewCount ?? 120,
    coverImage,
    galleryImages,
    distanceFromCenter: matchedMock?.distanceFromCenter ?? '3.5 km',
    address: apiItem.howToGet || matchedMock?.address || 'Capilla del Monte, Córdoba',
    coordinates: {
      lat: apiItem.latitude ?? matchedMock?.coordinates?.lat ?? -30.857,
      lng: apiItem.longitude ?? matchedMock?.coordinates?.lng ?? -64.515,
    },
    overview: apiItem.description || matchedMock?.overview || 'Atractivo natural y cultural serrano.',
    highlights: matchedMock?.highlights ?? [
      'Vistas panorámicas serranas de Capilla del Monte',
      'Acceso señalizado para visitantes y familias',
      'Entorno natural protegido y autóctono',
    ],
    trailSpecs: {
      elevationGainMeters: matchedMock?.trailSpecs?.elevationGainMeters,
      maxElevationMsnm: matchedMock?.trailSpecs?.maxElevationMsnm,
      distanceKm: matchedMock?.trailSpecs?.distanceKm,
      trailType: matchedMock?.trailSpecs?.trailType ?? 'Circuito cerrado',
      estimatedDuration,
      terrainType: matchedMock?.trailSpecs?.terrainType ?? 'Sendero serrano consolidado',
      guideRequired: apiItem.requiresGuide ?? matchedMock?.trailSpecs?.guideRequired ?? false,
    },
    practicalInfo: {
      openingHours: matchedMock?.practicalInfo?.openingHours ?? '08:00 a 19:00 hs',
      cutoffTime: matchedMock?.practicalInfo?.cutoffTime,
      admissionFee: apiItem.admissionFee
        ? `$${Number(apiItem.admissionFee).toLocaleString('es-AR')}`
        : (matchedMock?.practicalInfo?.admissionFee ?? 'Acceso libre y gratuito'),
      parking: matchedMock?.practicalInfo?.parking ?? 'Estacionamiento en el acceso',
      accessHowTo: apiItem.howToGet || matchedMock?.practicalInfo?.accessHowTo || 'Por caminos principales señalizados.',
      hydrationRequirement: matchedMock?.practicalInfo?.hydrationRequirement ?? '1 litro de agua por persona.',
      recommendedGear: matchedMock?.practicalInfo?.recommendedGear ?? [
        'Calzado cómodo para caminar',
        'Protector solar y gorra',
      ],
      safetyWarnings: matchedMock?.practicalInfo?.safetyWarnings ?? [],
    },
    isTrekking: categoryMeta.isTrekking,
    ctaUrl: `/atractivos/${slug}`,
  };

  return mappedItem;
}

export function mapApiToAttractionList(apiItems: Attraction[]): AttractionItem[] {
  const mapped = apiItems.map(mapApiToAttractionItem);
  registerDynamicAttractions(mapped);
  return mapped;
}
