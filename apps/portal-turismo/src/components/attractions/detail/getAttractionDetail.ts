import type { AttractionItem } from '../types';
import { ATTRACTIONS_DATA } from '../data/attractions-data';

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

  return ATTRACTIONS_DATA.find(
    (item) => item.slug.toLowerCase() === cleanKey || item.id.toLowerCase() === cleanKey,
  );
}
