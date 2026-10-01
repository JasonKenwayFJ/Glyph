import {create} from 'zustand'
import {Project} from "../types/entities/project.ts";
import {listen} from "@tauri-apps/api/event";

type ProjectStorage = {
    projects: Project[];
    currentProject: Project | null;
    setProjects: (projects: Project[]) => void;
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

    void listen<Project>("OnProjectDeleted", (event) => {
        set((state) => ({ projects: state.projects.filter((p) => p.id !== event.payload.id) }));
        console.log("Project Deleted")
    }).catch((error) => console.error("Не удалось подписаться на OnProjectDeleted:", error));

    return {
        projects: [],
        currentProject: null,
        setProjects: (projects) => set({ projects }),
        setCurrentProject: (project) => set({ currentProject: project }),
    };
});