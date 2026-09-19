// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod commands;
mod glyph_fs;

use commands::entity_commands::{create_entity, soft_delete_entity, get_entities, update_entity};
use commands::project_commands::{create_project, get_project, get_projects, open_project};
use commands::user_commands::{get_user, login, register};
use commands::plugin_commands::*;
use glyph_core::managers::entity_manager::EntityManager;
use glyph_core::managers::user_manager::UserManager;
use glyph_core::managers::ai_chat_manager::AiChatManager;
use glyph_core::managers::trash_manager::TrashManager;
use glyph_core::network::api_client::ApiClient;
use glyph_core::ProjectManager;
use tauri::Manager;
use glyph_core::managers::plugin_manager::PluginManager;
use glyph_fs::loader;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(
            ApiClient::new("https://glyphserver.onrender.com")
                .expect("Не удалось создать HTTP-клиент"),
        )
        .manage(PluginManager::new())
        .manage(UserManager::new())
        .manage(ProjectManager::new())
        .manage(EntityManager::new())
        .manage(TrashManager::new())
        .manage(AiChatManager::new())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            let app_handle = app.handle().clone();

            tauri::async_runtime::block_on(async move {
                let storage_dir = app_handle
                    .path()
                    .app_data_dir()
                    .expect("no app data dir");

                println!("Storage directory: {}", storage_dir.display());
                let user_manager = app_handle.state::<UserManager>();
                let project_manager = app_handle.state::<ProjectManager>();
                let entity_manager = app_handle.state::<EntityManager>();
                let plugin_manager = app_handle.state::<PluginManager>();

                match loader::preload_data(&storage_dir).await {
                    Ok(loaded) => {
                        user_manager.set_user(loaded.0);
                        project_manager.set_projects(loaded.1);
                        entity_manager.hydrate(loaded.2);
                        plugin_manager.add_plugins(loaded.3);
                        println!("loaded user");
                    }
                    Err(e) => {
                        eprintln!("Не получилось загрузить данные юзера: {e}")
                    }
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            create_project,
            open_project,
            get_projects,
            get_project,
            login,
            register,
            get_user,
            get_entities,
            create_entity,
            update_entity,
            soft_delete_entity,
            export_plugin,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
