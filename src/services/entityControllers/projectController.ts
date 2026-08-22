import type {projectEntity} from "../../../types/Entities.ts";
import {request} from "../client.ts";

export async function getProjects(): Promise<projectEntity[]> {
    return request<projectEntity[]>("Project/get_all_projects", "GET");
}

export async function getProjectById(id: string) {
    return request<projectEntity>(`Project/get_project_by_id/${id}`, "GET");
}

export async function createProject(entity: projectEntity) {
    return request<{ message: string }, projectEntity>("Project/addProject", "POST", entity);
}

export async function updateProject(entity: projectEntity) {
    return request<{ message: string }, projectEntity>("Project/update_project", "POST", entity);
}

export async function deleteProject(id: string) {
    return request<{ message: string }>(`Project/deleteProject/${id}`, "DELETE");
}
