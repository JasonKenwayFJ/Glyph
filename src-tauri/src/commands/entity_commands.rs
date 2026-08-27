use crate::file_manager;
use glyph_core::entities::entity::{Entity, EntityType};
use glyph_core::managers::entity_manager::EntityManager;
use glyph_core::network::api_client::{ApiClient, ApiResponse};
use glyph_core::network::entity_service;
use tauri::{Manager};
use glyph_core::dto_entities::entity_dto::EntityDto;

#[tauri::command]
pub async fn get_entities(
    app: tauri::AppHandle,
    entity_state: tauri::State<'_, EntityManager>,
    r#type: EntityType,
) -> Result<Vec<Entity>, String> {
    let app_data_dir = app.path().app_data_dir().expect("no app data dir");
    println!("App data dir: {}", app_data_dir.display());
    let loaded = file_manager::load_entities(&app_data_dir)
        .await?;
    entity_state.hydrate(loaded);
    entity_state.get_entities(r#type)
}


// #[tauri::command]
// pub async fn get_entities(
//     entity_type: EntityType,
//     api_state: tauri::State<'_, ApiClient>,
//     entity_state: tauri::State<'_, EntityManager>,
// ) -> Result<ApiResponse<Vec<Entity>>, String> {
//     let local_entities = entity_state.get_entities(entity_type);
//
//     if !local_entities.is_empty() {
//         return Ok(ApiResponse {
//             success: true,
//             message: "Entities loaded from cache".to_string(),
//             status: 200,
//             data: Some(local_entities),
//         });
//     }
//
//     let response = entity_service::get_entities::<Vec<Entity>>(
//         api_state.inner(),
//         entity_type,
//     ).await?;
//
//     Ok(response)
// }

#[tauri::command]
pub async fn create_entity(
    app: tauri::AppHandle,
    api_state: tauri::State<'_, ApiClient>,
    entity_state: tauri::State<'_, EntityManager>,
    entity: EntityDto,
) -> Result<ApiResponse<()>, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|error| error.to_string())?;
    println!("App data dir: {}", app_data_dir.display());
    let final_entity = entity.get_entity();

    let response =
        entity_service::create_entity::<()>(api_state.inner(), &final_entity).await?;
    if !response.success { return Err(response.message); }
    println!(
        "Success: {}, Status Code: {}, message: {}",
        response.success,
        response.status,
        response.message
    );
    // 1. Сохраняем на диск
    file_manager::save_to_disk(&app_data_dir, &final_entity).await?;

    println!("Сущность успешно сохранена на диск");

    // 2. Отправляем на сервер

    // 3. Добавляем локально
    entity_state.add_entity_locally(&final_entity);

    println!("Сущность успешно добавлена локально");

    Ok(response)
}

#[tauri::command]
pub async fn update_entity(
    api_state: tauri::State<'_, ApiClient>,
    entity_state: tauri::State<'_, EntityManager>,
    entity: Entity,
) -> Result<ApiResponse<()>, String> {
    let response = entity_service::update_entity::<()>(api_state.inner(), &entity).await?;
    entity_state.update_entity_locally(&entity);
    Ok(response)
}
#[tauri::command]
pub async fn delete_entity(
    api_state: tauri::State<'_, ApiClient>,
    entity_state: tauri::State<'_, EntityManager>,
    entity: Entity,
) -> Result<ApiResponse<()>, String> {
    let response = entity_service::delete_entity::<()>(api_state.inner(), &entity).await?;
    entity_state.delete_entity_locally(&entity);
    Ok(response)
}
