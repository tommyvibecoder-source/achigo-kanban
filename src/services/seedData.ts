import { Project, TeamMember, IdeaCard } from '../types';

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'user-1',
    name: 'Zogo',
    username: 'zogo',
    role: 'Co-Founder & CEO',
    roleType: 'founder',
    avatar: '👨‍💼',
    color: '#0052CC',
    passcode: 'zogo2026',
    mustResetPasscode: false,
    email: 'zogo@achigo.tech',
  },
  {
    id: 'user-2',
    name: 'Achiri',
    username: 'achiri',
    role: 'Co-Founder & Product Architect',
    roleType: 'founder',
    avatar: '🚀',
    color: '#6554C0',
    passcode: 'achiri2026',
    mustResetPasscode: false,
    email: 'achiri@achigo.tech',
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    keyPrefix: 'ACH',
    name: 'AchiGO Core Platform',
    description: 'Enterprise Tech Production Kanban & Spec Orchestration Engine.',
    color: '#0052CC',
    icon: 'FolderKanban',
    createdAt: '2026-08-01T10:00:00.000Z',
  },
  {
    id: 'proj-2',
    keyPrefix: 'OMN',
    name: 'OmniFlow Automation',
    description: 'Autonomous workflow orchestration and multi-agent task dispatching.',
    color: '#00875A',
    icon: 'FolderKanban',
    createdAt: '2026-08-05T12:00:00.000Z',
  },
];

export const INITIAL_IDEAS: IdeaCard[] = [];
