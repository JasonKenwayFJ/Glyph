import {invoke} from "@tauri-apps/api/core";
import {PluginDto} from "../types/DTO/PluginDto.ts";

export async function getPlugins(){
    await invoke('get_plugins')
}

export async function getActivePlugins(){
    await invoke('get_active_plugins')
}
export async function export_plugin(data: PluginDto){
    await invoke('export_plugin', data)
}

export async function createPlugin(data: PluginDto){
    await invoke('create_plugins', data)
}
export async function deletePlugin(data: PluginDto){
    await invoke('delete_plugin', data)
}

export async function activatePlugin(data: PluginDto){
    await invoke('activate_plugin', data)
}
export async function deactivatePlugin(data: PluginDto){
    await invoke('deactivate_plugin', data)
}
