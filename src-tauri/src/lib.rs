// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod commands;
mod glyph_fs;

use commands::project_commands::{create_project, get_project, get_projects, open_project};
use commands::plugin_commands::*;
use glyph_core::managers::user_manager::UserManager;
use glyph_core::managers::ai_chat_manager::AiChatManager;
use glyph_core::network::api_client::ApiClient;
use glyph_core::ProjectManager;
use tauri::Manager;
use glyph_core::managers::plugin_manager::PluginManager;
use glyph_fs::loader;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
            .plugin(tauri_plugin_dialog::init())
        .manage(
            ApiClient::new("https://glyphserver.onrender.com")
                .expect("Не удалось создать HTTP-клиент"),
        )
        .manage(PluginManager::new())
        .manage(UserManager::new())
        .manage(ProjectManager::new())
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
                let app_data_dir = app
                    .path()
                    .document_dir()
                    .expect("no app data dir")
                    .join("Glyph");

                println!("Storage directory: {}", app_data_dir.display());
                let user_manager = app_handle.state::<UserManager>();
                let project_manager = app_handle.state::<ProjectManager>();
                let plugin_manager = app_handle.state::<PluginManager>();


                match loader::load_user(&app_data_dir).await {
                    Ok(user) => user_manager.set_user(user),
                    Err(e) => eprintln!("Не удалось загрузить юзера: {e}"),
                }

                match loader::load_projects(&app_data_dir).await {
                    Ok(projects) => project_manager.set_projects(projects),
                    Err(e) => eprintln!("Не удалось загрузить проекты: {e}"),
                }

                match loader::load_plugins(&app_data_dir).await {
                    Ok(plugins) => plugin_manager.add_plugins(plugins),
                    Err(e) => eprintln!("Не удалось загрузить плагины: {e}"),
                }



                // match loader::preload_data(&storage_dir).await {
                //     Ok(loaded) => {
                //         user_manager.set_user(loaded.0);
                //         project_manager.set_projects(loaded.1);
                //         plugin_manager.add_plugins(loaded.3);
                //         println!("loaded user");
                //     }
                //     Err(e) => {
                //         eprintln!("Не получилось загрузить данные юзера: {e}")
                //     }
                // }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            create_project,
            open_project,
            get_projects,
            get_project,
            export_plugin,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
