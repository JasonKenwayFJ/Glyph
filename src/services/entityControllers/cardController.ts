import type {baseEntity} from "../../../types/Entities.ts";
import {request} from "../client.ts";


export async function getCards(projectId: string): Promise<baseEntity[]> {
    return request<baseEntity[]>(`Card/get_all_cards/${projectId}`, "GET");
}

export async function getCardById(id: string) {
    return request<baseEntity>(`Card/get_card_by_id/${id}`, "GET");
}

export async function createCard(entity: baseEntity) {
    return request<{ message: string }, baseEntity>("Card/create_card", "POST", entity);
}

export async function updateCard(entity: baseEntity) {
    return request<{ message: string }, baseEntity>("Card/update_card", "POST", entity);
}

export async function deleteCard(id: string) {
    return request<{ message: string }>(`Card/delete_card/${id}`, "DELETE");
}
