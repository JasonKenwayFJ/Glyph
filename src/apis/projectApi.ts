import {CreateEntityRequest} from "../types/CreateEntityRequest.ts";
import {invoke} from "@tauri-apps/api/core";


export async function getProjects(){
    await invoke('get_projects')
}
export async function getCurrentProject(){
    await invoke('get_project')
}
export async function openProject(data: CreateEntityRequest) {
    await invoke('registration', data)
}
export async function createProject(data: CreateEntityRequest) {
    await invoke('create_project', data)
}
export async function updateProject(data: CreateEntityRequest) {
    await invoke('registration', data)
}
export async function saveProject(data: CreateEntityRequest) {
    await invoke('registration', data)
}
export async function deleteProject(data: CreateEntityRequest) {
    await invoke('registration', data)
}

