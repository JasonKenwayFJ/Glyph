import {create} from 'zustand'
import {listen} from "@tauri-apps/api/event";
import {ProjectEntity} from "../types/entities/baseEntity.ts";

type ProjectStorage = {
    projects: ProjectEntity[];
    currentProject: ProjectEntity | null;
    setProjects: (projects: ProjectEntity[]) => void;
    setCurrentProject: (project: ProjectEntity) => void;
}

export const useProjectStorage = create<ProjectStorage>((set) => {
    void listen<ProjectEntity>("OnProjectSelected", (event) => {
        set({ currentProject: event.payload });
        console.log("Project Selected")
    }).catch((error) => console.error("Не удалось подписаться на OnProjectSelected:", error));

    void listen<ProjectEntity>("OnProjectCreated", (event) => {
        set((state) => ({ projects: [...state.projects, event.payload] }));
        console.log("Project Created")
    }).catch((error) => console.error("Не удалось подписаться на OnProjectCreated:", error));

    void listen<ProjectEntity>("OnProjectDeleted", (event) => {
        set((state) => ({ projects: state.projects.filter((p) => p.id !== event.payload.id) }));
        console.log("Project Deleted")
    }).catch((error) => console.error("Не удалось подписаться на OnProjectDeleted:", error));

    void listen<ProjectEntity[]>("OnProjectsLoaded", (event) => {
        set({ projects: event.payload });
    }).catch((error) => console.error("Не удалось подписаться на OnProjectsLoaded:", error));

    return {
        projects: [],
        currentProject: null,
        setProjects: (projects) => set({ projects }),
        setCurrentProject: (project) => set({ currentProject: project }),
    };
});