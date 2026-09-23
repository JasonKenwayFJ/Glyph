mod commands;
mod glyph_fs;


use glyph_core::managers::user_manager::UserManager;
use glyph_core::managers::ai_chat_manager::AiChatManager;
use glyph_core::network::api_client::ApiClient;
use glyph_core::ProjectManager;
use tauri::Manager;
use glyph_core::managers::plugin_manager::PluginManager;
use glyph_fs::loader;
use crate::commands::ai_chat_commands::{clear_messages, get_messages, send_image, send_message};
use crate::commands::commands::{create_entity, get_entities, hard_delete_entity, soft_delete_entity, update_entity};
use crate::commands::plugin_commands::{activate_plugin, create_plugins, deactivate_plugin, delete_plugin, export_plugin, get_active_plugins, get_plugins};
use crate::commands::project_commands::{create_project, get_project, get_projects, open_project};
use crate::commands::user_commands::{authorization, delete_account, registration, verify_user};

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

                println!("storage directory: {}", app_data_dir.display());
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
            });

            Ok(())
        })

        .invoke_handler(tauri::generate_handler![
            
            registration,
            authorization,
            verify_user,
            delete_account,
            
            create_project,
            open_project,
            get_projects,
            get_project,

            get_plugins,
            get_active_plugins,
            create_plugins,
            delete_plugin,
            activate_plugin,
            deactivate_plugin,
            export_plugin,

            get_entities,
            create_entity,
            update_entity,
            soft_delete_entity,
            hard_delete_entity,

            send_message,
            get_messages,
            clear_messages,
            send_image
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
            }