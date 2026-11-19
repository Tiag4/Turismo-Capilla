export interface TeamMember {
  id: string;
  name: string;
  githubUsername: string;
  githubUrl: string;
  avatarUrl: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'martino-costigliolo',
    name: 'Martino Costigliolo',
    githubUsername: 'Martino17x',
    githubUrl: 'https://github.com/Martino17x',
    avatarUrl: 'https://avatars.githubusercontent.com/u/108624897?v=4',
  },
  {
    id: 'juan-cruz-larcher',
    name: 'Juan Cruz Larcher',
    githubUsername: 'juanetee07',
    githubUrl: 'https://github.com/juanetee07',
    avatarUrl: 'https://avatars.githubusercontent.com/u/111915741?v=4',
  },
  {
    id: 'tiago-amante-nicolitsis',
    name: 'Tiago Amante Nicolitsis',
    githubUsername: 'Tiag4',
    githubUrl: 'https://github.com/Tiag4',
    avatarUrl: 'https://avatars.githubusercontent.com/u/166666475?v=4',
  },
];
