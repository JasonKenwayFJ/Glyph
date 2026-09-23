use crate::glyph_fs::{deleter, writer};
use glyph_core::dto_entities::plugin_dto::PluginDto;
use glyph_core::entities::plugin::Plugin;
use glyph_core::managers::plugin_manager::PluginManager;
use tauri::{Emitter, Manager};
use tokio::fs;
use glyph_core::enums::CreateEntityRequest::CreateEntityRequest;
use glyph_core::managers::user_manager::UserManager;
use glyph_core::traits::entity_like::EntityLike;

#[tauri::command]
pub async fn get_plugins(
    app: tauri::AppHandle,
    _manager: tauri::State<'_, PluginManager>,
) -> Result<Vec<Plugin>, String> {
    let plugin_list = _manager.get_all_plugins();
    app.emit("OnAllPluginsGet", &plugin_list)
        .map_err(|e| e.to_string())?;
    Ok(plugin_list)
}

#[tauri::command]
pub async fn get_active_plugins(
    app: tauri::AppHandle,
    manager: tauri::State<'_, PluginManager>,
) -> Result<(), String> {
    let plugins = manager.get_active_plugins();
    app.emit("OnActivePluginGot", plugins)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn export_plugin(app: tauri::AppHandle, plugin_dto: PluginDto) -> Result<(), String> {
    let document_folder = app
        .path()
        .document_dir()
        .map_err(|error| error.to_string())?;

    let plugin = plugin_dto.get_plugin();
    writer::save_to_disk(&document_folder, &plugin)
        .await
        .map_err(|e| e.to_string())
}
#[tauri::command]
pub async fn create_plugins(
    app: tauri::AppHandle,
    manager: tauri::State<'_, PluginManager>,
    user_manager: tauri::State<'_, UserManager>,
    data: PluginDto,
) -> Result<(), String> {
    let document_folder = app
        .path()
        .document_dir()
        .map_err(|error| error.to_string())?;
    let mut plugin : Plugin = data.get_plugin();
    plugin.user_id = user_manager.get_user().unwrap().id;
    writer::save_to_disk(&document_folder, &plugin)
        .await
        .map_err(|e| e.to_string())?;

    let file_path = document_folder.join(plugin.file_name());

    plugin.size = fs::metadata(file_path)
        .await
        .map_err(|e| e.to_string())?
        .len();

    manager.add_plugin(plugin.clone())?;
    app.emit("OnPluginCreated", plugin)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_plugin(
    app: tauri::AppHandle,
    manager: tauri::State<'_, PluginManager>,
    data: Plugin,
) -> Result<(), String> {
    let document_folder = app
        .path()
        .document_dir()
        .map_err(|error| error.to_string())?;

    deleter::_hard_delete(&document_folder, &data)
        .await
        .map_err(|e| e.to_string())?;
    manager.delete_plugin(data.id)?;
    app.emit("OnPluginDeleted", data)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn activate_plugin(
    app: tauri::AppHandle,
    manager: tauri::State<'_, PluginManager>,
    data: Plugin,
) -> Result<(), String> {
    manager
        .activate_plugin(data.id)
        .map_err(|e| e.to_string())?;
    app.emit("OnPluginActivated", data)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn deactivate_plugin(
    app: tauri::AppHandle,
    manager: tauri::State<'_, PluginManager>,
    data: Plugin,
) -> Result<(), String> {
    manager
        .deactivate_plugin(data.id)
        .map_err(|e| e.to_string())?;
    app.emit("OnPluginDeactivated", data)
        .map_err(|e| e.to_string())
}
