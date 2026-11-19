import { apiClient } from './api.client';
import type { CircuitsConfig } from '../types/circuits.types';

export const DEFAULT_CIRCUITS_CONFIG: CircuitsConfig = {
  mysticSpots: [
    {
      id: 'cerro-uritorco',
      title: 'Cerro Uritorco (Vórtice Mayor)',
      subtitle: 'El guardián cósmico del Valle de Punilla (1.979 msnm)',
      description:
        'Considerado por la cosmovisión comechingón y tradiciones espirituales como un centro de concentración telúrica y conexión dimensional.',
      highlights: [
        'Cumbre a 1.979 metros con vista de 360 grados',
        'Senderos guiados diurnos y ascensos nocturnos',
      ],
      energyAttribute: 'Chakra Corona · Vibración Telúrica Alta',
      recommendations: [
        'Realizar el ascenso con calzado de montaña y registro obligatorio en base La Toma',
      ],
      coordinates: { lat: -30.8436, lng: -64.4842 },
      image: '/images/attractions/uritorco/uritorco-02.jpg',
      badge: 'Vórtice Principal',
      bestTime: 'Amanecer y Luna Llena',
    },
    {
      id: 'los-terrones',
      title: 'Parque Autóctono Los Terrones',
      subtitle: 'Laberinto de areniscas rojizas & Puerta de Erks',
      description:
        'Cañadón milenario con gigantescas figuras esculpidas por la erosión eólica y fluvial.',
      highlights: [
        'Formaciones rocosas únicas con millones de años de antigüedad',
        'Senderismo consciente por el circuito profundo del cañadón',
      ],
      energyAttribute: 'Resonancia Acústica & Silencio Profundo',
      recommendations: ['Llevar agua potable (mínimo 1.5L) y sombrero'],
      coordinates: { lat: -30.795, lng: -64.512 },
      image: '/images/attractions/los-terrones/los-terrones-01.jpg',
      badge: 'Ciudad Perdida',
      bestTime: 'Mañana temprana',
    },
  ],
  adventureActivities: [
    {
      id: 'parapente-cuchi-corral',
      title: 'Vuelo Biplaza en Parapente (Cuchi Corral)',
      modality: 'parapente',
      modalityLabel: 'Parapente & Vuelo Libre',
      location: 'Mirador de Cuchi Corral',
      difficulty: 'Media',
      duration: '20 a 35 min de vuelo',
      description:
        'Despegue desde uno de los mejores balcones térmicos de Sudamérica sobrevolando el Valle del Río Pintos.',
      suggestedGear: ['Ropa abrigada rompeviento', 'Zapatillas deportivas acordonadas'],
      safetyRequirements: ['Pilotos biplaza licenciados FAVL'],
      certifiedProviders: [
        {
          name: 'Escuela Serrano Vuelo Libre',
          contact: '+54 9 3548 55-2211',
          certificationBadge: 'Licencia FAVL #104',
        },
      ],
      coordinates: { lat: -30.922, lng: -64.518 },
      image: '/images/attractions/los-terrones/los-terrones-02.jpg',
    },
  ],
};

export const circuitsConfigService = {
  fetchConfig: async (): Promise<CircuitsConfig> => {
    try {
      const remote = await apiClient.get<Partial<CircuitsConfig>>('/circuits');
      if (remote && typeof remote === 'object') {
        const mystic =
          Array.isArray(remote.mysticSpots) && remote.mysticSpots.length > 0
            ? remote.mysticSpots
            : DEFAULT_CIRCUITS_CONFIG.mysticSpots;
        const adventure =
          Array.isArray(remote.adventureActivities) && remote.adventureActivities.length > 0
            ? remote.adventureActivities
            : DEFAULT_CIRCUITS_CONFIG.adventureActivities;
        return { mysticSpots: mystic, adventureActivities: adventure };
      }
    } catch (err) {
      console.warn('No se pudo cargar /circuits desde backend, usando defaults:', err);
    }
    return DEFAULT_CIRCUITS_CONFIG;
  },

  saveConfig: async (config: CircuitsConfig): Promise<CircuitsConfig> => {
    await apiClient.put<CircuitsConfig>('/circuits', config);
    return config;
  },
};
