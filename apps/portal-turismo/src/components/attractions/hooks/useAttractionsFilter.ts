import { useState, useMemo, useCallback } from 'react';
import type { AttractionItem, AttractionCategory, AttractionDifficulty } from '../types';
import { ATTRACTIONS_DATA } from '../data/attractions-data';

export function useAttractionsFilter() {
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<AttractionCategory>('todos');
  const [difficulty, setDifficulty] = useState<'todos' | AttractionDifficulty>('todos');
  const [sortBy, setSortBy] = useState<'popular' | 'cercania' | 'dificultad'>('popular');

  const filteredAttractions = useMemo(() => {
    let list = [...ATTRACTIONS_DATA];

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
  }, [search, category, difficulty, sortBy]);

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
    allCount: ATTRACTIONS_DATA.length,
    resetFilters,
  };
}
