use tauri::{Emitter, Manager};
use glyph_core::entities::plugin::Plugin;
use glyph_core::managers::plugin_manager::PluginManager;
use crate::glyph_fs::{deleter, loader, writer};

#[tauri::command]
pub async fn get_plugins(
    app: tauri::AppHandle,
    manager: tauri::State<'_,PluginManager>
) -> Result<Vec<Plugin>, String> {
    let document_folder = app.path()
        .document_dir()
        .map_err(|error| error.to_string())?;

    let plugs = loader::load_plugins(&document_folder).await;

    let plugins = manager.get_all_plugins().ok_or("No plugins found".to_string())?;
    plugs

}

#[tauri::command]
pub async fn create_plugins(
    app: tauri::AppHandle,
    manager: tauri::State<'_,PluginManager>,
    plugin: Plugin
) -> Result<(), String>{
    let document_folder = app.path()
        .document_dir()
        .map_err(|error| error.to_string())?;
    
    writer::save_to_disk(&document_folder, &plugin).await.map_err(|e| e.to_string())?;
    manager.add_plugin(plugin.clone())?;
    app.emit("OnPluginCreated", plugin).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_plugins(
    app: tauri::AppHandle,
    manager: PluginManager,
    plugin: Plugin
) -> Result<(), String> {
    let document_folder = app.path()
        .document_dir()
        .map_err(|error| error.to_string())?;
    
    
    manager.delete_plugin(plugin.id)?;
    deleter::_hard_delete(&document_folder, &plugin).await.map_err(|e| e.to_string())?;
    app.emit("OnPluginDeleted", plugin).map_err(|e| e.to_string())
}

