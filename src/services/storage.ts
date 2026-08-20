import { Project, IdeaCard, TeamMember } from '../types';
import { INITIAL_PROJECTS, INITIAL_IDEAS, INITIAL_TEAM_MEMBERS } from './seedData';

const STORAGE_KEYS = {
  PROJECTS: 'tpk_projects_v1',
  IDEAS: 'tpk_ideas_v1',
  TEAM: 'tpk_team_v1',
  ACTIVE_PROJECT: 'tpk_active_project_v1',
  ACTIVE_USER: 'tpk_active_user_v1',
};

export const storage = {
  getProjects(): Project[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load projects from storage:', e);
    }
    return INITIAL_PROJECTS;
  },

  saveProjects(projects: Project[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects:', e);
    }
  },

  getIdeas(): IdeaCard[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.IDEAS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load ideas from storage:', e);
    }
    return INITIAL_IDEAS;
  },

  saveIdeas(ideas: IdeaCard[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(ideas));
    } catch (e) {
      console.error('Failed to save ideas:', e);
    }
  },

  getTeamMembers(): TeamMember[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEAM);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load team from storage:', e);
    }
    return INITIAL_TEAM_MEMBERS;
  },

  saveTeamMembers(team: TeamMember[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(team));
    } catch (e) {
      console.error('Failed to save team:', e);
    }
  },

  getActiveProjectId(): string {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_PROJECT) || INITIAL_PROJECTS[0].id;
  },

  saveActiveProjectId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT, id);
  },

  getActiveUserId(): string {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_USER) || INITIAL_TEAM_MEMBERS[0].id;
  },

  saveActiveUserId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, id);
  },

  resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.IDEAS);
    localStorage.removeItem(STORAGE_KEYS.TEAM);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_PROJECT);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
  },
};
