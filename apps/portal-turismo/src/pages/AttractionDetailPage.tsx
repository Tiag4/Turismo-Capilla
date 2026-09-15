import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getAttractionDetail } from '../components/attractions/detail/getAttractionDetail';
import { AttractionDetailContainer } from '../components/attractions/detail/AttractionDetailContainer';

export const AttractionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const item = getAttractionDetail(id || '');

  if (!item) {
    return <Navigate to="/atractivos" replace />;
  }

  return (
    <div className="min-h-screen bg-sand-50 text-sand-900">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
        <AttractionDetailContainer item={item} />
      </div>
    </div>
  );
};
