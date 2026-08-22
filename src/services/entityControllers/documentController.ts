import type {baseEntity} from "../../../types/Entities.ts";
import {request} from "../client.ts";

export async function getDocuments(): Promise<baseEntity[]> {
    return request<baseEntity[]>("Document/get_all_documents", "GET");
}

export async function getDocumentById(id: string) {
    return request<baseEntity>(`Document/get_document_by_id/${id}`, "GET");
}

export async function createDocument(entity: baseEntity) {
    return request<{ message: string }, baseEntity>("Document/create_document", "POST", entity);
}

export async function updateDocument(entity: baseEntity) {
    return request<{ message: string }, baseEntity>("Document/update_document", "POST", entity);
}

export async function deleteDocument(id: string) {
    return request<{ message: string }>(`Document/delete_document/${id}`, "DELETE");
}

