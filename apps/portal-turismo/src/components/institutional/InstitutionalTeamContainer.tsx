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
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="space-y-16">
      {/* Sección del Equipo */}
      <section className="space-y-6">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-terracotta-700 bg-amber-50 px-3 py-1 rounded-md border border-amber-200 inline-block">
            Equipo Desarrollador
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-sand-900 tracking-tight">
            Estudiantes a cargo del proyecto
          </h2>
          <p className="text-sm text-sand-600 leading-relaxed font-normal">
            Conocé a los autores del motor de reservas y portal de promoción turística, su rol técnico y su repositorio de trabajo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
