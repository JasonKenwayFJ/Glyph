use crate::glyph_fs::{deleter, loader, writer};
use glyph_core::entities::plugin::Plugin;
use glyph_core::managers::plugin_manager::PluginManager;
use tauri::{Emitter, Manager};

#[tauri::command]
pub async fn _get_plugins(
    app: tauri::AppHandle,
    _manager: tauri::State<'_, PluginManager>,
) -> Result<Vec<Plugin>, String> {
    let document_folder = app
        .path()
        .document_dir()
        .map_err(|error| error.to_string())?;

    let plugs = loader::load_plugins(&document_folder).await;
    plugs
}

#[tauri::command]
pub async fn _get_active_plugins(
    app: tauri::AppHandle,
    manager: PluginManager
) -> Result<(), String> {
    let plugins = manager.get_active_plugins().ok_or("Error while getting active plugins".to_string())?;
    app.emit("OnPluginDeactivated", plugins)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn _create_plugins(
    app: tauri::AppHandle,
    manager: tauri::State<'_, PluginManager>,
    plugin: Plugin,
) -> Result<(), String> {
    let document_folder = app
        .path()
        .document_dir()
        .map_err(|error| error.to_string())?;

    writer::save_to_disk(&document_folder, &plugin)
        .await
        .map_err(|e| e.to_string())?;
    manager.add_plugin(plugin.clone())?;
    app.emit("OnPluginCreated", plugin)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn _delete_plugins(
    app: tauri::AppHandle,
    manager: PluginManager,
    plugin: Plugin,
) -> Result<(), String> {
    let document_folder = app
        .path()
        .document_dir()
        .map_err(|error| error.to_string())?;

    manager.delete_plugin(plugin.id)?;
    deleter::_hard_delete(&document_folder, &plugin)
        .await
        .map_err(|e| e.to_string())?;
    app.emit("OnPluginDeleted", plugin)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn _activate_plugin(
    app: tauri::AppHandle,
    manager: PluginManager,
    plugin: Plugin) -> Result<(), String>{
    manager.activate_plugin(plugin.id).map_err(|e| e.to_string())?;
    app.emit("OnPluginActivated", plugin)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn _deactivate_plugin(
    app: tauri::AppHandle,
    manager: PluginManager,
    plugin: Plugin) -> Result<(), String>{
    manager.deactivate_plugin(plugin.id).map_err(|e| e.to_string())?;
    app.emit("OnPluginDeactivated", plugin)
        .map_err(|e| e.to_string())
}