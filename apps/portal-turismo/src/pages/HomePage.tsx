import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroSection } from '../components/home/HeroSection';
import { DuoAccessSection } from '../components/home/DuoAccessSection';
import { FeaturedAttractionsSection } from '../components/home/FeaturedAttractionsSection';
import { UritorcoHighlightSection } from '../components/home/UritorcoHighlightSection';
import { AstrotourismTeaserSection } from '../components/home/AstrotourismTeaserSection';
import { FeaturedCabinsSection } from '../components/home/FeaturedCabinsSection';
import { ValleyMapSection } from '../components/home/ValleyMapSection';
import { HeritageCircuitSection } from '../components/home/HeritageCircuitSection';
import { FinalCtaSection } from '../components/home/FinalCtaSection';

export const HomePage: React.FC = () => {
  useEffect(() => {
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
    };
  }, []);

  return (
    <>
      <HeroSection />
      <DuoAccessSection />
      <FeaturedAttractionsSection />
      <UritorcoHighlightSection />
      <AstrotourismTeaserSection />
      <FeaturedCabinsSection />
      <ValleyMapSection />
      <HeritageCircuitSection />
      <FinalCtaSection />
    </>
  );
};
