import {CreateEntityRequest} from "../types/createEntityRequest.ts";
import {invoke} from "@tauri-apps/api/core";

export async function registration(data: CreateEntityRequest) {
    await invoke('registration', data)
}

export async function authorization(data: CreateEntityRequest) {
    await invoke('authorization', data)
}

export async function verifyUser() : Promise<boolean> {
    return await invoke('verify_user')
}