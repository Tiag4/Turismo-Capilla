import type { MapPlace } from '../../../data/mock-places';
import type { AccommodationDetailData, InventoryMode, RoomTypeInventoryItem, UnitDetails } from './types';

function parseBedroomsFromSummary(summary: string): { roomName: string; bedDetails: string; isDouble: boolean }[] {
  const separator = summary.includes('|') ? '|' : (summary.includes(';') ? ';' : ',');
  const parts = summary.split(separator).map((s) => s.trim()).filter(Boolean);

  if (parts.length === 0) return [];

  return parts.map((part, index) => {
    let roomName = `Dormitorio ${index + 1}`;
    let bedDetails = part;

    if (part.includes(':')) {
      const [rName, bDetails] = part.split(':').map((s) => s.trim());
      if (rName && bDetails) {
        roomName = rName;
        bedDetails = bDetails;
      }
    }

    const lower = bedDetails.toLowerCase();
    const isDouble =
      lower.includes('matrimonial') ||
      lower.includes('doble') ||
      lower.includes('king') ||
      lower.includes('queen') ||
      lower.includes('sommier doble');

    return {
      roomName,
      bedDetails,
      isDouble,
    };
  });
}

function buildUnitDetails(place: MapPlace): UnitDetails {
  const maxGuests = place.maxGuests ?? ((place.capacity ? parseInt(place.capacity.replace(/\D/g, ''), 10) : 4) || 4);
  const capacityText = place.capacity || `Capacidad: hasta ${maxGuests} personas`;

  const unitTitle =
    place.unitTitle ||
    (place.category ? `${place.category} Privada` : `${place.title} — Unidad Principal`);

  let bedrooms: { roomName: string; bedDetails: string; isDouble: boolean }[] = [];
  if (place.bedroomsSummary) {
    bedrooms = parseBedroomsFromSummary(place.bedroomsSummary);
  }

  if (bedrooms.length === 0) {
    if (maxGuests <= 2) {
      bedrooms = [
        { roomName: 'Dormitorio Principal', bedDetails: '1 cama matrimonial Queen', isDouble: true },
      ];
    } else {
      bedrooms = [
        { roomName: 'Dormitorio 1', bedDetails: '1 cama matrimonial King', isDouble: true },
        { roomName: 'Dormitorio 2', bedDetails: `${Math.max(1, maxGuests - 2)} camas individuales`, isDouble: false },
      ];
    }
  }

  const features: string[] = [];
  features.push(`${place.category || 'Alojamiento'} entero`);
  if (place.surfaceSqm) {
    features.push(`${place.surfaceSqm} m²`);
  }

  const amenitiesLower = (place.amenities ?? []).map((a) => a.toLowerCase());
  if (amenitiesLower.some((a) => a.includes('cocina') || a.includes('vajilla'))) {
    features.push('Cocina equipada');
  }
  if (amenitiesLower.some((a) => a.includes('baño') || a.includes('hidro'))) {
    features.push('Baño privado');
  }
  if (amenitiesLower.some((a) => a.includes('tv') || a.includes('pantalla'))) {
    features.push('TV de pantalla plana');
  }
  if (amenitiesLower.some((a) => a.includes('asador') || a.includes('parrilla'))) {
    features.push('Asador individual');
  }
  if (amenitiesLower.some((a) => a.includes('pileta') || a.includes('piscina'))) {
    features.push('Piscina');
  }
  if (amenitiesLower.some((a) => a.includes('wifi') || a.includes('wi-fi'))) {
    features.push('Wi-Fi alta velocidad');
  }

  return {
    title: unitTitle,
    capacityText,
    maxAdults: Math.max(1, maxGuests - 1),
    maxChildren: Math.max(1, Math.min(3, maxGuests - 1)),
    bedrooms,
    features: Array.from(new Set(features)).slice(0, 5),
  };
}

function inferInventoryMode(place: MapPlace): InventoryMode {
  if (place.inventoryMode) {
    return place.inventoryMode;
  }
  if (place.roomTypes && place.roomTypes.length > 0) {
    return 'MULTI_ROOM';
  }
  return 'SINGLE_UNIT';
}

function buildRoomTypes(place: MapPlace, basePrice: number, mode: InventoryMode): RoomTypeInventoryItem[] {
  if (mode === 'SINGLE_UNIT') {
    const maxGuests = place.maxGuests ?? 4;
    return [
      {
        id: `${place.id}-unit-main`,
        name: place.unitTitle || `Unidad Completa — ${place.title}`,
        description: place.description
          ? place.description.split(/\r?\n+/)[0]
          : 'Alquiler exclusivo de la propiedad completa con privacidad total y parque propio.',
        capacityAdults: Math.max(1, maxGuests - 1),
        capacityChildren: Math.max(1, Math.min(3, maxGuests - 1)),
        maxGuests,
        bedsSummary: place.bedroomsSummary || '1 Cama King Size + Camas Individuales',
        sizeSqm: place.surfaceSqm || 55,
        pricePerNight: basePrice,
        totalStock: 1,
        availableStock: 1,
        breakfastIncluded: Boolean(place.amenities?.some((a) => a.toLowerCase().includes('desayuno'))),
        amenities:
          place.amenities && place.amenities.length > 0
            ? place.amenities.slice(0, 6)
            : ['Cocina equipada', 'Parrilla individual', 'Cochera techada', 'WiFi Fibra'],
        imageUrl:
          place.imageUrl ||
          'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80',
      },
    ];
  }

  // MULTI_ROOM: Si el establecimiento posee tipos de habitación configurados, usarlos
  if (place.roomTypes && place.roomTypes.length > 0) {
    return place.roomTypes;
  }

  // Fallback si fue marcado como MULTI_ROOM pero sin tipos de habitación explícitos
  return [
    {
      id: `${place.id}-room-std`,
      name: 'Doble Serrano Standard',
      description: 'Unidad luminosa con vista al jardín autóctono, calefacción central y baño privado.',
      capacityAdults: 2,
      capacityChildren: 1,
      maxGuests: 2,
      bedsSummary: '1 Cama Queen Size (o 2 Twin)',
      sizeSqm: 28,
      pricePerNight: basePrice,
      totalStock: 5,
      availableStock: 4,
      breakfastIncluded: true,
      amenities: ['Desayuno serrano', 'WiFi alta velocidad', 'Aire frío/calor', 'Baño privado'],
      imageUrl: place.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: `${place.id}-room-sup`,
      name: 'Superior Vista al Cerro Uritorco',
      description: 'Balcón o deck privado orientado a las sierras, frigobar, ropa blanca premium y cochera.',
      capacityAdults: 3,
      capacityChildren: 1,
      maxGuests: 3,
      bedsSummary: '1 Cama King Size + 1 Individual',
      sizeSqm: 38,
      pricePerNight: Math.round(basePrice * 1.25),
      totalStock: 4,
      availableStock: 3,
      breakfastIncluded: true,
      amenities: ['Vista al Uritorco', 'Deck privado', 'Desayuno incluido', 'Frigobar', 'Cochera cubierta'],
      imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: `${place.id}-room-fam`,
      name: 'Suite / Cabaña Familiar 2 Ambientes',
      description: 'Dos dormitorios independientes, estar con hogar a leña, cocina completa y asador propio.',
      capacityAdults: 4,
      capacityChildren: 2,
      maxGuests: 5,
      bedsSummary: '1 Cama King Size + 3 Camas Individuales',
      sizeSqm: 56,
      pricePerNight: Math.round(basePrice * 1.55),
      totalStock: 3,
      availableStock: 2,
      breakfastIncluded: true,
      amenities: ['2 Dormitorios', 'Cocina completa', 'Hogar a leña', 'Asador individual', 'Cochera doble'],
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    },
  ];
}

export function buildFullDescription(place: MapPlace): string[] {
  const rawDesc = place.description || place.subtitle || '';
  if (!rawDesc.trim()) {
    return [
      `${place.title} es un establecimiento formalmente registrado en la zona de ${place.zone || 'Capilla del Monte'}.`,
      'Trato directo con los anfitriones, garantizando tarifa oficial transparente sin comisiones de intermediarios y asistencia durante toda la estadía.',
    ];
  }

  const paragraphs = rawDesc
    .split(/\r?\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  if (paragraphs.length >= 2) {
    return paragraphs;
  }

  const single = paragraphs[0];
  const sentences = single.match(/[^.!?]+[.!?]+(\s|$)/g);
  if (sentences && sentences.length >= 4) {
    const mid = Math.ceil(sentences.length / 2);
    return [
      sentences.slice(0, mid).join('').trim(),
      sentences.slice(mid).join('').trim(),
      `Trato directo con ${place.hostName || 'los anfitriones'}, garantizando tarifa oficial transparente y confirmación inmediata en Capilla del Monte.`
    ];
  }

  return [
    single,
    'El predio cuenta con parque serrano con especies autóctonas, vistas panorámicas y comodidades para disfrutar del descanso al pie de las sierras cordobesas.',
    `Trato directo con ${place.hostName || 'los anfitriones'}, garantizando tarifa oficial transparente sin comisiones de intermediarios y asistencia durante toda la estadía.`
  ];
}

export function getAccommodationDetail(place: MapPlace): AccommodationDetailData {
  const gallery =
    place.galleryImages && place.galleryImages.length > 0
      ? place.galleryImages
      : [
          place.imageUrl || '/images/detail/bento-1-terrace.jpg',
        ];

  const basePrice = place.pricePerNight ?? 95000;
  const inventoryMode = inferInventoryMode(place);
  const roomTypes = buildRoomTypes(place, basePrice, inventoryMode);
  const unitDetails = buildUnitDetails(place);

  return {
    ...place,
    inventoryMode,
    roomTypes,
    gallery,
    fullDescription: buildFullDescription(place),
    host: {
      name: place.hostName || `${place.title} — Anfitrión`,
      avatarUrl:
        place.hostAvatarUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(place.hostName || place.title)}&background=1C8B68&color=ffffff&bold=true`,
      badgeText: place.licenseNumber
        ? `Habilitación Municipal N° ${place.licenseNumber}`
        : 'Prestador Oficial Habilitado de Capilla del Monte',
      responseTime: place.responseTime || 'Responde habitualmente en el día',
      yearsHosting: place.hostYearsHosting ?? 3,
      verified: true,
    },
    bedrooms: unitDetails.bedrooms.map((b) => ({
      name: b.roomName,
      beds: b.bedDetails,
      description: b.isDouble
        ? 'Sommier matrimonial con ropa blanca de puro algodón y vista a las sierras.'
        : 'Camas individuales con colchones de alta densidad y cortinas blackout.',
    })),
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
      checkIn: place.checkInTime || '14:00 hs',
      checkOut: place.checkOutTime || '10:00 hs',
      petPolicy: place.petPolicy || 'Mascotas bienvenidas previa consulta y aviso (parque amplio)',
      quietHours: 'Horas de descanso de 23:00 a 08:00 hs',
      cancellation: place.cancellationPolicy || 'Cancelación flexible hasta 7 días antes de la fecha de ingreso',
    },
    depositPercent: place.downPaymentPercentage ?? 50,
    unitDetails,
  };
}
