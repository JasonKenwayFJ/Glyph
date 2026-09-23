import {create} from 'zustand'
import {Project} from "../types/entities/project.ts";

type ProjectStorage = {
    projects: Project[];
    currentProject: Project | null;
    setProjects: (projects: Project[]) => void;
    addProject: (project: Project) => void;
    setCurrentProject: (project: Project) => void;
}

export const useProjectStorage = create<ProjectStorage>((set) => ({
    projects: [],
    currentProject: null,
    setProjects: (projects) => set({projects}),
    addProject: (project) => set((state) => ({projects: [...state.projects, project]})),
    setCurrentProject: (project) => set({currentProject: project})
}));