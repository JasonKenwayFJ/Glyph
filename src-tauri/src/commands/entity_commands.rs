use glyph_core::entities::entity::{Entity, EntityType};
use glyph_core::managers::entity_manager;
use glyph_core::managers::entity_manager::EntityManager;
use tauri::Emitter;
use glyph_core::network::api_client::{ApiClient, ApiResponse};
use glyph_core::network::entity_service;

enum Type {
    Cards,
    Documents,
}

#[tauri::command]
pub fn get_entities(
    entity_type: EntityType,
    api_state: tauri::State<'_, ApiClient>,
    entity_state: tauri::State<'_, EntityManager>,
) -> Result<Vec<Entity>, String> {
    Ok(entity_state.get_entities(entity_type))
}

#[tauri::command]
pub async fn create_entity(
    api_state: tauri::State<'_, ApiClient>,
    entity_state: tauri::State<'_, EntityManager>,
    entity: Entity,
) -> Result<(), String> {
    entity_service::create_entity::<ApiResponse<String>>(api_state.inner(), &entity).await;
    entity_state.add_entity_locally(&entity);
    Ok(())
}

#[tauri::command]
pub async fn update_entity(
    api_state: tauri::State<'_, ApiClient>,
    entity_state: tauri::State<'_, EntityManager>,
    entity: Entity,
) -> Result<(), String> {
    entity_state.update_entity_locally(&entity);
    entity_service::update_entity::<ApiResponse<String>>(api_state.inner(), &entity).await;
    Ok(())
}
#[tauri::command]
pub async fn delete_entity(
    api_state: tauri::State<'_, ApiClient>,
    entity_state: tauri::State<'_, EntityManager>,
    entity: Entity) -> Result<(), String> {
    entity_state.delete_entity_locally(&entity);
    entity_service::delete_entity::<ApiResponse<String>>(api_state.inner(), &entity).await;
    Ok(())
}


