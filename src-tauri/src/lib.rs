// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod commands;
pub mod file_manager;

use commands::entity_commands::{create_entity, delete_entity, get_entities, update_entity};
use commands::project_commands::{get_project, open_project, create_project};
use commands::user_commands::{login, register, get_user};
use glyph_core::managers::entity_manager::EntityManager;
use glyph_core::managers::user_manager::UserManager;
use glyph_core::network::api_client::ApiClient;
use glyph_core::ProjectManager;
use tauri::Manager;
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(
            ApiClient::new("https://glyphserver.onrender.com")
                .expect("Не удалось создать HTTP-клиент"),
        )
        .manage(ProjectManager::new())
        .manage(EntityManager::new())
        .manage(UserManager::new())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            // ===== Загрузка данных с диска при старте =====

            // Клонируем "ручку" на приложение — она нужна внутри
            // async-блока, который переживёт саму функцию setup
            let app_handle = app.handle().clone();

            // Запускаем асинхронную задачу в фоне, не блокируя открытие окна
            tauri::async_runtime::spawn(async move {
                // Путь к папке данных приложения (свой на каждой платформе)
                let storage_dir = app_handle
                    .path()
                    .app_data_dir()
                    .expect("no app data dir");

                // Достаём тот самый EntityManager, что зарегистрировали через .manage()
                let entity_manager = app_handle.state::<EntityManager>();

                // Пытаемся загрузить сущности с диска
                match file_manager::load_entities(&storage_dir).await {
                    Ok(loaded) => {
                        entity_manager.hydrate(loaded);
                        println!("Сущности успешно загружены с диска");
                    }
                    Err(e) => {
                        eprintln!("Не удалось загрузить сущности: {e}");
                    }
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            create_project,
            open_project,
            get_project,
            login,
            register,
            get_user,
            get_entities,
            create_entity,
            update_entity,
            delete_entity,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
