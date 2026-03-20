import { create } from 'zustand';

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  color: string;
  icon: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Entry {
  id: string;
  project_id: string;
  user_id: string;
  app_name: string;
  url: string | null;
  login: string | null;
  password_encrypted: string;
  notes: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  entries: Entry[];
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  setEntries: (entries: Entry[]) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  entries: [],
  setProjects: (projects) => set({ projects }),
  setCurrentProject: (currentProject) => set({ currentProject }),
  setEntries: (entries) => set({ entries }),
}));
