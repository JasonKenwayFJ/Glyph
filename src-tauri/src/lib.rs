// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod commands;
pub mod file_manager;

use commands::entity_commands::{create_entity, delete_entity, get_entities, update_entity};
use commands::project_commands::{get_project, open_project};
use commands::user_commands::{login, register};
use file_manager::*;
use glyph_core::managers::entity_manager::EntityManager;
use glyph_core::managers::user_manager::UserManager;
use glyph_core::network::api_client::ApiClient;
use glyph_core::ProjectManager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(ApiClient::new("https://glyphserver.onrender.com").expect("Не удалось создать HTTP-клиент"))
        .manage(ProjectManager::new())
        .manage(EntityManager::new())
        .manage(UserManager::new())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            open_project,
            get_project,
            get_entities,
            create_entity,
            update_entity,
            delete_entity,
            

        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
