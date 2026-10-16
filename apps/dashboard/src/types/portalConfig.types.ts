export interface HomeSectionItem {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'content' | 'marketing';
}

export interface PortalCMSConfig {
  sectionsOrder: string[];
  sectionsVisibility: Record<string, boolean>;
  heroConfig: {
    title: string;
    subtitle: string;
  };
}

export const CANONICAL_HOME_SECTIONS: HomeSectionItem[] = [
  {
    id: 'hero',
    name: 'Portada y Buscador (Hero)',
    description: 'Fotografía panorámica, título de impacto y buscador integrado de cabañas.',
    category: 'core',
  },
  {
    id: 'duoAccess',
    name: 'Acceso Dual (Paseos & Alojamientos)',
    description: 'Tarjetas de bifurcación rápida hacia catálogo de cabañas o paseos.',
    category: 'core',
  },
  {
    id: 'culturalAgenda',
    name: 'Agenda Cultural y Eventos (#76)',
    description: 'Festivales, peñas, teatro y ferias comunitarias de Capilla del Monte.',
    category: 'content',
  },
  {
    id: 'featuredAttractions',
    name: 'Atractivos Turísticos Destacados',
    description: 'Paseos naturales, Los Terrones, El Zapato y balnearios serranos.',
    category: 'content',
  },
  {
    id: 'uritorcoHighlight',
    name: 'Bloque Especial Cerro Uritorco',
    description: 'Datos técnicos, senderos de ascenso e información de seguridad.',
    category: 'content',
  },
  {
    id: 'astrotourismTeaser',
    name: 'Astroturismo y Cielos Limpios',
    description: 'Experiencia nocturna, cielo oscuro certificado y miradores astronómicos.',
    category: 'content',
  },
  {
    id: 'featuredCabins',
    name: 'Cabañas y Alojamientos Destacados',
    description: 'Establecimientos con disponibilidad y tarifas verificadas oficialmente.',
    category: 'marketing',
  },
  {
    id: 'valleyMap',
    name: 'Mapa del Valle de Punilla',
    description: 'Ubicación geográfica de puntos de interés y accesos terrestres.',
    category: 'marketing',
  },
  {
    id: 'finalCta',
    name: 'Pie Promocional de Cierre',
    description: 'Llamado a la acción para planificar la estadía en Capilla del Monte.',
    category: 'marketing',
  },
];

export const DEFAULT_PORTAL_CONFIG: PortalCMSConfig = {
  sectionsOrder: [
    'hero',
    'duoAccess',
    'culturalAgenda',
    'featuredAttractions',
    'uritorcoHighlight',
    'astrotourismTeaser',
    'featuredCabins',
    'valleyMap',
    'finalCta',
  ],
  sectionsVisibility: {
    hero: true,
    duoAccess: true,
    culturalAgenda: true,
    featuredAttractions: true,
    uritorcoHighlight: true,
    astrotourismTeaser: true,
    featuredCabins: true,
    valleyMap: true,
    finalCta: true,
  },
  heroConfig: {
    title: 'El valle del Uritorco, directo y sin intermediarios.',
    subtitle: 'Paseos de montaña, geología milenaria y reservas seguras con prestadores habilitados oficialmente por la Secretaría de Turismo.',
  },
};
