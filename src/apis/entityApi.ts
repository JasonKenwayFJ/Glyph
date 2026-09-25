import {invoke} from "@tauri-apps/api/core";
import {CreateEntityRequest} from "../types/createEntityRequest.ts";

export async function preloadEntities(){
    await invoke('get_entities')
}

export async function createEntity<T>(entity: T, entity_type: string){
    let data = {type: entity_type, entity}
    await invoke('create_entity', {data})
}

//TODO: Заменить CreateEntityRequest на какой-нить дженерик
export async function updateEntity(data: CreateEntityRequest){
    await invoke('update_entity', {data})
}
export async function softDelete(data: CreateEntityRequest){
    await invoke('soft_delete_entity', {data})
}
export async function hardDelete(data: CreateEntityRequest){
    await invoke('hard_delete_entity', {data})
}