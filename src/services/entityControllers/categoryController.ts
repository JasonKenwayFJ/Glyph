import type { baseCharacteristic } from "../../../types/Entities.ts";
import { request } from "../client.ts";

export async function getCategories(): Promise<baseCharacteristic[]> {
    return request<baseCharacteristic[]>("Category/get_all_categories", "GET");
}

export async function createCategory(entity: baseCharacteristic): Promise<{ message: string }> {
    return request<{ message: string }, baseCharacteristic>("Category/create_category", "POST", entity);
}

export async function deleteCategory(id: string): Promise<{ message: string }> {
    return request<{ message: string }>(`Category/delete_category/${id}`, "DELETE");
}