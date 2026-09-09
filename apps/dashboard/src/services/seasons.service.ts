import type { TourismSeason, CreateSeasonDto } from '../types/season.types.ts';

const SEASONS_STORAGE_KEY = 'turismo_capilla_seasons';

const DEFAULT_SEASONS: TourismSeason[] = [
  {
    id: 'sea-1',
    name: 'Temporada Alta de Verano',
    type: 'HIGH',
    startDate: '2027-01-01',
    endDate: '2027-02-28',
    suggestedMultiplier: 1.4,
    description: 'Afluencia masiva a balnearios (La Toma, Calabalumba) y ascenso nocturno al Uritorco.',
    isActive: true,
  },
  {
    id: 'sea-2',
    name: 'Festival Alienígena & Encuentro OVNI',
    type: 'SPECIAL_EVENT',
    startDate: '2027-02-12',
    endDate: '2027-02-16',
    suggestedMultiplier: 1.6,
    description: 'Fiesta oficial en la Calle Techada con desfile de disfraces, conferencias y ocupación al 100%.',
    isActive: true,
  },
  {
    id: 'sea-3',
    name: 'Semana Santa Serrana',
    type: 'HIGH',
    startDate: '2027-03-25',
    endDate: '2027-03-29',
    suggestedMultiplier: 1.5,
    description: 'Fin de semana largo de turismo religioso, senderismo en Los Terrones y gastronomía regional.',
    isActive: true,
  },
  {
    id: 'sea-4',
    name: 'Vacaciones de Invierno',
    type: 'MEDIUM',
    startDate: '2026-07-06',
    endDate: '2026-07-26',
    suggestedMultiplier: 1.3,
    description: 'Receso invernal escolar nacional con turismo familiar y ecoturismo.',
    isActive: true,
  },
];

export const seasonsService = {
  async getAll(): Promise<TourismSeason[]> {
    try {
      const raw = localStorage.getItem(SEASONS_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // fallback
    }
    localStorage.setItem(SEASONS_STORAGE_KEY, JSON.stringify(DEFAULT_SEASONS));
    return DEFAULT_SEASONS;
  },

  async create(dto: CreateSeasonDto): Promise<TourismSeason> {
    const list = await this.getAll();
    const newSeason: TourismSeason = {
      ...dto,
      id: `sea-${Date.now()}`,
      isActive: true,
    };
    const updated = [newSeason, ...list];
    localStorage.setItem(SEASONS_STORAGE_KEY, JSON.stringify(updated));
    return newSeason;
  },

  async update(id: string, dto: Partial<CreateSeasonDto>): Promise<TourismSeason> {
    const list = await this.getAll();
    const index = list.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Temporada no encontrada');
    const updatedSeason: TourismSeason = {
      ...list[index],
      ...dto,
    };
    list[index] = updatedSeason;
    localStorage.setItem(SEASONS_STORAGE_KEY, JSON.stringify(list));
    return updatedSeason;
  },

  async toggleActive(id: string): Promise<TourismSeason> {
    const list = await this.getAll();
    const index = list.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Temporada no encontrada');
    list[index].isActive = !list[index].isActive;
    localStorage.setItem(SEASONS_STORAGE_KEY, JSON.stringify(list));
    return list[index];
  },
};
