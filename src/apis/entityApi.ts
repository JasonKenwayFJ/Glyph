import {invoke} from "@tauri-apps/api/core";
import {CreateEntityRequest} from "../types/CreateEntityRequest.ts";

export async function preloadEntities(){
    await invoke('get_entities')
}

export async function createEntity(data: CreateEntityRequest){
    await invoke('create_entity', data)
}

//TODO: Заменить CreateEntityRequest на какой-нить дженерик
export async function updateEntity(data: CreateEntityRequest){
    await invoke('update_entity', data)
}
export async function softDelete(data: CreateEntityRequest){
    await invoke('soft_delete_entity', data)
}
export async function hardDelete(data: CreateEntityRequest){
    await invoke('hard_delete_entity', data)
}