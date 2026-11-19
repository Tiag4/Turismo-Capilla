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

function isRealLocalImage(url?: string | null): boolean {
  if (!url) return false;
  return url.startsWith('/images/') || (!url.includes('unsplash.com') && !url.startsWith('http://') && !url.startsWith('https://'));
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

  const apiCover = apiItem.images?.[0]?.url;
  const mockCover = matchedMock?.coverImage;
  const isValidApiCover = Boolean(apiCover && !apiCover.includes('unsplash.com'));

  // Priorizar siempre fotos reales cargadas desde el CMS; usar fallback local solo si la API no tiene foto válida
  const coverImage =
    (isValidApiCover ? apiCover : null) ||
    (isRealLocalImage(mockCover) ? mockCover : null) ||
    apiCover ||
    mockCover ||
    '/images/attractions/uritorco/uritorco-01.jpg';

  const validApiGallery = (apiItem.images ?? [])
    .map((img) => img.url)
    .filter((url) => Boolean(url) && !url.includes('unsplash.com'));

  const galleryImages =
    validApiGallery.length > 0
      ? validApiGallery
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
    highlights:
      apiItem.highlights && apiItem.highlights.length > 0
        ? apiItem.highlights
        : (matchedMock?.highlights ?? [
            'Vistas panorámicas serranas de Capilla del Monte',
            'Acceso señalizado para visitantes y familias',
            'Entorno natural protegido y autóctono',
          ]),
    trailSpecs: {
      elevationGainMeters:
        apiItem.elevationGainMeters !== undefined && apiItem.elevationGainMeters !== null
          ? apiItem.elevationGainMeters
          : matchedMock?.trailSpecs?.elevationGainMeters,
      maxElevationMsnm:
        apiItem.maxElevationMsnm !== undefined && apiItem.maxElevationMsnm !== null
          ? apiItem.maxElevationMsnm
          : matchedMock?.trailSpecs?.maxElevationMsnm,
      distanceKm:
        apiItem.distanceKm !== undefined && apiItem.distanceKm !== null
          ? apiItem.distanceKm
          : matchedMock?.trailSpecs?.distanceKm,
      trailType:
        (apiItem.trailType as any) || matchedMock?.trailSpecs?.trailType || 'Circuito cerrado',
      estimatedDuration,
      terrainType:
        apiItem.terrainType || matchedMock?.trailSpecs?.terrainType || 'Sendero serrano consolidado',
      guideRequired: apiItem.requiresGuide ?? matchedMock?.trailSpecs?.guideRequired ?? false,
    },
    practicalInfo: {
      openingHours:
        apiItem.openingHours || matchedMock?.practicalInfo?.openingHours || '08:00 a 19:00 hs',
      cutoffTime: apiItem.cutoffTime || matchedMock?.practicalInfo?.cutoffTime,
      admissionFee: apiItem.admissionFee
        ? `$${Number(apiItem.admissionFee).toLocaleString('es-AR')}`
        : (matchedMock?.practicalInfo?.admissionFee ?? 'Acceso libre y gratuito'),
      parking: matchedMock?.practicalInfo?.parking ?? 'Estacionamiento en el acceso',
      accessHowTo: apiItem.howToGet || matchedMock?.practicalInfo?.accessHowTo || 'Por caminos principales señalizados.',
      hydrationRequirement:
        apiItem.hydrationRequirement ||
        matchedMock?.practicalInfo?.hydrationRequirement ||
        '1 litro de agua por persona.',
      recommendedGear:
        apiItem.recommendedGear && apiItem.recommendedGear.length > 0
          ? apiItem.recommendedGear
          : (matchedMock?.practicalInfo?.recommendedGear ?? [
              'Calzado cómodo para caminata',
              'Protector solar y agua fresca',
            ]),
      safetyWarnings:
        apiItem.safetyWarnings && apiItem.safetyWarnings.length > 0
          ? apiItem.safetyWarnings
          : (matchedMock?.practicalInfo?.safetyWarnings ?? [
              'Respetar las indicaciones de los guardaparques y personal municipal.',
            ]),
    },
    isTrekking: categoryMeta.isTrekking,
    ctaUrl: `/atractivos/${slug}`,
    status: apiItem.status || matchedMock?.status || 'OPEN',
    statusNotice: apiItem.statusNotice ?? matchedMock?.statusNotice ?? null,
    isFeatured: typeof apiItem.isFeatured === 'boolean' ? apiItem.isFeatured : Boolean(matchedMock?.isFeatured ?? false),
    featuredBadgeTheme: (apiItem.featuredBadgeTheme as 'DARK' | 'LIGHT') || 'DARK',
  };

  return mappedItem;
}

export function mapApiToAttractionList(apiItems: Attraction[]): AttractionItem[] {
  const mapped = apiItems.map(mapApiToAttractionItem);
  registerDynamicAttractions(mapped);
  return mapped;
}
