import { useState, useMemo, useCallback, useEffect } from 'react';
import type { AttractionCategory, AttractionDifficulty, AttractionItem } from '../types';
import { ATTRACTIONS_DATA } from '../data/attractions-data';
import { api } from '../../../services/api';
import { mapApiToAttractionList } from '../mappers/attractionMapper';

export function useAttractionsFilter() {
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<AttractionCategory>('todos');
  const [difficulty, setDifficulty] = useState<'todos' | AttractionDifficulty>('todos');
  const [sortBy, setSortBy] = useState<'popular' | 'cercania' | 'dificultad'>('popular');
  const [attractions, setAttractions] = useState<AttractionItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync initial query params from URL if present
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const qCat = params.get('category') as AttractionCategory | null;
    const qSearch = params.get('q') || params.get('search');
    const qDiff = params.get('difficulty') as ('todos' | AttractionDifficulty) | null;

    if (qSearch) setSearch(qSearch);
    if (
      qCat &&
      ['todos', 'trekking', 'balneario', 'rocas', 'mirador', 'cultura', 'nocturno'].includes(qCat)
    ) {
      setCategory(qCat);
    }
    if (qDiff && ['todos', 'Baja', 'Media', 'Alta'].includes(qDiff)) {
      setDifficulty(qDiff);
    }
  }, []);

  // Fetch real attractions from backend API with transparent fallback to local data only when needed
  useEffect(() => {
    let isCancelled = false;
    async function loadApiAttractions() {
      try {
        setIsLoading(true);
        const data = await api.getAttractions();
        if (!isCancelled) {
          if (Array.isArray(data) && data.length > 0) {
            const mapped = mapApiToAttractionList(data);
            setAttractions(mapped);
          } else {
            setAttractions(ATTRACTIONS_DATA);
          }
        }
      } catch {
        // Fallback transparent to local data on offline / server cold boot
        if (!isCancelled) {
          setAttractions(ATTRACTIONS_DATA);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadApiAttractions();
    return () => {
      isCancelled = true;
    };
  }, []);

  const filteredAttractions = useMemo(() => {
    let list = [...attractions];

    // Category filter
    if (category !== 'todos') {
      list = list.filter((item) => item.category === category);
    }

    // Difficulty filter
    if (difficulty !== 'todos') {
      list = list.filter((item) => item.difficulty === difficulty);
    }

    // Search query filter
    const query = search.trim().toLowerCase();
    if (query) {
      list = list.filter((item) => {
        return (
          item.title.toLowerCase().includes(query) ||
          item.subtitle.toLowerCase().includes(query) ||
          item.categoryLabel.toLowerCase().includes(query) ||
          item.overview.toLowerCase().includes(query) ||
          item.address.toLowerCase().includes(query)
        );
      });
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'popular') {
        return b.rating * b.reviewCount - a.rating * a.reviewCount;
      }
      if (sortBy === 'cercania') {
        const distA = parseFloat(a.distanceFromCenter.replace(',', '.')) || 0;
        const distB = parseFloat(b.distanceFromCenter.replace(',', '.')) || 0;
        return distA - distB;
      }
      if (sortBy === 'dificultad') {
        const order: Record<AttractionDifficulty, number> = { Baja: 1, Media: 2, Alta: 3 };
        return order[a.difficulty] - order[b.difficulty];
      }
      return 0;
    });

    return list;
  }, [attractions, search, category, difficulty, sortBy]);

  const resetFilters = useCallback(() => {
    setSearch('');
    setCategory('todos');
    setDifficulty('todos');
    setSortBy('popular');
  }, []);

  return {
    search,
    setSearch,
    category,
    setCategory,
    difficulty,
    setDifficulty,
    sortBy,
    setSortBy,
    filteredAttractions,
    totalCount: filteredAttractions.length,
    allCount: attractions.length,
    isLoading,
    resetFilters,
  };
}
