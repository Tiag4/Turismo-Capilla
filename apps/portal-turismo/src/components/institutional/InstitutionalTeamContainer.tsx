import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TEAM_MEMBERS } from './types';
import { TeamMemberCard } from './TeamMemberCard';
import { UpcPartnershipBanner } from './UpcPartnershipBanner';

export const InstitutionalTeamContainer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.gsap-team-card', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.12,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="space-y-14">
      {/* Sección del Equipo */}
      <section className="space-y-6">
        <div className="max-w-2xl space-y-2">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-sand-900 tracking-tight">
            Estudiantes a cargo del desarrollo
          </h2>
          <p className="text-sm sm:text-base text-sand-600 leading-relaxed font-normal">
            Estudiantes del último año de la Tecnicatura en Desarrollo de Software de la Universidad Provincial de Córdoba (Sede Capilla del Monte).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.id} className="gsap-team-card">
              <TeamMemberCard member={member} />
            </div>
          ))}
        </div>
      </section>

      {/* Banner Institucional UPC & Cámara */}
      <UpcPartnershipBanner />
    </div>
  );
};
