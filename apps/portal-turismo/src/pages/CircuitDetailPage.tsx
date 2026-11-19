import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  Compass,
  MapPin,
  Mountain,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../services/api';
import { ADVENTURE_ACTIVITIES, MYSTIC_SPOTS } from '../components/circuits/data/circuitsData';
import type { AdventureActivity, CircuitSpot } from '../components/circuits/types/circuits.types';
import { AttractionGalleryModal } from '../components/attractions/detail/components/AttractionGalleryModal';
import { NearbyAccommodationsCard } from '../components/attractions/detail/components/NearbyAccommodationsCard';
import { InteractiveMapContainer } from '../components/map/InteractiveMapContainer';

export const CircuitDetailPage: React.FC = () => {
  const { category, id } = useParams<{ category: string; id: string }>();
  const isAdventure = category === 'aventura';

  const [spot, setSpot] = useState<CircuitSpot | null>(() =>
    !isAdventure ? MYSTIC_SPOTS.find((s) => s.id === id) || null : null,
  );
  const [activity, setActivity] = useState<AdventureActivity | null>(() =>
    isAdventure ? ADVENTURE_ACTIVITIES.find((a) => a.id === id) || null : null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  useEffect(() => {
    let active = true;
    api
      .getCircuitsConfig()
      .then((remote) => {
        if (!active || !remote) return;
        if (!isAdventure && Array.isArray(remote.mysticSpots)) {
          const found = (remote.mysticSpots as CircuitSpot[]).find((s) => s.id === id);
          if (found) setSpot(found);
        } else if (isAdventure && Array.isArray(remote.adventureActivities)) {
          const found = (remote.adventureActivities as AdventureActivity[]).find((a) => a.id === id);
          if (found) setActivity(found);
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id, isAdventure]);

  const itemTitle = isAdventure ? activity?.title : spot?.title;
  const itemSubtitle = isAdventure
    ? `${activity?.modalityLabel ?? ''} · ${activity?.location ?? ''}`
    : spot?.subtitle;
  const itemDescription = isAdventure ? activity?.description : spot?.description;

  const linkedAttractionId = isAdventure
    ? activity?.linkedAttractionId
    : spot?.linkedAttractionId ||
      (spot?.id === 'cerro-uritorco' ? 'uritorco' : spot?.id === 'los-terrones' ? 'los-terrones' : undefined);
  const linkedAttractionName = isAdventure
    ? activity?.linkedAttractionName
    : spot?.linkedAttractionName || (spot?.id === 'cerro-uritorco' ? 'Cerro Uritorco' : spot?.id === 'los-terrones' ? 'Los Terrones' : undefined);

  const rawGallery = isAdventure
    ? activity?.galleryImages && activity.galleryImages.length > 0
      ? activity.galleryImages
      : activity?.image
      ? [activity.image]
      : []
    : spot?.galleryImages && spot.galleryImages.length > 0
    ? spot.galleryImages
    : spot?.image
    ? [spot.image]
    : [];

  const gallery =
    rawGallery.length > 0 ? rawGallery : ['/images/attractions/uritorco/uritorco-02.jpg'];

  const coords = (isAdventure ? activity?.coordinates : spot?.coordinates) ?? {
    lat: -30.857,
    lng: -64.515,
  };

  if (isLoading && !itemTitle) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
        <div className="h-[460px] rounded-3xl bg-sand-200/60 animate-pulse" />
      </div>
    );
  }

  if (!itemTitle) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-display font-black text-3xl text-sand-950">Ficha no encontrada</h1>
        <Link
          to="/atractivos?modo=circuitos"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sand-900 text-white text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Circuitos Temáticos
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-sand-50 min-h-screen pb-24">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 sm:pt-10 space-y-8">
        {/* Breadcrumb */}
        <Link
          to={`/atractivos?modo=circuitos&circuito=${isAdventure ? 'aventura' : 'mistico'}`}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-sand-700 hover:text-terracotta-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Circuitos Temáticos Oficiales</span>
        </Link>

        {/* Encabezado */}
        <header className="space-y-3 max-w-4xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-terracotta-700">
            {isAdventure ? <Mountain className="w-4 h-4" /> : <Compass className="w-4 h-4" />}
            <span>{isAdventure ? 'Turismo Alternativo & Aventura' : 'Circuito Místico & Energético'}</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-sand-950 tracking-tight leading-tight">
            {itemTitle}
          </h1>
          {itemSubtitle && <p className="text-base sm:text-lg text-sand-600 font-medium">{itemSubtitle}</p>}
        </header>

        {/* Galería Panorámica Full-Width (1 o múltiple) */}
        {gallery.length > 1 ? (
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-3 rounded-3xl overflow-hidden max-h-[520px]">
            <div
              className="lg:col-span-8 h-[300px] sm:h-[420px] lg:h-[520px] overflow-hidden cursor-pointer bg-sand-200"
              onClick={() => {
                setActivePhotoIndex(0);
                setIsGalleryOpen(true);
              }}
            >
              <img src={gallery[0]} alt={itemTitle} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="hidden lg:grid lg:col-span-4 grid-rows-2 gap-3 h-[520px]">
              {gallery.slice(1, 3).map((imgUrl, idx) => (
                <div
                  key={`${imgUrl}-${idx}`}
                  className="overflow-hidden cursor-pointer bg-sand-200"
                  onClick={() => {
                    setActivePhotoIndex(idx + 1);
                    setIsGalleryOpen(true);
                  }}
                >
                  <img src={imgUrl} alt={`${itemTitle} ${idx + 2}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setActivePhotoIndex(0);
                setIsGalleryOpen(true);
              }}
              className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sand-950/85 hover:bg-sand-950 text-white text-xs font-bold cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Ver galería ({gallery.length} fotos)</span>
            </button>
          </div>
        ) : (
          <div className="relative rounded-3xl overflow-hidden border border-sand-200 bg-sand-200 w-full h-[300px] sm:h-[440px] lg:h-[520px]">
            <img
              src={gallery[0]}
              alt={itemTitle}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => {
                setActivePhotoIndex(0);
                setIsGalleryOpen(true);
              }}
            />
            <button
              type="button"
              onClick={() => {
                setActivePhotoIndex(0);
                setIsGalleryOpen(true);
              }}
              className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sand-950/85 hover:bg-sand-950 text-white text-xs font-bold cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Ampliar fotografía</span>
            </button>
          </div>
        )}

        {/* Layout 8 + 4 idéntico al de Atractivos */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-2">
          {/* Columna Izquierda Principal */}
          <div className="lg:col-span-8 space-y-10">
            <section className="space-y-4">
              <h2 className="font-display font-black text-2xl sm:text-3xl text-sand-950">
                Descripción de la experiencia
              </h2>
              <p className="text-sand-700 leading-relaxed text-base whitespace-pre-line">{itemDescription}</p>
            </section>

            {isAdventure && activity ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-sand-200">
                <div className="space-y-3">
                  <h3 className="font-display font-bold text-lg text-sand-950">Equipamiento sugerido</h3>
                  <ul className="space-y-2.5 text-sm text-sand-700">
                    {activity.suggestedGear.map((g, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-terracotta-600 shrink-0 mt-0.5" />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-display font-bold text-lg text-sand-950">Requisitos de seguridad</h3>
                  <ul className="space-y-2.5 text-sm text-sand-700">
                    {activity.safetyRequirements.map((r, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              spot && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-sand-200">
                  <div className="space-y-3">
                    <h3 className="font-display font-bold text-lg text-sand-950">Aspectos clave del recorrido</h3>
                    <ul className="space-y-2.5 text-sm text-sand-700">
                      {spot.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-terracotta-600 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-display font-bold text-lg text-sand-950">Recomendaciones oficiales</h3>
                    <ul className="space-y-2.5 text-sm text-sand-700">
                      {spot.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            )}

            {/* Mapa Georreferenciado */}
            <section className="space-y-3 pt-6 border-t border-sand-200">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-terracotta-600" />
                <h2 className="font-display font-black text-xl text-sand-950">Ubicación exacta en el mapa</h2>
              </div>
              <InteractiveMapContainer
                showFilters={false}
                heightClassName="h-[400px]"
                places={[
                  {
                    id: id || 'circuit-point',
                    type: 'attraction',
                    title: itemTitle,
                    subtitle: itemSubtitle || '',
                    category: isAdventure ? 'Turismo Alternativo' : 'Circuito Místico',
                    lat: coords.lat,
                    lng: coords.lng,
                    rating: 4.9,
                    reviewCount: 100,
                    imageUrl: gallery[0],
                    address: 'Capilla del Monte, Córdoba',
                    verified: true,
                    isFeatured: true,
                    ctaUrl: `/circuitos/${category}/${id}`,
                  },
                ]}
              />
            </section>
          </div>

          {/* Columna Derecha Sticky: Ficha Técnica, Atractivo Vinculado, Prestadores y Alojamientos */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Telemetría / Datos Técnicos */}
            <div className="p-6 rounded-2xl border border-sand-200 bg-white space-y-4">
              <h3 className="font-display font-black text-base text-sand-950">Ficha técnica</h3>
              <div className="divide-y divide-sand-200 text-sm">
                {isAdventure && activity ? (
                  <>
                    <div className="py-2.5 flex justify-between gap-2">
                      <span className="text-sand-500">Modalidad</span>
                      <span className="font-bold text-sand-950 text-right">{activity.modalityLabel}</span>
                    </div>
                    <div className="py-2.5 flex justify-between gap-2">
                      <span className="text-sand-500">Dificultad</span>
                      <span className="font-bold text-sand-950">{activity.difficulty}</span>
                    </div>
                    <div className="py-2.5 flex justify-between gap-2">
                      <span className="text-sand-500">Duración</span>
                      <span className="font-bold text-sand-950">{activity.duration}</span>
                    </div>
                    <div className="py-2.5 flex justify-between gap-2">
                      <span className="text-sand-500">Sector</span>
                      <span className="font-bold text-sand-950 text-right">{activity.location}</span>
                    </div>
                  </>
                ) : (
                  spot && (
                    <>
                      <div className="py-2.5 flex justify-between gap-2">
                        <span className="text-sand-500">Horario sugerido</span>
                        <span className="font-bold text-sand-950 text-right">{spot.bestTime || 'Diurno'}</span>
                      </div>
                      <div className="py-2.5 flex justify-between gap-2">
                        <span className="text-sand-500">Atributo</span>
                        <span className="font-bold text-sand-950 text-right">
                          {spot.energyAttribute || 'Patrimonio serrano'}
                        </span>
                      </div>
                      <div className="py-2.5 flex justify-between gap-2">
                        <span className="text-sand-500">Categoría</span>
                        <span className="font-bold text-sand-950">{spot.badge}</span>
                      </div>
                    </>
                  )
                )}
              </div>
            </div>

            {/* Atractivo Oficial Vinculado */}
            {linkedAttractionId && (
              <div className="p-6 rounded-2xl border border-sand-200 bg-white space-y-3">
                <span className="text-xs font-bold text-terracotta-700 block">Atractivo oficial asociado</span>
                <p className="font-display font-black text-base text-sand-950">
                  {linkedAttractionName || 'Ver sendero y telemetría'}
                </p>
                <p className="text-xs text-sand-600 leading-relaxed">
                  Consultá la altimetría, protocolo de seguridad, tarifas de acceso y estado de habilitación del atractivo.
                </p>
                <Link
                  to={`/atractivos/${linkedAttractionId}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-sand-900 hover:bg-terracotta-600 text-white text-xs font-bold transition-colors"
                >
                  <span>Ir a la ficha del atractivo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Prestadores Habilitados (Aventura) */}
            {isAdventure && activity && activity.certifiedProviders.length > 0 && (
              <div className="p-6 rounded-2xl border border-sand-200 bg-white space-y-4">
                <h3 className="font-display font-black text-base text-sand-950">Prestadores habilitados</h3>
                <div className="divide-y divide-sand-200">
                  {activity.certifiedProviders.map((prov, idx) => (
                    <div key={idx} className="py-3 first:pt-0 last:pb-0 space-y-1.5">
                      <p className="font-bold text-sm text-sand-950">{prov.name}</p>
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-700 text-white">
                        {prov.certificationBadge}
                      </span>
                      {prov.contact && (
                        <a
                          href={`tel:${prov.contact}`}
                          className="mt-2 w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-sand-900 hover:bg-terracotta-600 text-white text-xs font-bold transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Contactar ({prov.contact})</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alojamientos Cercanos Reales */}
            <NearbyAccommodationsCard />
          </aside>
        </div>
      </div>

      <AttractionGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        gallery={gallery}
        activeIndex={activePhotoIndex}
        onSelectIndex={setActivePhotoIndex}
        title={itemTitle}
      />
    </div>
  );
};
