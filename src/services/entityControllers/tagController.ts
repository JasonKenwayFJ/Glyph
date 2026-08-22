import type { baseCharacteristic } from "../../../types/Entities.ts";
import { request } from "../client.ts";

export async function getTags(): Promise<baseCharacteristic[]> {
    return request<baseCharacteristic[]>("Tag/get_all_tags", "GET");
}

export async function createTag(entity: baseCharacteristic): Promise<{ message: string }> {
    return request<{ message: string }, baseCharacteristic>("Tag/create_tag", "POST", entity);
}

export async function deleteTag(id: string): Promise<{ message: string }> {
    return request<{ message: string }>(`Tag/delete_tag/${id}`, "DELETE");
}