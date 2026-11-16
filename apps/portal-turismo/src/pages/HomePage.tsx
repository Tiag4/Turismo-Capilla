import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroSection } from '../components/home/HeroSection';
import { DuoAccessSection } from '../components/home/DuoAccessSection';
import { CulturalAgendaSection } from '../components/home/CulturalAgendaSection';
import { FeaturedAttractionsSection } from '../components/home/FeaturedAttractionsSection';
import { UritorcoHighlightSection } from '../components/home/UritorcoHighlightSection';
import { AstrotourismTeaserSection } from '../components/home/AstrotourismTeaserSection';
import { FeaturedCabinsSection } from '../components/home/FeaturedCabinsSection';
import { ValleyMapSection } from '../components/home/ValleyMapSection';
import { FinalCtaSection } from '../components/home/FinalCtaSection';
import { initPortalPreviewDispatcher } from '../preview/dispatcher';
import type { CulturalEvent } from '../types/culturalEvent.types';

export const HomePage: React.FC = () => {
  const [liveEvents, setLiveEvents] = useState<CulturalEvent[] | undefined>(undefined);
  const [heroConfig] = useState<{
    title?: string;
    subtitle?: string;
    imageUrl?: string;
  }>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('turismo_capilla_portal_cms_config');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.heroConfig) {
            return parsed.heroConfig;
          }
        }
      } catch {
        // Fallback default
      }
    }
    return {
      title: 'El valle del Uritorco, directo y sin intermediarios.',
      subtitle: 'Paseos de montaña, geología milenaria y reservas seguras con prestadores habilitados oficialmente por la Secretaría de Turismo.',
      imageUrl: '/images/attractions/uritorco/uritorco-01.jpg',
    };
  });

  useEffect(() => {
    // 1. Inicializar canal de comunicación interactivo si estamos en modo CMS Preview (?preview=true)
    const cleanupPreview = initPortalPreviewDispatcher();
    window.__portalEventUpdateCallback = (events: CulturalEvent[]) => {
      setLiveEvents(events);
    };

    // 2. Animaciones GSAP
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();
    mm.add(
      {
        isNormal: '(prefers-reduced-motion: no-preference)',
        isReduced: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isReduced } = context.conditions as { isReduced: boolean };
        if (isReduced) return;

        gsap.fromTo(
          '.hero-anim',
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.1,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
          }
        );

        ScrollTrigger.batch('.gsap-duo-card', {
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              { y: 24, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.12,
                ease: 'power2.out',
                clearProps: 'transform,opacity',
              }
            );
          },
          start: 'top 92%',
          once: true,
        });

        ScrollTrigger.batch('.gsap-discover-card', {
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              { y: 20, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.55,
                stagger: 0.08,
                ease: 'power2.out',
                clearProps: 'transform,opacity',
              }
            );
          },
          start: 'top 92%',
          once: true,
        });

        ScrollTrigger.batch('.gsap-cabin-card', {
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              { y: 20, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.5,
                stagger: 0.06,
                ease: 'power2.out',
                clearProps: 'transform,opacity',
              }
            );
          },
          start: 'top 92%',
          once: true,
        });
      }
    );

    return () => {
      mm.revert();
      cleanupPreview();
      delete window.__portalEventUpdateCallback;
    };
  }, []);

  return (
    <div id="sections-container" className="flex flex-col">
      <div id="section-hero" data-editable="hero" className="w-full">
        <HeroSection
          title={heroConfig.title}
          description={heroConfig.subtitle}
          imageUrl={heroConfig.imageUrl}
        />
      </div>

      <div id="section-duoAccess" data-editable="duoAccess" className="w-full">
        <DuoAccessSection />
      </div>

      <div id="section-culturalAgenda" data-editable="culturalAgenda" className="w-full">
        <CulturalAgendaSection eventsOverride={liveEvents} />
      </div>

      <div id="section-featuredAttractions" data-editable="featuredAttractions" className="w-full">
        <FeaturedAttractionsSection />
      </div>

      <div id="section-uritorcoHighlight" data-editable="uritorcoHighlight" className="w-full">
        <UritorcoHighlightSection />
      </div>

      <div id="section-astrotourismTeaser" data-editable="astrotourismTeaser" className="w-full">
        <AstrotourismTeaserSection />
      </div>

      <div id="section-featuredCabins" data-editable="featuredCabins" className="w-full">
        <FeaturedCabinsSection />
      </div>

      <div id="section-valleyMap" data-editable="valleyMap" className="w-full">
        <ValleyMapSection />
      </div>

      <div id="section-finalCta" data-editable="finalCta" className="w-full">
        <FinalCtaSection />
      </div>
    </div>
  );
};
