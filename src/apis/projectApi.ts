import {invoke} from "@tauri-apps/api/core";
import {ProjectDTO} from "../types/DTO/projectDTO.ts";
import {ProjectEntity} from "../types/entities/baseEntity.ts";


export async function getProjects(){
    return await invoke('get_projects')
}
export async function getCurrentProject(){
    return await invoke('get_project')
}
export async function openProject(data: ProjectEntity) {
    await invoke('open_project', {data})
}
export async function createProject(dto: ProjectDTO) {
    return await invoke<ProjectEntity>("create_entity", {
        data: { type: "Project", ...dto },
    });
}
export async function updateProject(data: ProjectEntity) {
    await invoke('update_project', {data})
}
export async function saveProject(data: ProjectEntity) {
    await invoke('save_project', {data})
}
export async function deleteProject(data: ProjectEntity) {
    await invoke('delete_project', {data})
}

