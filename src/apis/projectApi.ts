import {invoke} from "@tauri-apps/api/core";
import {Project} from "../types/entities/project.ts";
import {ProjectDTO} from "../types/DTO/projectDTO.ts";


export async function getProjects(){
    await invoke('get_projects')
}
export async function getCurrentProject(){
    await invoke('get_project')
}
export async function openProject(data: Project) {
    await invoke('open_project', {data})
}
export async function createProject(dto: ProjectDTO) {
    return await invoke<Project>("create_entity", {
        data: { type: "Project", ...dto },
    });
}
export async function updateProject(data: Project) {
    await invoke('update_project', {data})
}
export async function saveProject(data: Project) {
    await invoke('save_project', {data})
}
export async function deleteProject(data: Project) {
    await invoke('delete_project', {data})
}

