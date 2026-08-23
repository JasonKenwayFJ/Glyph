// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod commands;
use glyph_core::{ProjectManager, UserManager, ApiClient};
use tauri::Emitter;
use commands::project_commands::{open_project, get_project};
use commands::user_commands::{register, login};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(ProjectManager::new())
        .manage(UserManager::new())
        .manage(ApiClient::new("https://glyphserver.onrender.com"))
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            open_project,
            get_project,
            register,
            login
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
