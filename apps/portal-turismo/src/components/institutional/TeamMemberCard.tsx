import React from 'react';
import { ExternalLink, MapPin } from 'lucide-react';
import type { TeamMember } from './types';

const GitHubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

export interface TeamMemberCardProps {
  member: TeamMember;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
  return (
    <article className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white border border-sand-200 shadow-xs hover:border-sand-300 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center gap-4">
        <img
          src={member.avatarUrl}
          alt={`Fotografía de ${member.name}`}
          className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border border-sand-200 bg-sand-100 shrink-0"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            target.src = 'https://avatars.githubusercontent.com/u/9919?v=4';
          }}
        />

        <div className="min-w-0 flex-1">
          <h3 className="font-display font-bold text-lg sm:text-xl text-sand-900 leading-snug truncate">
            {member.name}
          </h3>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-sm text-sand-500 font-medium">
              @{member.githubUsername}
            </span>
            <span className="text-sand-300 font-bold" aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 text-xs text-sand-600 font-medium">
              <MapPin className="w-3 h-3 text-terracotta-500 shrink-0" aria-hidden="true" />
              <span>{member.location}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="pt-5 mt-6 border-t border-sand-100">
        <a
          href={member.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Ver perfil de GitHub de ${member.name} (se abre en una ventana nueva)`}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sand-900 hover:bg-terracotta-600 text-white text-xs font-bold transition-colors duration-300 ease-in-out cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-600"
        >
          <GitHubIcon className="w-4 h-4 text-white" />
          <span>Ver perfil en GitHub</span>
          <ExternalLink className="w-3.5 h-3.5 text-sand-400 group-hover:text-white transition-colors duration-300 ease-in-out" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
};
