import {invoke} from "@tauri-apps/api/core";

export async function getPlugins(){
    await invoke('get_plugins')
}

export async function getActivePlugins(){
    await invoke('get_active_plugins')
}
export async function export_plugin(){
    await invoke('export_plugin')
}

export async function createPlugin(){
    await invoke('create_plugins')
}
export async function deletePlugin(){
    await invoke('delete_plugin')
}

export async function activatePlugin(){
    await invoke('activate_plugin')
}
export async function deactivatePlugin(){
    await invoke('deactivate_plugin')
}
