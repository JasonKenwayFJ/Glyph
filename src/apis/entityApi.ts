import {invoke} from "@tauri-apps/api/core";
import {CreateEntityRequest} from "../types/createEntityRequest.ts";
import {BaseEntity} from "../types/entities/baseEntity.ts";

export async function getEntities(entityType: string){
    return await invoke<BaseEntity[]>('get_entities', {entityType})
}

export async function loadEntities(entityType: string){
    return await invoke<BaseEntity[]>('load_entities', {entityType})
}

export async function createEntity<T>(data: CreateEntityRequest){
    await invoke<T>('create_entity', {data})
}

export async function updateEntity(data: BaseEntity){
    await invoke('update_entity', {data})
}
export async function softDelete(data: CreateEntityRequest){
    await invoke('soft_delete_entity', {data})
}
export async function hardDelete(data: CreateEntityRequest){
    await invoke('hard_delete_entity', {data})
}