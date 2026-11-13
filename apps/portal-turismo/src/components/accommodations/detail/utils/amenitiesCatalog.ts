import React from 'react';
import {
  Wifi,
  Waves,
  Flame,
  Trees,
  Mountain,
  UtensilsCrossed,
  CircleParking,
  Wind,
  Coffee,
  ShieldCheck,
  Sparkles,
  Bath,
  Dog,
  Tv,
  BedDouble,
  Sofa,
  Check,
} from 'lucide-react';

export interface AmenityDisplayItem {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  categoryTitle: string;
  badge?: 'Incluido' | 'Bajo petición' | 'Opcional';
  isVerified: boolean;
}

export interface AmenityCategoryDisplay {
  title: string;
  icon: React.ElementType;
  items: AmenityDisplayItem[];
}

interface AmenityRule {
  keywords: string[];
  canonicalName: string;
  description: string;
  category: string;
  icon: React.ElementType;
  categoryIcon: React.ElementType;
}

const AMENITY_RULES: AmenityRule[] = [
  // Climatización y Confort
  {
    keywords: ['hogar', 'leña', 'salamandra'],
    canonicalName: 'Hogar a leña / Salamandra nórdica',
    description: 'Calefacción rústica tradicional de montaña con provisión de leña seca.',
    category: 'Climatización y Confort',
    icon: Flame,
    categoryIcon: Flame,
  },
  {
    keywords: ['aire', 'clima', 'acondicionador', 'split'],
    canonicalName: 'Aire acondicionado frío/calor',
    description: 'Control de temperatura individual para invierno y verano.',
    category: 'Climatización y Confort',
    icon: Wind,
    categoryIcon: Flame,
  },
  {
    keywords: ['calefacción', 'calefaccion', 'tiro balanceado', 'radiador', 'estufa'],
    canonicalName: 'Calefacción central / tiro balanceado',
    description: 'Instalación de tiro balanceado a gas o calefacción central permanente.',
    category: 'Climatización y Confort',
    icon: Flame,
    categoryIcon: Flame,
  },
  {
    keywords: ['ventilador'],
    canonicalName: 'Ventilador de techo silencioso',
    description: 'Ventilación fresca para jornadas cálidas en dormitorios y living.',
    category: 'Climatización y Confort',
    icon: Wind,
    categoryIcon: Flame,
  },

  // Exteriores y Vistas Serranas
  {
    keywords: ['piscina', 'pileta', 'solarium', 'solárium', 'bio-piscina'],
    canonicalName: 'Piscina y solárium serrano',
    description: 'Parque acuático con cerco perimetral de seguridad, reposeras y vista abierta.',
    category: 'Exteriores y Vistas Serranas',
    icon: Waves,
    categoryIcon: Trees,
  },
  {
    keywords: ['asador', 'parrilla', 'quincho'],
    canonicalName: 'Asador / Parrilla individual',
    description: 'Parrilla privada con set de cubiertos para asado y mesada.',
    category: 'Exteriores y Vistas Serranas',
    icon: Flame,
    categoryIcon: Trees,
  },
  {
    keywords: ['vista', 'uritorco', 'panorámica', 'panoramica'],
    canonicalName: 'Vistas panorámicas al Uritorco',
    description: 'Orientación privilegiada hacia el cordón de las Sierras Chicas y el cerro.',
    category: 'Exteriores y Vistas Serranas',
    icon: Mountain,
    categoryIcon: Trees,
  },
  {
    keywords: ['parque', 'jardín', 'jardin', 'arbolado', 'botánico', 'botanico', 'arroyo'],
    canonicalName: 'Parque arbolado y vegetación autóctona',
    description: 'Espacio verde con molles, chañares y sombra natural para descanso.',
    category: 'Exteriores y Vistas Serranas',
    icon: Trees,
    categoryIcon: Trees,
  },
  {
    keywords: ['deck', 'terraza', 'balcón', 'balcon', 'galería', 'galeria'],
    canonicalName: 'Deck / Terraza exterior privada',
    description: 'Mirador de madera elevado para contemplar atardeceres y estrellas.',
    category: 'Exteriores y Vistas Serranas',
    icon: Mountain,
    categoryIcon: Trees,
  },
  {
    keywords: ['pet', 'mascota', 'perro'],
    canonicalName: 'Pet Friendly (Acepta mascotas)',
    description: 'Alojamiento apto para mascotas con previo aviso y espacio cercado.',
    category: 'Exteriores y Vistas Serranas',
    icon: Dog,
    categoryIcon: Trees,
  },

  // Conectividad y Cocina
  {
    keywords: ['wifi', 'wi-fi', 'internet', 'starlink', 'fibra'],
    canonicalName: 'Wi-Fi de alta velocidad (Fibra / Starlink)',
    description: 'Conexión estable apta para streaming y trabajo remoto en las sierras.',
    category: 'Conectividad y Cocina',
    icon: Wifi,
    categoryIcon: Wifi,
  },
  {
    keywords: ['cocina', 'horno', 'vajilla', 'anafe'],
    canonicalName: 'Cocina equipada completa',
    description: 'Horno, anafe, vajilla completa, batería de cocina y elementos básicos.',
    category: 'Conectividad y Cocina',
    icon: UtensilsCrossed,
    categoryIcon: Wifi,
  },
  {
    keywords: ['heladera', 'freezer', 'microondas'],
    canonicalName: 'Heladera con freezer y microondas',
    description: 'Electrodomésticos para conservación de alimentos y comodidad familiar.',
    category: 'Conectividad y Cocina',
    icon: UtensilsCrossed,
    categoryIcon: Wifi,
  },
  {
    keywords: ['desayuno', 'café', 'cafe'],
    canonicalName: 'Desayuno serrano casero',
    description: 'Servicio con dulces artesanales regionales, panes de masa madre e infusiones.',
    category: 'Conectividad y Cocina',
    icon: Coffee,
    categoryIcon: Wifi,
  },
  {
    keywords: ['tv', 'televisor', 'smart', 'cable'],
    canonicalName: 'Smart TV con streaming / cable',
    description: 'Pantalla plana en el living o dormitorio principal.',
    category: 'Conectividad y Cocina',
    icon: Tv,
    categoryIcon: Wifi,
  },

  // Seguridad y Servicios
  {
    keywords: ['cochera', 'parking', 'estacionamiento', 'garage'],
    canonicalName: 'Cochera individual cubierta',
    description: 'Espacio protegido para vehículo dentro del predio del complejo.',
    category: 'Seguridad y Servicios',
    icon: CircleParking,
    categoryIcon: ShieldCheck,
  },
  {
    keywords: ['ropa blanca', 'toalla', 'sábanas', 'sabanas'],
    canonicalName: 'Ropa blanca y toallas incluidas',
    description: 'Juego completo de sábanas y toallas sanitizadas al ingreso.',
    category: 'Seguridad y Servicios',
    icon: Sparkles,
    categoryIcon: ShieldCheck,
  },
  {
    keywords: ['seguridad', 'perimetrado', 'alarma', 'portón', 'porton'],
    canonicalName: 'Predio perimetrado con portón seguro',
    description: 'Acceso privado exclusivo para huéspedes y mayor tranquilidad.',
    category: 'Seguridad y Servicios',
    icon: ShieldCheck,
    categoryIcon: ShieldCheck,
  },
  {
    keywords: ['baño', 'bano', 'ducha', 'hidromasaje'],
    canonicalName: 'Baño privado completo',
    description: 'Ducha con agua caliente presurizada las 24 horas y amenidades básicas.',
    category: 'Seguridad y Servicios',
    icon: Bath,
    categoryIcon: ShieldCheck,
  },
];

/**
 * Standard fallbacks for the 8-grid when properties list fewer amenities
 */
const DEFAULT_BASELINE_SERVICES: AmenityDisplayItem[] = [
  {
    id: 'base-wifi',
    name: 'Wi-Fi gratuito',
    description: 'Conexión a internet en el establecimiento.',
    icon: Wifi,
    categoryTitle: 'Conectividad y Cocina',
    badge: 'Incluido',
    isVerified: true,
  },
  {
    id: 'base-cocina',
    name: 'Cocina / Asador',
    description: 'Espacio para preparación de comidas y asados.',
    icon: UtensilsCrossed,
    categoryTitle: 'Conectividad y Cocina',
    badge: 'Incluido',
    isVerified: true,
  },
  {
    id: 'base-bano',
    name: 'Baño privado',
    description: 'Baño completo dentro de la unidad.',
    icon: Bath,
    categoryTitle: 'Seguridad y Servicios',
    badge: 'Incluido',
    isVerified: true,
  },
  {
    id: 'base-cochera',
    name: 'Cochera gratuita',
    description: 'Estacionamiento individual dentro del predio.',
    icon: CircleParking,
    categoryTitle: 'Seguridad y Servicios',
    badge: 'Incluido',
    isVerified: true,
  },
  {
    id: 'base-dormitorios',
    name: 'Dormitorios equipados',
    description: 'Camas confortables y ropa blanca provista.',
    icon: BedDouble,
    categoryTitle: 'Climatización y Confort',
    badge: 'Incluido',
    isVerified: true,
  },
  {
    id: 'base-living',
    name: 'Living / Estar',
    description: 'Ambiente de relax y calidez hogareña.',
    icon: Sofa,
    categoryTitle: 'Climatización y Confort',
    badge: 'Incluido',
    isVerified: true,
  },
  {
    id: 'base-vistas',
    name: 'Entorno serrano',
    description: 'Vistas a las sierras y aire puro de montaña.',
    icon: Mountain,
    categoryTitle: 'Exteriores y Vistas Serranas',
    badge: 'Incluido',
    isVerified: true,
  },
  {
    id: 'base-seguridad',
    name: 'Acceso seguro',
    description: 'Predio privado y tranquilo para familias.',
    icon: ShieldCheck,
    categoryTitle: 'Seguridad y Servicios',
    badge: 'Incluido',
    isVerified: true,
  },
];

/**
 * Match a raw amenity string from backend or host input against standard rules
 */
export function matchAmenityRule(rawAmenity: string): AmenityRule | null {
  const normalized = rawAmenity.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const rule of AMENITY_RULES) {
    if (rule.keywords.some((kw) => normalized.includes(kw))) {
      return rule;
    }
  }
  return null;
}

/**
 * Derives a full categorized catalog specifically for the accommodation
 */
export function getAccommodationAmenitiesCatalog(
  rawAmenities: string[] = [],
  hasBreakfast?: boolean,
): AmenityCategoryDisplay[] {
  const pool = [...rawAmenities];
  if (hasBreakfast && !pool.some((a) => a.toLowerCase().includes('desayuno'))) {
    pool.push('Desayuno serrano casero');
  }

  const categoryMap = new Map<string, { icon: React.ElementType; items: AmenityDisplayItem[] }>();

  // Initialize canonical categories
  categoryMap.set('Climatización y Confort', { icon: Flame, items: [] });
  categoryMap.set('Exteriores y Vistas Serranas', { icon: Trees, items: [] });
  categoryMap.set('Conectividad y Cocina', { icon: Wifi, items: [] });
  categoryMap.set('Seguridad y Servicios', { icon: ShieldCheck, items: [] });

  const seenKeys = new Set<string>();

  for (const raw of pool) {
    if (!raw || typeof raw !== 'string' || !raw.trim()) continue;
    const trimmed = raw.trim();
    const rule = matchAmenityRule(trimmed);

    if (rule) {
      if (seenKeys.has(rule.canonicalName)) continue;
      seenKeys.add(rule.canonicalName);

      const group = categoryMap.get(rule.category)!;
      group.items.push({
        id: `amenity-${rule.canonicalName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: rule.canonicalName,
        description: rule.description,
        icon: rule.icon,
        categoryTitle: rule.category,
        badge: 'Incluido',
        isVerified: true,
      });
    } else {
      // Custom / specific amenity entered by host
      if (seenKeys.has(trimmed.toLowerCase())) continue;
      seenKeys.add(trimmed.toLowerCase());

      const group = categoryMap.get('Seguridad y Servicios')!;
      group.items.push({
        id: `amenity-custom-${trimmed.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: trimmed,
        description: 'Servicio verificado provisto por el anfitrión.',
        icon: Check,
        categoryTitle: 'Seguridad y Servicios',
        badge: 'Incluido',
        isVerified: true,
      });
    }
  }

  // Filter out empty categories
  const result: AmenityCategoryDisplay[] = [];
  categoryMap.forEach((val, title) => {
    if (val.items.length > 0) {
      result.push({
        title,
        icon: val.icon,
        items: val.items,
      });
    }
  });

  return result;
}

/**
 * Returns 8 featured amenities dynamically selected for the main center grid
 */
export function getFeaturedAmenitiesGrid(
  rawAmenities: string[] = [],
  hasBreakfast?: boolean,
): AmenityDisplayItem[] {
  const catalog = getAccommodationAmenitiesCatalog(rawAmenities, hasBreakfast);
  const matchedItems: AmenityDisplayItem[] = [];

  for (const cat of catalog) {
    for (const item of cat.items) {
      matchedItems.push(item);
    }
  }

  if (matchedItems.length >= 8) {
    return matchedItems.slice(0, 8);
  }

  // Complement with baseline standard services if property has fewer than 8 explicit amenities
  const combined = [...matchedItems];
  for (const baseline of DEFAULT_BASELINE_SERVICES) {
    if (combined.length >= 8) break;
    const alreadyExists = combined.some(
      (m) => m.name.toLowerCase().includes(baseline.name.toLowerCase()) || baseline.name.toLowerCase().includes(m.name.toLowerCase()),
    );
    if (!alreadyExists) {
      combined.push(baseline);
    }
  }

  return combined.slice(0, 8);
}
