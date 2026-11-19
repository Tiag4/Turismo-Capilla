import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, CheckCircle2, Compass, MapPin, Mountain, Phone, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { ADVENTURE_ACTIVITIES, MYSTIC_SPOTS } from '../components/circuits/data/circuitsData';
import type { AdventureActivity, CircuitSpot } from '../components/circuits/types/circuits.types';
import { AttractionGalleryModal } from '../components/attractions/detail/components/AttractionGalleryModal';
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
    rawGallery.length > 0 ? rawGallery : ['/images/attractions/uritorco/uritorco-01.jpg'];

  const coords = (isAdventure ? activity?.coordinates : spot?.coordinates) ?? {
    lat: -30.857,
    lng: -64.515,
  };

  if (isLoading && !itemTitle) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="h-96 rounded-3xl bg-sand-200/60 animate-pulse" />
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
    <div className="bg-sand-50 min-h-screen pb-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-6 sm:pt-10 space-y-8">
        <Link
          to={`/atractivos?modo=circuitos&circuito=${isAdventure ? 'aventura' : 'mistico'}`}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-sand-700 hover:text-terracotta-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Circuitos Temáticos Oficiales</span>
        </Link>

        {/* Encabezado y Galería */}
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-terracotta-700">
            {isAdventure ? <Mountain className="w-4 h-4" /> : <Compass className="w-4 h-4" />}
            <span>{isAdventure ? 'Turismo Alternativo & Aventura' : 'Circuito Místico & Energético'}</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-sand-950 tracking-tight leading-tight">
            {itemTitle}
          </h1>
          {itemSubtitle && <p className="text-base sm:text-lg text-sand-600 font-medium">{itemSubtitle}</p>}
        </header>

        {/* Portada + Botón de Galería Múltiple */}
        <div className="relative rounded-3xl overflow-hidden border border-sand-200 bg-sand-200 aspect-16/9 max-h-[540px]">
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
            <span>Ver galería ({gallery.length} {gallery.length === 1 ? 'foto' : 'fotos'})</span>
          </button>
        </div>

        {/* Telemetría Técnica */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 py-5 border-y border-sand-200">
          {isAdventure && activity ? (
            <>
              <div>
                <span className="text-xs text-sand-500 block">Modalidad</span>
                <span className="font-bold text-sm text-sand-950">{activity.modalityLabel}</span>
              </div>
              <div>
                <span className="text-xs text-sand-500 block">Dificultad</span>
                <span className="font-bold text-sm text-sand-950">{activity.difficulty}</span>
              </div>
              <div>
                <span className="text-xs text-sand-500 block">Duración estimada</span>
                <span className="font-bold text-sm text-sand-950">{activity.duration}</span>
              </div>
              <div>
                <span className="text-xs text-sand-500 block">Sector</span>
                <span className="font-bold text-sm text-sand-950">{activity.location}</span>
              </div>
            </>
          ) : (
            spot && (
              <>
                <div>
                  <span className="text-xs text-sand-500 block">Horario sugerido</span>
                  <span className="font-bold text-sm text-sand-950">{spot.bestTime || 'Diurno'}</span>
                </div>
                <div>
                  <span className="text-xs text-sand-500 block">Atributo destacado</span>
                  <span className="font-bold text-sm text-sand-950">{spot.energyAttribute || 'Patrimonio serrano'}</span>
                </div>
                <div>
                  <span className="text-xs text-sand-500 block">Categoría</span>
                  <span className="font-bold text-sm text-sand-950">{spot.badge}</span>
                </div>
                <div>
                  <span className="text-xs text-sand-500 block">Registro</span>
                  <span className="font-bold text-sm text-sand-950">Acceso oficial</span>
                </div>
              </>
            )
          )}
        </section>

        {/* Cuerpo Editorial */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <section className="space-y-3">
              <h2 className="font-display font-black text-2xl text-sand-950">Descripción de la experiencia</h2>
              <p className="text-sand-700 leading-relaxed text-base whitespace-pre-line">{itemDescription}</p>
            </section>

            {isAdventure && activity ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-sand-200">
                <div className="space-y-3">
                  <h3 className="font-display font-bold text-lg text-sand-950">Equipamiento sugerido</h3>
                  <ul className="space-y-2 text-sm text-sand-700">
                    {activity.suggestedGear.map((g, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-terracotta-600 shrink-0 mt-0.5" />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-display font-bold text-lg text-sand-950">Requisitos de seguridad</h3>
                  <ul className="space-y-2 text-sm text-sand-700">
                    {activity.safetyRequirements.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              spot && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-sand-200">
                  <div className="space-y-3">
                    <h3 className="font-display font-bold text-lg text-sand-950">Aspectos clave</h3>
                    <ul className="space-y-2 text-sm text-sand-700">
                      {spot.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-terracotta-600 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-display font-bold text-lg text-sand-950">Recomendaciones oficiales</h3>
                    <ul className="space-y-2 text-sm text-sand-700">
                      {spot.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Columna Lateral de Prestadores (Aventura) o Referencia */}
          <aside className="lg:col-span-4 space-y-6">
            {isAdventure && activity && activity.certifiedProviders.length > 0 && (
              <div className="p-6 rounded-2xl border border-sand-200 bg-white space-y-4">
                <h3 className="font-display font-black text-lg text-sand-950">Prestadores habilitados</h3>
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
          </aside>
        </div>

        {/* Mapa Georreferenciado */}
        <section className="space-y-3 pt-4 border-t border-sand-200">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-terracotta-600" />
            <h2 className="font-display font-black text-xl text-sand-950">Ubicación exacta en el mapa</h2>
          </div>
          <InteractiveMapContainer
            showFilters={false}
            heightClassName="h-[380px]"
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
