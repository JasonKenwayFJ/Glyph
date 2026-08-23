// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use glyph_core::{ProjectManager, Project};
use tauri::Emitter;
use commands::project_commands::{open_project, get_project};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(ProjectManager::new())
        .manage(UserManager::new())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
