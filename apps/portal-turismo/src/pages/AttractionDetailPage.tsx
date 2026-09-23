import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import type { AttractionItem } from '../components/attractions/types';
import { getAttractionDetail } from '../components/attractions/detail/getAttractionDetail';
import { AttractionDetailContainer } from '../components/attractions/detail/AttractionDetailContainer';
import { api } from '../services/api';
import { mapApiToAttractionItem } from '../components/attractions/mappers/attractionMapper';

export const AttractionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const initialItem = getAttractionDetail(id || '');
  const [item, setItem] = useState<AttractionItem | null>(initialItem ?? null);
  const [loading, setLoading] = useState<boolean>(!initialItem);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    if (item || !id) return;
    let active = true;

    async function fetchFromApi() {
      try {
        setLoading(true);
        let apiItem;
        try {
          apiItem = await api.getAttractionById(id);
        } catch {
          const list = await api.getAttractions({ search: id.replace(/-/g, ' ') });
          apiItem = list?.[0];
        }

        if (active) {
          if (apiItem) {
            const mapped = mapApiToAttractionItem(apiItem);
            setItem(mapped);
          } else {
            setNotFound(true);
          }
        }
      } catch {
        if (active) {
          setNotFound(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchFromApi();
    return () => {
      active = false;
    };
  }, [id, item]);

  if (notFound) {
    return <Navigate to="/atractivos" replace />;
  }

  if (loading || !item) {
    return (
      <div className="min-h-screen bg-sand-50 text-sand-900 py-16">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-10 h-10 border-4 border-sand-300 border-t-terracotta-600 rounded-full animate-spin" />
            <p className="text-sm font-semibold text-sand-600">
              Cargando ficha técnica del atractivo...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50 text-sand-900">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
        <AttractionDetailContainer item={item} />
      </div>
    </div>
  );
};
