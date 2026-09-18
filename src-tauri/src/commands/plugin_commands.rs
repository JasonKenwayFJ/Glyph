use tauri::Manager;
use glyph_core::entities::plugin::Plugin;
use glyph_core::managers::plugin_manager::PluginManager;
use crate::glyph_fs;

#[tauri::command]
pub async fn get_plugins(
    app: tauri::AppHandle,
    manager: tauri::State<'_,PluginManager>
) -> Result<Vec<Plugin>, String> {
    let document_folder = app.path()
        .document_dir()
        .map_err(|error| error.to_string())?;



    let plugins = manager.get_all_plugins().ok_or("No plugins found".to_string())?

}