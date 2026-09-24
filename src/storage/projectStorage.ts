import {create} from 'zustand'
import {Project} from "../types/entities/project.ts";
import {listen} from "@tauri-apps/api/event";

type ProjectStorage = {
    projects: Project[];
    currentProject: Project | null;
    setProjects: (projects: Project[]) => void;
    addProject: (project: Project) => void;
    setCurrentProject: (project: Project) => void;
}

export const useProjectStorage = create<ProjectStorage>((set) => {
    void listen<Project>("OnProjectSelected", (event) => {
        set({ currentProject: event.payload });
        console.log("Project Selected")
    }).catch((error) => console.error("Не удалось подписаться на OnProjectSelected:", error));

    void listen<Project>("OnProjectCreated", (event) => {
        set((state) => ({ projects: [...state.projects, event.payload] }));
        console.log("Project Created")
    }).catch((error) => console.error("Не удалось подписаться на OnProjectCreated:", error));

    return {
        projects: [],
        currentProject: null,
        setProjects: (projects) => set({ projects }),
        addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
        setCurrentProject: (project) => set({ currentProject: project }),
    };
});