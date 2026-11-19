export interface TeamMember {
  id: string;
  name: string;
  githubUsername: string;
  githubUrl: string;
  avatarUrl: string;
  role: string;
  specialty: string;
  bio: string;
  badges: string[];
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'martino-costigliolo',
    name: 'Martino Costigliolo',
    githubUsername: 'Martino17x',
    githubUrl: 'https://github.com/Martino17x',
    avatarUrl: 'https://avatars.githubusercontent.com/u/108624897?v=4',
    role: 'Arquitectura de Software & Full-Stack',
    specialty: 'Diseño de Sistemas y Motor de Reservas',
    bio: 'Arquitectura de software desacoplada, diseño de flujos transaccionales, sistema de disponibilidad y sincronización en tiempo real para el CMS.',
    badges: ['Arquitectura Limpia', 'Full-Stack', 'UI/UX'],
  },
  {
    id: 'juan-cruz-larcher',
    name: 'Juan Cruz Larcher',
    githubUsername: 'juanetee07',
    githubUrl: 'https://github.com/juanetee07',
    avatarUrl: 'https://avatars.githubusercontent.com/u/111915741?v=4',
    role: 'Desarrollo Frontend & Experiencia de Usuario',
    specialty: 'Interfaces Turísticas y Accesibilidad',
    bio: 'Implementación de componentes interactivos, diseño accesible conforme a pautas WCAG y experiencia visual adaptada a la identidad serrana.',
    badges: ['Frontend', 'Tailwind CSS', 'Accesibilidad'],
  },
  {
    id: 'tiago-amante-nicolitsis',
    name: 'Tiago Amante Nicolitsis',
    githubUsername: 'Tiag4',
    githubUrl: 'https://github.com/Tiag4',
    avatarUrl: 'https://avatars.githubusercontent.com/u/166666475?v=4',
    role: 'Ingeniería de Backend & Base de Datos',
    specialty: 'Servicios REST e Infraestructura',
    bio: 'Modelado relacional de datos, seguridad de la plataforma, integración de endpoints para alojamientos y eventos culturales.',
    badges: ['Backend REST', 'Bases de Datos', 'Infraestructura'],
  },
];
