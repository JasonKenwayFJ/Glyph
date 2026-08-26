use crate::file_manager;
use glyph_core::entities::entity::{Entity, EntityType};
use glyph_core::managers::entity_manager::EntityManager;
use glyph_core::network::api_client::{ApiClient, ApiResponse};
use glyph_core::network::entity_service;
use tauri::{Manager};
#[tauri::command]
pub async fn get_entities(
    app: tauri::AppHandle,
    entity_state: tauri::State<'_, EntityManager>,
    r#type: EntityType,
) -> Result<Vec<Entity>, String> {
    let app_data_dir = app.path().app_data_dir().expect("no app data dir");
    let loaded = file_manager::load_entities(&app_data_dir)
        .await
        .unwrap_or_default();
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
    api_state: tauri::State<'_, ApiClient>,
    entity_state: tauri::State<'_, EntityManager>,
    entity: Entity,
) -> Result<ApiResponse<()>, String> {
    let response = entity_service::create_entity::<()>(api_state.inner(), &entity).await?;
    entity_state.add_entity_locally(&entity);
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
