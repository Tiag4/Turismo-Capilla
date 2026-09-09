import type { AttractionItem } from '../types';
import { ATTRACTIONS_DATA } from '../data/attractions-data';

export function getAttractionDetail(slugOrId: string): AttractionItem | undefined {
  if (!slugOrId) return undefined;
  const cleanKey = slugOrId.toLowerCase().trim();

  // Alias for historical heritage
  if (cleanKey === 'casonas') {
    return ATTRACTIONS_DATA.find((item) => item.slug === 'calle-techada');
  }

  return ATTRACTIONS_DATA.find(
    (item) => item.slug.toLowerCase() === cleanKey || item.id.toLowerCase() === cleanKey,
  );
}
